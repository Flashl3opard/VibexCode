"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";

const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleVibeClick = () => {
    router.push("/playground");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
    router.refresh(); // optional reload
  };

  return (
    <nav className="w-full py-4 px-6 md:px-8 relative z-30 bg-transparent dark:bg-[#020612] transition-all">
      <div className="flex items-center justify-between">
        {/* Left Section: Logo + Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-3xl text-purple-600 dark:text-teal-300 focus:outline-none cursor-pointer"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
          <Logo />
        </div>

        {/* Middle Nav Links (Desktop Only) */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/playground"
            className="text-gray-800 dark:text-white font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all"
          >
            Practice
          </Link>
          <Link
            href="/Explore"
            className="text-gray-800 dark:text-white font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all"
          >
            Explore
          </Link>
          <Link
            href="/Dashboard"
            className="text-gray-800 dark:text-white font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all"
          >
            Dashboard
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Auth Buttons */}
          <div className="hidden min-[500px]:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  className="text-purple-600 dark:text-teal-300 font-medium hover:underline cursor-pointer"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:underline font-medium cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
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
              </>
            )}

            <button
              onClick={handleVibeClick}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-500 animate-pulse text-white text-sm font-semibold shadow-[0_0_10px_#ff00ff] hover:opacity-90 transition-all duration-300 cursor-pointer"
            >
              Start Vibing
            </button>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full md:hidden flex flex-col items-start gap-3 bg-gradient-to-r from-[#e0c3fc] to-[#8ec5fc] dark:from-zinc-900 dark:to-zinc-800 rounded-b-lg p-4 shadow-md z-40 transition-all">
          <Link
            href="/playground"
            className="text-gray-800 dark:text-white font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all"
          >
            Practice
          </Link>
          <Link
            href="/Explore"
            className="text-gray-800 dark:text-white font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all"
          >
            Explore
          </Link>
          <Link
            href="/Dashboard"
            className="text-gray-800 dark:text-white font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all"
          >
            Dashboard
          </Link>

          {/* Mobile Auth */}
          <div className="flex flex-col items-start gap-3">
            {isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  className="text-purple-600 dark:text-teal-300 font-medium hover:underline"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:underline font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-purple-600 dark:text-teal-300 font-medium hover:underline"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-4 py-2 rounded-full font-semibold shadow hover:opacity-90 transition-all text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
            <button
              onClick={handleVibeClick}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-500 animate-pulse text-white text-sm font-semibold shadow-[0_0_10px_#ff00ff] hover:opacity-90 transition-all duration-300"
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
