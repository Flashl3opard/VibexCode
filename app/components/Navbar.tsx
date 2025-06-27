"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleVibeClick = () => {
    router.push("/playground");
  };

  return (
    <nav className="bg-zinc-900 shadow-md px-6 py-4 text-white">
      <div className="flex items-center justify-between">
        {/* Logo Image */}
        <div className="flex items-center space-x-2">
          <img
            src="/assets/logo.png"
            alt="VibeXcode Logo"
            className="h-10 w-auto object-contain rounded-xl scale-150"
          />
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-3xl text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex flex-1 items-center justify-center text-lg font-medium">
          <ul className="flex gap-x-6">
            {["Dashboard", "Leaderboards", "Profile"].map((item) => (
              <li
                key={item}
                className="px-4 py-2 rounded-full cursor-pointer transition-all hover:border hover:border-yellow-300 hover:bg-amber-400 hover:text-black"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <button
            onClick={handleVibeClick}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-500 animate-pulse text-white font-semibold shadow-[0_0_15px_#ff00ff] transition-all duration-300"
          >
            Start Vibing
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <ul className="flex flex-col md:hidden gap-4 mt-4 text-lg font-medium">
          {["Dashboard", "Leaderboards", "Profile"].map((item) => (
            <li
              key={item}
              className="px-4 py-2 rounded-md cursor-pointer hover:border hover:border-yellow-300 hover:bg-amber-400 hover:text-black transition-colors"
            >
              {item}
            </li>
          ))}
          <li>
            <button
              onClick={handleVibeClick}
              className="w-full px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-500 animate-pulse text-white font-semibold shadow-[0_0_15px_#ff00ff] transition-all duration-300"
            >
              Start Vibing
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
