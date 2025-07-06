"use client";

import { useEffect, useState } from "react";
import { Trophy, Star, Target, Award, Calendar, Clock } from "lucide-react";

const ProfileSection = () => {
  const [username, setUsername] = useState("Loading...");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const email = localStorage.getItem("email"); // Make sure you store this on login
        if (!email) {
          setUsername("Guest");
          return;
        }

        const res = await fetch("/api/getUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (res.ok) {
          setUsername(data.username);
        } else {
          console.error("Fetch error:", data.error);
          setUsername("Unknown");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUsername("Error");
      }
    };

    fetchUsername();
  }, []);

  const completed = 7;
  const total = 10;
  const percent = (completed / total) * 100;

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow p-6 space-y-6 flex flex-col">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-blue-500 flex items-center justify-center mb-3 bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-2xl">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-zinc-800" />
        </div>
        <h4 className="text-lg font-semibold">{username}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">@{username}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-3 text-white text-center">
          <Trophy className="w-5 h-5 mx-auto mb-1" />
          <p className="text-xs font-medium">Rank</p>
          <p className="text-lg font-bold">#42</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 text-white text-center">
          <Star className="w-5 h-5 mx-auto mb-1" />
          <p className="text-xs font-medium">Rating</p>
          <p className="text-lg font-bold">1547</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 text-white text-center">
          <Target className="w-5 h-5 mx-auto mb-1" />
          <p className="text-xs font-medium">Streak</p>
          <p className="text-lg font-bold">15</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-3 text-white text-center">
          <Award className="w-5 h-5 mx-auto mb-1" />
          <p className="text-xs font-medium">Badges</p>
          <p className="text-lg font-bold">8</p>
        </div>
      </div>

      <div className="bg-gray-100 dark:bg-zinc-700 rounded-lg p-4 space-y-3">
        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Profile Info
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Level:</span>
            <span className="font-medium">Intermediate</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Completed:</span>
            <span className="font-medium">
              {completed}/{total} Questions
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Status:</span>
            <span className="flex items-center gap-1 font-medium text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Online
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Joined:</span>
            <span className="font-medium">Jan 2024</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Progress
        </h4>
        <div className="w-full h-4 bg-gray-300 dark:bg-zinc-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
          <span>{percent.toFixed(0)}% Completed</span>
          <span>{total - completed} remaining</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-zinc-700 dark:to-zinc-600 rounded-lg p-4 space-y-2">
        <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
          Recent Achievement
        </h4>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
            <Trophy className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Problem Solver
            </p>
            <p className="text-xs text-yellow-600 dark:text-yellow-300">
              Solved 5 problems in a row
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
