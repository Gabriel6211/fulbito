"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export function useAuthRefresh() {
  const router = useRouter();
  const refreshUserData = useAuthStore((state) => state.refreshUserData);

  /**
   * Refreshes user data from the backend and updates the Zustand store.
   * This will trigger a re-render of components subscribed to the store.
   */
  const refreshUser = async () => {
    await refreshUserData();
  };

  /**
   * Refreshes server components by re-fetching data on the server.
   * Use this when you need to update server-rendered data (e.g., after profile update).
   * This will cause UserTopbarServer to re-fetch user data from the server.
   */
  const refreshServer = () => {
    router.refresh();
  };

  /**
   * Refreshes both user data and server components.
   * Use this for comprehensive updates (e.g., after profile changes).
   */
  const refreshAll = async () => {
    await refreshUser();
    refreshServer();
  };

  return {
    refreshUser,
    refreshServer,
    refreshAll,
  };
}

