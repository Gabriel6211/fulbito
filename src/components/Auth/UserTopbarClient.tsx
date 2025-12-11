"use client";

import { useState, useLayoutEffect, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuthRefresh } from "@/utils/authHelpers";
import { TubilleteraUser } from "@/types/auth";
import Button from "@/components/Basic/Button";
import AuthForm from "@/components/Auth/AuthForm";

import Link from "next/link";

import { LuCircleHelp, LuLogOut, LuUser } from "react-icons/lu";

import Image from "next/image";

interface UserTopbarClientProps {
  initialUser: TubilleteraUser | null;
}

/**
 * Client component that handles interactivity and syncs with Firebase.
 *
 * UPDATE FLOW:
 * 1. Initial render: Uses server data (initialUser) - already in HTML!
 * 2. After hydration: Zustand store is updated with server data
 * 3. Firebase listeners: Automatically update store on auth changes (login/logout)
 * 4. Store updates: Component automatically re-renders when store changes
 *
 * The component subscribes to Zustand store, so any update to currentUser
 * will automatically trigger a re-render with the new data.
 *
 * For server-side updates (e.g., profile changes), use router.refresh() to
 * re-fetch server data, or manually update the store via useAuthStore.
 */
export default function UserTopbarClient({ initialUser }: UserTopbarClientProps) {
  const hydrateFromServer = useAuthStore((state) => state.hydrateFromServer);
  const initializeAuthListener = useAuthStore((state) => state.initializeAuthListener);
  // Subscribe to store - component will re-render when currentUser changes!
  const currentUser = useAuthStore((state) => state.currentUser);
  const hydrated = useAuthStore((state) => state.hydrated);

  const [signInModalShown, setSignInModalShown] = useState(false);

  // Hydrate store and set up listeners (runs once on mount)
  useLayoutEffect(() => {
    // Hydrate store with server data
    hydrateFromServer(initialUser);

    // Set up Firebase listeners for real-time updates
    // These will automatically update the store when auth state changes
    const cleanup = initializeAuthListener();
    return cleanup;
  }, [hydrateFromServer, initializeAuthListener, initialUser]);

  // Use store state after hydration (even if null - for logout case)
  // Before hydration, use initial server data
  // This ensures logout properly shows login button (currentUser = null)
  const displayUser = hydrated ? currentUser : initialUser;

  const [dropdownMenuShown, setDropdownMenuShown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutUserSnapshot, setLogoutUserSnapshot] = useState<TubilleteraUser | null>(null);
  const renderedUser = isLoggingOut ? logoutUserSnapshot ?? displayUser : displayUser;
  const shouldShowLoginButton = !renderedUser && !isLoggingOut;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownMenuShown(false);
      }
    };

    if (dropdownMenuShown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownMenuShown]);

  useEffect(() => {
    // Reset placeholder when the photo changes
    setImageLoaded(false);
  }, [renderedUser?.photo]);

  const { refreshAll } = useAuthRefresh();

  const onLogout = async () => {
    const latestUser = useAuthStore.getState().currentUser ?? displayUser ?? null;
    if (latestUser) {
      setLogoutUserSnapshot(latestUser);
    }
    setIsLoggingOut(true);
    setDropdownMenuShown(false);
    await useAuthStore.getState().handleLogout();
    refreshAll();
  };

  return (
    <div>
      {renderedUser ? (
        <div ref={dropdownRef} className="h-full flex items-center gap-2 relative">
          <div className="relative w-8 h-8">
            {!imageLoaded && (
              <div
                className="absolute inset-0 rounded-full bg-neutral-800 pointer-events-none"
                aria-hidden
              />
            )}
            <Image
              src={renderedUser.photo || "/images/DefaultUser.jpg"}
              alt="User Photo"
              className={`w-8 h-8 rounded-full cursor-pointer transition-opacity ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              width={32}
              height={32}
              onClick={() => setDropdownMenuShown(!dropdownMenuShown)}
              onLoadingComplete={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
            />
          </div>
          {dropdownMenuShown && (
            <div className="absolute top-full right-0 mt-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg p-3 z-50 w-max">
              <div className="flex flex-row gap-2 items-center">
                <Image
                  src={renderedUser.photo || "/images/DefaultUser.jpg"}
                  alt="User Photo"
                  className="w-8 h-8 rounded-full"
                  width={32}
                  height={32}
                />
                <div>
                  <p className="text-xs font-medium text-[var(--text)]">{renderedUser.fullName}</p>{" "}
                  <p className="text-xs text-[var(--secondary-muted)]">{renderedUser.email}</p>
                </div>
              </div>
              <hr className="w-full border-0 h-[1px] bg-[var(--border)] my-2" />
              <div className="flex flex-col">
                <Link
                  href="/profile"
                  className="flex flex-row gap-2 items-center text-sm font-medium cursor-pointer hover:bg-[var(--muted)] rounded-lg p-2"
                >
                  <LuUser className="text-[var(--secondary-muted)] w-4 h-4" size={16} />
                  Profile
                </Link>
                <Link
                  href="/help"
                  className="flex flex-row gap-2 items-center text-sm font-medium cursor-pointer hover:bg-[var(--muted)] rounded-lg p-2"
                >
                  <LuCircleHelp className="text-[var(--secondary-muted)] w-4 h-4" size={16} />
                  Help Center
                </Link>
                <hr className="w-full border-0 h-[1px] bg-[var(--border)] my-2" />
                <button
                  onClick={onLogout}
                  className="flex flex-row gap-2 items-center text-sm font-medium cursor-pointer hover:bg-[var(--muted)] rounded-lg p-2"
                  role="button"
                  tabIndex={0}
                >
                  <LuLogOut className="text-[var(--secondary-muted)] w-4 h-4" size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      ) : shouldShowLoginButton ? (
        <Button variant="primary" onClick={() => setSignInModalShown(true)} className="px-3 h-full">
          Login
        </Button>
      ) : null}
      {signInModalShown && !renderedUser && (
        <AuthForm isOpen={signInModalShown} onClose={() => setSignInModalShown(false)} />
      )}
    </div>
  );
}
