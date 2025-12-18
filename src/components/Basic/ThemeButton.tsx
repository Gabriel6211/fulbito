"use client";
import Button from "@/components/Basic/Button";
import { useTheme } from "@/hooks/useTheme";

// Icons
import { FaRegMoon } from "react-icons/fa";
import { FiSun } from "react-icons/fi";

export default function ThemeButton({ initialTheme }: { initialTheme?: "light" | "dark" }) {
  const { toggleTheme, isDark } = useTheme(initialTheme);

  const icon = isDark ? <FiSun size={16} /> : <FaRegMoon size={16} />;

  return (
    <div className="h-full">
      <Button variant="secondary" onClick={toggleTheme} className="px-2 h-full">
        {icon}
      </Button>
    </div>
  );
}
