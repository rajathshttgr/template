"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

const ThemeToggle = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" || !theme ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full transition-colors duration-300 ease-in-out group"
    >
      <div className="relative w-4 h-4">
        <SunIcon
          className={`absolute w-4 h-4 transition-opacity duration-500 ease-in-out ${
            isDark ? "opacity-0" : "opacity-100"
          } text-black dark:text-white`}
        />
        <MoonIcon
          className={`absolute w-4 h-4 transition-opacity duration-500 ease-in-out ${
            isDark ? "opacity-100" : "opacity-0"
          } text-black dark:text-white`}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
