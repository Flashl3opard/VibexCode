"use client";
import React, { useState } from "react";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-zinc-700 shadow-md px-6 py-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-2xl font-bold font-sans border-2 p-2 rounded-2xl border-zinc-900 shadow-[0_0_15px_#39FF14] bg-zinc-800">
          <h1 className="text-yellow-400">Vibe</h1>
          <h1 className="bg-gradient-to-r from-orange-500 via-red-600 to-orange-500 text-transparent bg-clip-text font-extrabold rotate-90 text-4xl font-seriff">
            X
          </h1>
          <h1 className="text-blue-400">Code</h1>
        </div>

        <button
          className="md:hidden text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>

        <div className="hidden md:flex flex-1 items-center justify-center text-lg font-medium">
          <ul className="flex gap-x-6">
            <li className="px-4 py-2 rounded-full cursor-pointer transition-colors hover:border hover:border-yellow-300 hover:bg-amber-400">
              Dashboard
            </li>
            <li className="px-4 py-2 rounded-full cursor-pointer transition-colors hover:border hover:border-yellow-300 hover:bg-amber-400">
              Leaderboards
            </li>
            <li className="px-4 py-2 rounded-full cursor-pointer transition-colors hover:border hover:border-yellow-300 hover:bg-amber-400">
              Profile
            </li>
          </ul>
        </div>

        <div className="hidden md:block">
          <button className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-500 animate-pulse text-white font-semibold shadow-[0_0_15px_#ff00ff] transition-all duration-300">
            Start Vibing
          </button>
        </div>
      </div>

      {menuOpen && (
        <ul className="flex flex-col md:hidden gap-4 mt-4 text-lg font-medium">
          <li className="px-4 py-2 rounded-md cursor-pointer hover:border hover:border-yellow-300 hover:bg-amber-400 transition-colors">
            Dashboard
          </li>
          <li className="px-4 py-2 rounded-md cursor-pointer hover:border hover:border-yellow-300 hover:bg-amber-400 transition-colors">
            Leaderboards
          </li>
          <li className="px-4 py-2 rounded-md cursor-pointer hover:border hover:border-yellow-300 hover:bg-amber-400 transition-colors">
            Profile
          </li>
          <li>
            <button className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-500 animate-pulse text-white font-semibold shadow-[0_0_15px_#ff00ff] transition-all duration-300">
              Start Vibing
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
