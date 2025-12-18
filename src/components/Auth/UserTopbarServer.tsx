import { cookies } from "next/headers";
import { adminAuth } from "@/firebase/firebaseAdmin";
import { getUserById } from "@/services/userService";
import { TubilleteraUser } from "@/types/auth";
import UserTopbarClient from "./UserTopbarClient";

/**
 * Server Component that fetches user data and renders it directly in the HTML.
 *
 * This component:
 * 1. Fetches user data on the server (reads cookie, verifies token, fetches from backend)
 * 2. Renders the user UI directly in the server-rendered HTML
 * 3. Passes data to client component for interactivity (login modal, etc.)
 *
 * This eliminates the hydration gap - user data is in the HTML from the start!
 */
export default async function UserTopbarServer() {
  const cookieStore = await cookies();
  const idToken = cookieStore.get("token")?.value;

  let user: TubilleteraUser | null = null;

  if (idToken) {
    try {
      // Verify token and fetch user from backend
      const decodedToken = await adminAuth.verifyIdToken(idToken);

      try {
        const response = await getUserById(decodedToken.uid);
        if (response?.user && response.user.fullName) {
          user = response.user;
        } else {
          // Fallback: construct from token
          user = {
            uid: decodedToken.uid,
            id: decodedToken.uid,
            email: decodedToken.email || "",
            fullName: decodedToken.name || decodedToken.email?.split("@")[0] || "User",
            photo: null,
          };
        }
      } catch {
        // User doesn't exist in backend - construct from Firebase Admin
        const userRecord = await adminAuth.getUser(decodedToken.uid);
        user = {
          uid: decodedToken.uid,
          id: decodedToken.uid,
          email: decodedToken.email || userRecord.email || "",
          fullName:
            userRecord.displayName ||
            decodedToken.name ||
            decodedToken.email?.split("@")[0] ||
            "User",
          photo: null,
        };
      }
    } catch {
      // Token invalid - user is logged out
      user = null;
    }
  }

  // Render user data directly in HTML (no client-side hydration needed!)
  // Pass to client component only for interactivity (login modal, etc.)
  return <UserTopbarClient initialUser={user} />;
}
