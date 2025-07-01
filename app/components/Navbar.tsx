"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleVibeClick = () => {
    router.push("/playground");
  };

  return (
    <nav className="w-full py-4 px-6 md:px-8 bg-gradient-to-r from-[#e0c3fc] to-[#8ec5fc] relative z-50">
      <div className="flex items-center justify-between">
        {/* Logo and Mobile Menu Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-3xl text-purple-600 focus:outline-none cursor-pointer"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
          <div className="flex items-center text-2xl font-bold cursor-pointer">
            <span className="text-pink-600">VibeX</span>
            <span className="text-white">Code</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-8 text-gray-800 font-medium items-center">
          <Link
            href="/playground"
            className="hover:text-purple-600 transition-all cursor-pointer"
          >
            Practice
          </Link>
          <Link
            href="/Dashboard"
            className="hover:text-purple-600 transition-all cursor-pointer"
          >
            Explore
          </Link>
          <Link
            href="/Dashboard"
            className="hover:text-purple-600 transition-all cursor-pointer"
          >
            Dashboard
          </Link>
        </div>

        {/* Auth Buttons and Theme Toggle */}
        <div className="hidden min-[500px]:flex items-center gap-3">
          <Link
            href="/login"
            className="text-purple-600 font-medium hover:underline cursor-pointer"
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
            className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-500 animate-pulse text-white text-sm font-semibold shadow-[0_0_10px_#ff00ff] transition-all duration-300 cursor-pointer"
          >
            Start Vibing
          </button>

          {/* ✅ Theme Toggle Button */}
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full md:hidden flex flex-col items-start gap-3 bg-gradient-to-r from-[#e0c3fc] to-[#8ec5fc] rounded-b-lg p-4 shadow-md z-40">
          <Link
            href="/playground"
            className="text-gray-800 font-medium hover:text-purple-600 transition-all cursor-pointer"
          >
            Practice
          </Link>
          <Link
            href="/Dashboard"
            className="text-gray-800 font-medium hover:text-purple-600 transition-all cursor-pointer"
          >
            Explore
          </Link>
          <Link
            href="/Dashboard"
            className="text-gray-800 font-medium hover:text-purple-600 transition-all cursor-pointer"
          >
            Dashboard
          </Link>

          {/* Auth buttons - only for screen < 500px */}
          <div className="max-[499px]:flex hidden flex-col items-start gap-3">
            <Link
              href="/login"
              className="text-purple-600 font-medium hover:underline transition-all cursor-pointer"
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
              className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-500 animate-pulse text-white text-sm font-semibold shadow-[0_0_10px_#ff00ff] transition-all duration-300 cursor-pointer"
            >
              Start Vibing
            </button>

            {/* ✅ Theme Toggle in mobile */}
            <ThemeToggle />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
