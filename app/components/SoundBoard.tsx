"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  FaRegPlayCircle,
  FaRegPauseCircle,
  FaStepForward,
} from "react-icons/fa";
import { FaBackwardStep } from "react-icons/fa6";
import Image from "next/image";

// 🎵 Song List
const songs = [
  {
    title: "Baawe",
    audio: "/assets/audio/audio1.mp3",
    image: "/assets/audio1.jpg",
  },
  {
    title: "Ik Kudi",
    audio: "/assets/audio/audio2.mp3",
    image: "/assets/audio2.jpg",
  },
  {
    title: "Sapphire",
    audio: "/assets/audio/audio3.mp3",
    image: "/assets/audio3.jpg",
  },
];

const SoundBoard = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = songs[currentSongIndex];

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const toggleSound = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Play error:", err));
    }
  };

  const goToNextSong = () => {
    setCurrentSongIndex((prev) => (prev === songs.length - 1 ? 0 : prev + 1));
    setIsPlaying(true);
  };

  const goToPrevSong = () => {
    setCurrentSongIndex((prev) => (prev === 0 ? songs.length - 1 : prev - 1));
    setIsPlaying(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const playFromPlaylist = (index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  // 🔁 Load new audio when song index changes
  useEffect(() => {
    const song = new Audio(currentSong.audio);
    audioRef.current?.pause();
    audioRef.current = song;
    song.volume = 1; // optional: set to max volume

    const updateProgress = () => {
      if (song.ended) {
        goToNextSong();
        return;
      }
      setCurrentTime(song.currentTime);
      setDuration(song.duration || 0);
      requestAnimationFrame(updateProgress);
    };

    song.addEventListener("loadedmetadata", () => {
      setDuration(song.duration);
    });

    if (isPlaying) {
      song.play().catch((err) => console.error("Play error:", err));
      requestAnimationFrame(updateProgress);
    }

    return () => {
      song.pause();
    };
  }, [currentSong.audio, isPlaying]);

  return (
    <div className="w-80 bg-zinc-900 rounded-2xl shadow-lg p-4 flex flex-col items-center gap-4 text-white">
      {/* 🎵 Album Cover */}
      <div className="w-full aspect-square overflow-hidden rounded-xl">
        <Image
          src={currentSong.image}
          className="object-cover w-full h-full"
          alt={currentSong.title}
          height={300}
          width={600}
        />
      </div>

      {/* ⏱ Timeline */}
      <div className="w-full flex flex-col gap-1">
        <input
          type="range"
          min={0}
          max={isNaN(duration) ? 0 : duration}
          value={isNaN(currentTime) ? 0 : currentTime}
          onChange={handleSeek}
          className="w-full h-1 accent-green-500 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-400 px-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* 📝 Title */}
      <h3 className="text-white text-lg font-semibold text-center">
        {currentSong.title}
      </h3>

      {/* 🎚 Controls */}
      <div className="flex items-center justify-center gap-6 text-3xl">
        <button className="hover:text-zinc-400" onClick={goToPrevSong}>
          <FaBackwardStep />
        </button>
        <button className="hover:text-green-400" onClick={toggleSound}>
          {isPlaying ? <FaRegPauseCircle /> : <FaRegPlayCircle />}
        </button>
        <button className="hover:text-zinc-400" onClick={goToNextSong}>
          <FaStepForward />
        </button>
      </div>

      {/* 📋 Playlist */}
      <div className="w-full mt-4">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Playlist</h4>
        <div className="max-h-48 overflow-y-auto pr-1 custom-scrollbar">
          <ul className="text-sm text-gray-200 space-y-1">
            {songs.map((song, index) => (
              <li
                key={index}
                onClick={() => playFromPlaylist(index)}
                className={`cursor-pointer p-1 rounded-md hover:bg-zinc-700 transition ${
                  index === currentSongIndex ? "bg-green-600 text-white" : ""
                }`}
              >
                {song.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SoundBoard;
