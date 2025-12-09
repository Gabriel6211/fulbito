import { create } from "zustand";
import { onAuthStateChanged, onIdTokenChanged, signOut, Unsubscribe, User } from "firebase/auth";
import { auth } from "@/firebase/clientApp";
import { getUserById, createUser } from "@/services/userService";
import { TubilleteraUser } from "@/types/auth";

interface UserState {
  currentUser: TubilleteraUser | null;
  initialized: boolean;
  hydrated: boolean; // Track if server-side hydration has happened
  listenersInitialized: boolean; // Track if Firebase listeners are set up
  handleLogout: () => Promise<void>;
  setUserState: (user: TubilleteraUser | null) => void;
  hydrateFromServer: (user: TubilleteraUser | null) => void;
  refreshUserData: () => Promise<void>; // Manually refresh user data from backend
  initializeAuthListener: () => () => void; // Returns cleanup function
}

export const useAuthStore = create<UserState>((set, get) => ({
  currentUser: null,
  initialized: false,
  hydrated: false,
  listenersInitialized: false,

  // Set user state and mark as initialized
  setUserState: (user: TubilleteraUser | null) => set({ currentUser: user, initialized: true }),

  // Hydrate from server-side - this should happen first
  hydrateFromServer: (user: TubilleteraUser | null) => {
    set({ currentUser: user, hydrated: true, initialized: true });
  },

  handleLogout: async () => {
    try {
      await signOut(auth);
      // The listener will handle updating the state
    } catch (error) {
      console.error("Logout Failed:", error);
    }
  },

  // Manually refresh user data from backend
  // Use this when user data changes (e.g., after profile update)
  // Also handles logout case - checks Firebase auth state first
  refreshUserData: async () => {
    // Check Firebase auth state first (source of truth for login status)
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      // User is logged out - clear the store
      set({ currentUser: null, initialized: true });
      return;
    }

    // User is logged in - fetch latest data from backend
    try {
      const response = await getUserById(firebaseUser.uid);
      if (response?.user) {
        set({ currentUser: response.user });
      } else {
        // User exists in Firebase but not in backend - construct from Firebase data
        const userRecord = {
          uid: firebaseUser.uid,
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          fullName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
          photo: null,
        };
        set({ currentUser: userRecord });
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
      // On error, still try to construct from Firebase data
      const userRecord = {
        uid: firebaseUser.uid,
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        fullName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
        photo: null,
      };
      set({ currentUser: userRecord });
    }
  },

  // Initialize Firebase auth listeners - returns cleanup function
  initializeAuthListener: () => {
    const state = get();

    // Prevent duplicate listener setup
    if (state.listenersInitialized) {
      // Return no-op cleanup if listeners are already initialized
      return () => {};
    }

    // Mark listeners as initialized
    set({ listenersInitialized: true });

    // Store unsubscribe functions
    let authUnsubscribe: Unsubscribe | null = null;
    let tokenUnsubscribe: Unsubscribe | null = null;

    // Helper function to ensure user exists in backend
    // This function ensures ALL users (Google and email/password) have a record in the backend
    const ensureUserInBackend = async (user: User): Promise<TubilleteraUser> => {
      try {
        // First, try to get user from backend
        const response = await getUserById(user.uid);
        if (response?.user && response.user.fullName) {
          // User exists in backend, return it
          return response.user;
        }
      } catch {
        // User doesn't exist in backend (404 or other error)
        // This is expected for Google users on first sign-in
        console.log("User not found in backend, will create:", user.uid);
      }

      // User doesn't exist in backend - create them
      // Determine fullName based on provider
      let fullName = "";
      let photo: string | null = null;
      const provider = user.providerData[0];

      if (provider?.providerId === "google.com") {
        // Google user - get name from provider
        fullName = provider.displayName || user.displayName || "";
        photo = user.photoURL;
      } else {
        // Email/password user - should already have name from sign-up,
        // but use the same fallback logic as for any provider.
        fullName = user.displayName || user.email?.split("@")[0] || "User";
        photo = user.photoURL || "";
      }
      // Create user in backend
      try {
        const token = await user.getIdToken();
        await createUser({ fullName, photo }, token);

        // After creating, fetch the user to get the complete record
        try {
          const createResponse = await getUserById(user.uid);
          if (createResponse?.user) {
            return createResponse.user;
          }
        } catch (fetchError) {
          // If fetch after create fails, construct from what we know
          console.warn("Failed to fetch user after creation, using constructed data:", fetchError);
        }

        // Return constructed user object if fetch fails
        return {
          uid: user.uid,
          id: user.uid,
          email: user.email || "",
          fullName,
          photo,
        };
      } catch (createError) {
        // If create fails (network error, server error, etc.),
        // construct user object from Firebase data as fallback
        console.error("Failed to create user in backend:", createError);
        return {
          uid: user.uid,
          id: user.uid,
          email: user.email || "",
          fullName: fullName,
          photo,
        };
      }
    };

    // Set up auth state listener
    authUnsubscribe = onAuthStateChanged(auth, async (user) => {
      // Only update if we've already hydrated from server
      // This prevents overwriting server state before hydration completes
      const currentState = get();
      if (!currentState.hydrated) {
        // Wait for server hydration first - the listener will fire again
        // after hydration completes (or we can trigger a re-check)
        return;
      }

      if (user && user.uid) {
        try {
          // Always fetch from backend first (single source of truth)
          // This will create the user if they don't exist (for Google users)
          const userInformation = await ensureUserInBackend(user);

          if (userInformation) {
            set({ currentUser: userInformation, initialized: true });
          } else {
            console.error("Failed to get user information for:", user.uid);
            set({ currentUser: null, initialized: true });
          }
        } catch (error) {
          console.error("Error in auth state listener:", error);
          set({ currentUser: null, initialized: true });
        }
      } else {
        // User is signed out
        set({ currentUser: null, initialized: true });
      }
    });

    // Set up token listener for session cookie management
    tokenUnsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          await fetch("/api/session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          });
        } catch (error) {
          console.error("Error setting session cookie:", error);
        }
      } else {
        try {
          await fetch("/api/session/logout", { method: "POST" });
        } catch (error) {
          console.error("Error clearing session cookie:", error);
        }
      }
    });

    // Return cleanup function
    return () => {
      if (authUnsubscribe) authUnsubscribe();
      if (tokenUnsubscribe) tokenUnsubscribe();
      // Reset listeners initialized flag on cleanup
      set({ listenersInitialized: false });
    };
  },
}));
