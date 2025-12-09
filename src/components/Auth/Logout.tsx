"use client";

import { useAuthStore } from "@/store/useAuthStore";

import { useAuthRefresh } from "@/utils/authHelpers";

export default function Logout() {
  const { refreshAll } = useAuthRefresh();

  const onLogout = async () => {
    await useAuthStore.getState().handleLogout();
    refreshAll();
  };

  return <button onClick={onLogout}>Logout</button>;
}