"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { players } from "@/lib/data";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Online":
      return "bg-green-500";
    case "Idle":
      return "bg-yellow-500";
    case "Busy":
      return "bg-red-500";
    case "Offline":
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
};

const FriendsSection = () => {
  const [currentFriendIndex, setCurrentFriendIndex] = useState(0);
  const friendsPerView = 4;
  const maxFriendIndex = Math.max(0, players.length - friendsPerView);

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow p-4 space-y-4 flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Friends Online</h2>
        <div className="flex gap-1">
          <button
            onClick={() =>
              setCurrentFriendIndex(Math.max(0, currentFriendIndex - 1))
            }
            disabled={currentFriendIndex === 0}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() =>
              setCurrentFriendIndex(
                Math.min(maxFriendIndex, currentFriendIndex + 1)
              )
            }
            disabled={currentFriendIndex >= maxFriendIndex}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-3 flex-1">
        {players
          .slice(currentFriendIndex, currentFriendIndex + friendsPerView)
          .map((player, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer2"
            >
              <div className="relative">
                <div
                  className={`w-10 h-10 rounded-full ${player.color} flex items-center justify-center text-white font-bold text-sm`}
                >
                  {player.avatar}
                </div>
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-zinc-800 ${getStatusColor(
                    player.status
                  )}`}
                >
                  {player.status === "Busy" && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  )}
                  {player.status === "Idle" && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full opacity-60" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{player.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {player.activity}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default FriendsSection;
