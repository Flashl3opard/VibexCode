"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  const handleVibeClick = () => {
    router.push("/playground");
  };

  return (
    <nav className="w-full py-4 px-8 flex justify-between items-center bg-gradient-to-r from-[#e0c3fc] to-[#8ec5fc]">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="/assets/logo.png"
          alt="LeetCode Logo"
          className="h-10 w-auto object-contain"
        />
      </div>

      {/* Nav links */}
      <div className="hidden md:flex gap-8 text-gray-800 font-medium">
        <button className="hover:text-purple-600 transition-all">
          Practice
        </button>
        <button className="hover:text-purple-600 transition-all">
          Explore
        </button>
        <button className="hover:text-purple-600 transition-all">
          Dashboard
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="text-purple-600 font-medium hover:underline">
          Log In
        </button>
        <button className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-5 py-2 rounded-full font-semibold shadow hover:opacity-90 transition-all">
          Sign Up
        </button>
        <button
          onClick={handleVibeClick}
          className="hidden md:inline-block px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-500 animate-pulse text-white font-semibold shadow-[0_0_15px_#ff00ff] transition-all duration-300"
        >
          Start Vibing
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
