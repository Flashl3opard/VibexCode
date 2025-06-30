"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleVibeClick = () => {
    router.push("/playground");
  };

  return (
    <nav className="w-full py-4 px-6 md:px-8 bg-gradient-to-r from-[#e0c3fc] to-[#8ec5fc] relative z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-3xl text-purple-600 focus:outline-none"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
          <div className="flex items-center text-2xl font-bold">
            <span className="text-pink-600">VibeX</span>
            <span className="text-white">Code</span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-8 text-gray-800 font-medium items-center">
          <Link
            href="/playground"
            className="hover:text-purple-600 transition-all"
          >
            Practice
          </Link>
          <Link
            href="/Dashboard"
            className="hover:text-purple-600 transition-all"
          >
            Explore
          </Link>
          <Link
            href="/Dashboard"
            className="hover:text-purple-600 transition-all"
          >
            Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden md:block text-purple-600 font-medium hover:underline"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-4 py-2 rounded-full font-semibold shadow hover:opacity-90 transition-all text-sm"
          >
            Sign Up
          </Link>
          <button
            onClick={handleVibeClick}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-500 animate-pulse text-white text-sm font-semibold shadow-[0_0_10px_#ff00ff] transition-all duration-300"
          >
            Start Vibing
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="absolute top-full left-0 w-full md:hidden flex flex-col gap-3 bg-gradient-to-r from-[#e0c3fc] to-[#8ec5fc] rounded-b-lg p-4 shadow-md z-40">
          <Link
            href="/playground"
            className="text-left text-gray-800 font-medium hover:text-purple-600 transition-all"
          >
            Practice
          </Link>
          <Link
            href="/profile"
            className="text-left text-gray-800 font-medium hover:text-purple-600 transition-all"
          >
            Explore
          </Link>
          <Link
            href="/profile"
            className="text-left text-gray-800 font-medium hover:text-purple-600 transition-all"
          >
            Dashboard
          </Link>
          <Link
            href="/login"
            className="text-left text-purple-600 font-medium hover:underline transition-all"
          >
            Log In
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
