"use client";

import { useEffect, useMemo, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";
const DARK_CLASS = "dark";

/**
 * - Syncs <html> class
 * - Persists in localStorage + cookie
 * - Optional `initialTheme` lets you pass the cookie value from a Server Component
 */
export function useTheme(initialTheme?: Theme) {
  const [theme, setTheme] = useState<Theme>(initialTheme ?? "light");

  // Keep DOM + storage in sync whenever theme changes
  useEffect(() => {
    const dark = theme === "dark";
    document.documentElement.classList.toggle(DARK_CLASS, dark);

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
    try {
      document.cookie = `${STORAGE_KEY}=${theme}; Max-Age=31536000; Path=/; SameSite=Lax`;
    } catch {}
  }, [theme]);

  // On mount, reconcile with DOM class / localStorage / system preference
  useEffect(() => {
    try {
      // 1) DOM class (from an early script or server hint)
      const hasDark = document.documentElement.classList.contains(DARK_CLASS);
      let next: Theme = hasDark ? "dark" : "light";

      // 2) localStorage (wins if present)
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored === "dark" || stored === "light") next = stored;
      else if (!initialTheme) {
        // 3) system preference (only if no initial)
        const sysDark =
          typeof window !== "undefined" &&
          window.matchMedia?.("(prefers-color-scheme: dark)").matches;
        if (sysDark) next = "dark";
      }

      if (next !== theme) setTheme(next);
      // ensure class is applied even if same value
      document.documentElement.classList.toggle(DARK_CLASS, next === "dark");
    } catch {
      // ignore storage errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  const isDark = theme === "dark";
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return useMemo(
    () => ({
      isDark,
      theme,
      setTheme,
      toggleTheme,
    }),
    [isDark, theme]
  );
}
