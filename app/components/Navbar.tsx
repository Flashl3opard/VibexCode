"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";

const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleVibeClick = () => {
    router.push("/playground");
  };

  return (
    <nav className="w-full py-4 px-6 md:px-8 relative z-50 dark:bg-[#020612] transition-all">
      <div className="flex items-center justify-between">
        {/* Left Section: Menu + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-3xl text-purple-600 dark:text-teal-300 focus:outline-none cursor-pointer"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
          <Logo />
        </div>

        {/* Middle Section: Nav Links (Desktop Only) */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/playground"
            className="text-gray-800 dark:text-white font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all cursor-pointer"
          >
            Practice
          </Link>
          <Link
            href="/Dashboard"
            className="text-gray-800 dark:text-white font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all cursor-pointer"
          >
            Explore
          </Link>
          <Link
            href="/Dashboard"
            className="text-gray-800 dark:text-white font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all cursor-pointer"
          >
            Dashboard
          </Link>
        </div>

        {/* Right Section: Auth Buttons + ThemeToggle */}
        <div className="flex items-center gap-3">
          <div className="hidden min-[500px]:flex items-center gap-3">
            <Link
              href="/login"
              className="text-purple-600 dark:text-teal-300 font-medium hover:underline cursor-pointer"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-4 py-2 rounded-full font-semibold shadow hover:opacity-90 transition-all text-sm cursor-pointer"
            >
              Sign Up
            </Link>
            <button
              onClick={handleVibeClick}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-500 animate-pulse text-white text-sm font-semibold shadow-[0_0_10px_#ff00ff] hover:opacity-90 transition-all duration-300 cursor-pointer"
            >
              Start Vibing
            </button>
          </div>

          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full md:hidden flex flex-col items-start gap-3 bg-gradient-to-r from-[#e0c3fc] to-[#8ec5fc] dark:from-zinc-900 dark:to-zinc-800 rounded-b-lg p-4 shadow-md z-40 transition-all">
          <Link
            href="/playground"
            className="text-gray-800 dark:text-white font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all cursor-pointer"
          >
            Practice
          </Link>
          <Link
            href="/Dashboard"
            className="text-gray-800 dark:text-white font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all cursor-pointer"
          >
            Explore
          </Link>
          <Link
            href="/Dashboard"
            className="text-gray-800 dark:text-white font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all cursor-pointer"
          >
            Dashboard
          </Link>

          {/* Mobile Auth Buttons */}
          <div className="max-[499px]:flex hidden flex-col items-start gap-3">
            <Link
              href="/login"
              className="text-purple-600 dark:text-teal-300 font-medium hover:underline transition-all cursor-pointer"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-4 py-2 rounded-full font-semibold shadow hover:opacity-90 transition-all text-sm cursor-pointer inline-block"
            >
              Sign Up
            </Link>
            <button
              onClick={handleVibeClick}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-500 animate-pulse text-white text-sm font-semibold shadow-[0_0_10px_#ff00ff] hover:opacity-90 transition-all duration-300 cursor-pointer"
            >
              Start Vibing
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
