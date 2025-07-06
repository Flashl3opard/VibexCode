'use client'

import React, { useRef, useState, useEffect } from "react";
import { FaRegPlayCircle, FaRegPauseCircle, FaStepForward } from "react-icons/fa";
import { FaBackwardStep } from "react-icons/fa6";
import Image from "next/image";

// 🎵 Array of songs
const songs = [
  {
    title: "Lo-fi Chill",
    audio: "/assets/audio/audio1.mp3",
    image: "/assets/audio1.jpg",
  },
  {
    title: "Relax Vibes",
    audio: "/assets/audio/audio2.mp3",
    image: "/assets/audio2.jpg",
  },
  {
    title: "Focus Beats",
    audio: "/assets/audio/audio3.mp3",
    image: "/assets/audio3.jpg",
  },
];

const SoundBoard = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 🧠 Load new audio when song changes
  useEffect(() => {
    const currentSong = songs[currentSongIndex];
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(currentSong.audio);
    audioRef.current.addEventListener("ended", () => {
      setIsPlaying(false);
    });

    if (isPlaying) {
      audioRef.current
        .play()
        .catch((err) => console.error("Play error:", err));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [currentSongIndex]);

  const toggleSound = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Play error:", err));
    }
  };

  const goToNextSong = () => {
    setCurrentSongIndex((prevIndex) =>
      prevIndex === songs.length - 1 ? 0 : prevIndex + 1
    );
    setIsPlaying(false); // stop current song
  };

  const goToPrevSong = () => {
    setCurrentSongIndex((prevIndex) =>
      prevIndex === 0 ? songs.length - 1 : prevIndex - 1
    );
    setIsPlaying(false); // stop current song
  };

  const currentSong = songs[currentSongIndex];

  return (
    <div className="w-72 bg-zinc-900 rounded-2xl shadow-lg p-4 flex flex-col items-center gap-4">
      <div className="w-full aspect-square overflow-hidden rounded-xl">
        <Image
          src={currentSong.image}
          className="object-cover w-full h-full"
          alt={currentSong.title}
          height={300}
          width={600}
        />
      </div>

      <h3 className="text-white text-lg font-semibold text-center">
        {currentSong.title}
      </h3>

      <div className="flex items-center justify-center gap-6 text-white text-3xl">
        <button className="hover:text-zinc-400 transition" onClick={goToPrevSong}>
          <FaBackwardStep />
        </button>

        <button className="hover:text-green-400 transition" onClick={toggleSound}>
          {isPlaying ? <FaRegPauseCircle /> : <FaRegPlayCircle />}
        </button>

        <button className="hover:text-zinc-400 transition" onClick={goToNextSong}>
          <FaStepForward />
        </button>
      </div>
    </div>
  );
};

export default SoundBoard;
