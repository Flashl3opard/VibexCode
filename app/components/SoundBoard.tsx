import React from "react";
import { FaRegPlayCircle } from "react-icons/fa";
import { FaStepForward } from "react-icons/fa";
import { FaBackwardStep } from "react-icons/fa6";
import Image from "next/image";

const SoundBoard = () => {
  return (
    <div className="w-64 bg-zinc-900 rounded-2xl shadow-lg p-4 flex flex-col items-center gap-4">
      <div className="w-full aspect-square overflow-hidden rounded-xl">
        <Image
          src="/assets/song1.png"
          className="object-cover w-full h-full"
          alt="helo"
          height={300}
          width={600}
        />
      </div>

      <div className="flex items-center justify-center gap-6 text-white text-3xl">
        <button className="hover:text-zinc-400 transition">
          <FaBackwardStep />
        </button>
        <button className="hover:text-green-400 transition">
          <FaRegPlayCircle />
        </button>
        <button className="hover:text-zinc-400 transition">
          <FaStepForward />
        </button>
      </div>
    </div>
  );
};

export default SoundBoard;
