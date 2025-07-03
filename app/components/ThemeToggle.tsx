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
      className="w-10 h-10 flex items-center justify-center rounded-full text-xl transition-transform duration-500 ease-in-out hover: hover:scale-110"
    >
      <span className="relative w-6 h-6 block">
        <FaSun
          className={`absolute inset-0 transition-all duration-500 ease-in-out ${
            darkMode
              ? "opacity-100 rotate-0 scale-100 text-yellow-400"
              : "opacity-0 -rotate-90 scale-75"
          }`}
        />
        <FaMoon
          className={`absolute inset-0 transition-all duration-500 ease-in-out ${
            darkMode
              ? "opacity-0 rotate-90 scale-75"
              : "opacity-100 rotate-0 scale-100 text-black"
          }`}
        />
      </span>
    </button>
  );
}
