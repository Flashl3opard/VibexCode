"use client";

import { useEffect, useState } from "react";
import { FaSun } from "react-icons/fa";
import { FaMoon } from "react-icons/fa6";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = localStorage.getItem("theme") === "dark";
      setDarkMode(isDark);
      document.documentElement.classList.toggle("dark", isDark);
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Dark Mode"
      className="w-10 h-10 flex items-center justify-center rounded-full     text-xl transition-transform duration-300 hover:rotate-180 scale-120 "
    >
      {darkMode ? (
        <FaSun className="text-yellow-400" />
      ) : (
        <FaMoon className="text-black" />
      )}
    </button>
  );
}
