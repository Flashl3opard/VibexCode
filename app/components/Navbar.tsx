import React from "react";

const Navbar = () => {
  return (
    <nav className="h-auto max-w-screen bg-zinc-700 shadow-md p-5">
      <div className="flex flex-row items-center justify-start text-white text-2xl gap-1 font-bold font-sans border-2 w-min p-2 rounded-2xl border-zinc-900 shadow-[0_0_15px_#39FF14] bg-zinc-800">
        <h1 className="text-yellow-400">Vibe</h1>
        <h1 className="bg-gradient-to-r from-orange-500 via-red-600 to-orange-500 text-transparent bg-clip-text font-extrabold rotate-90 text-4xl font-seriff">
          X
        </h1>
        <h1 className="text-blue-400">Code</h1>
      </div>
    </nav>
  );
};

export default Navbar;
