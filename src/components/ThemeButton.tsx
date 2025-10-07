"use client";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeButton({ initialTheme }: { initialTheme?: "light" | "dark" }) {
  const { theme, isDark, toggleTheme } = useTheme(initialTheme);

  return (
    <div>
      <button onClick={toggleTheme}>Change Theme</button>
      <p>
        {isDark}, {theme}
      </p>
    </div>
  );
}
