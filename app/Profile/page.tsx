"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Trophy,
  Calendar,
  Target,
  Star,
  Award,
  Clock,
} from "lucide-react";

const players = [
  {
    name: "Player 1",
    color: "bg-red-500",
    status: "Online",
    avatar: "P1",
    activity: "Solving Arrays",
  },
  {
    name: "Player 2",
    color: "bg-blue-500",
    status: "Idle",
    avatar: "P2",
    activity: "Away",
  },
  {
    name: "Player 3",
    color: "bg-yellow-400",
    status: "Offline",
    avatar: "P3",
    activity: "Last seen 2h ago",
  },
  {
    name: "Player 4",
    color: "bg-green-500",
    status: "Online",
    avatar: "P4",
    activity: "In Contest",
  },
  {
    name: "Player 5",
    color: "bg-purple-500",
    status: "Busy",
    avatar: "P5",
    activity: "Do Not Disturb",
  },
  {
    name: "Player 6",
    color: "bg-pink-500",
    status: "Online",
    avatar: "P6",
    activity: "Studying DP",
  },
  {
    name: "Enol",
    color: "bg-indigo-500",
    status: "Online",
    avatar: "E",
    activity: "Coding Interview",
  },
];

const getStatusColor = (status: any) => {
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

const historyData = [
  { title: "Find the K-th Character in String Game II", time: "8 hours ago" },
  { title: "Burst Balloons", time: "1 day ago" },
  { title: "Frequency of the Most Frequent Element", time: "3 days ago" },
  { title: "Number of Enclaves", time: "4 days ago" },
  { title: "Surrounded Regions", time: "5 days ago" },
  {
    title: "Number of Subsequences That Satisfy the Given Sum Condition",
    time: "5 days ago",
  },
  { title: "01 Matrix", time: "6 days ago" },
  { title: "Kth Smallest Product of Two Sorted Arrays", time: "8 days ago" },
  { title: "Find All K-Distant Indices in an Array", time: "10 days ago" },
  { title: "Minimum Array End", time: "11 days ago" },
  { title: "Maximum XOR of Two Numbers in an Array", time: "12 days ago" },
  { title: "Design Add and Search Words Data Structure", time: "13 days ago" },
  { title: "Word Search II", time: "14 days ago" },
  { title: "Palindrome Partitioning", time: "15 days ago" },
  { title: "Generate Parentheses", time: "16 days ago" },
];

const Page = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentFriendIndex, setCurrentFriendIndex] = useState(0);
  const [currentHistoryPage, setCurrentHistoryPage] = useState(1);

  const completed = 7;
  const total = 10;
  const percent = (completed / total) * 100;

  const questionsPerView = 3;
  const friendsPerView = 4;
  const historyPerPage = 10;

  const totalQuestions = 10;
  const maxQuestionIndex = Math.max(0, totalQuestions - questionsPerView);
  const maxFriendIndex = Math.max(0, players.length - friendsPerView);
  const totalHistoryPages = Math.ceil(historyData.length / historyPerPage);

  const getCurrentHistoryItems = () => {
    const startIndex = (currentHistoryPage - 1) * historyPerPage;
    const endIndex = startIndex + historyPerPage;
    return historyData.slice(startIndex, endIndex);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#e0c3fc] to-[#8ec5fc] dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white transition-all">
      <div className="grid grid-cols-12 gap-6 min-h-screen p-6">
        {/* Friends Online */}
        <aside className="col-span-2  bg-white dark:bg-zinc-800 rounded-xl shadow p-4 space-y-4 flex flex-col">
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
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
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
                    <p className="font-medium text-sm truncate">
                      {player.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {player.activity}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </aside>

        {/* Main & Profile Combined */}
        <div className="col-span-10 flex gap-6">
          {/* Main Content */}
          <main className="flex-1 space-y-6 flex flex-col">
            {/* Questions */}
            <section className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Questions</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentQuestionIndex(
                        Math.max(0, currentQuestionIndex - 1)
                      )
                    }
                    disabled={currentQuestionIndex === 0}
                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 disabled:opacity-50"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[100px] text-center">
                    {currentQuestionIndex + 1}-
                    {Math.min(
                      currentQuestionIndex + questionsPerView,
                      totalQuestions
                    )}{" "}
                    of {totalQuestions}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentQuestionIndex(
                        Math.min(maxQuestionIndex, currentQuestionIndex + 1)
                      )
                    }
                    disabled={currentQuestionIndex >= maxQuestionIndex}
                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 disabled:opacity-50"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[...Array(questionsPerView)].map((_, index) => {
                  const questionNum = currentQuestionIndex + index + 1;
                  if (questionNum > totalQuestions) return null;
                  return (
                    <div
                      key={index}
                      className="rounded-xl shadow-md hover:scale-105 transition-transform bg-gradient-to-tr from-purple-500 via-blue-500 to-indigo-500"
                    >
                      <div className="p-4 h-32 flex items-center justify-center text-center text-lg font-semibold">
                        Question {questionNum}
                      </div>
                      <div className="bg-white/10 px-4 py-2 text-sm flex justify-between border-t border-white/10">
                        <span>Level: Easy</span>
                        <span>{questionNum * 10}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* History */}
            <section className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Recent Activity</h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Page {currentHistoryPage} of {totalHistoryPages}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() =>
                        setCurrentHistoryPage(
                          Math.max(1, currentHistoryPage - 1)
                        )
                      }
                      disabled={currentHistoryPage === 1}
                      className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 disabled:opacity-50"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentHistoryPage(
                          Math.min(totalHistoryPages, currentHistoryPage + 1)
                        )
                      }
                      disabled={currentHistoryPage === totalHistoryPages}
                      className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 disabled:opacity-50"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-zinc-700 flex-1">
                {getCurrentHistoryItems().map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center px-2 py-3 hover:bg-gray-100 dark:hover:bg-zinc-700 transition rounded-md"
                  >
                    <p className="truncate max-w-[80%] text-sm">{item.title}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </main>

          {/* Profile Sidebar - Now no scroll and aligned */}
          <aside className="w-[25%] bg-white dark:bg-zinc-800 rounded-xl shadow p-6 space-y-6 flex flex-col">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-blue-500 flex items-center justify-center mb-3 bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-2xl">
                  C
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-zinc-800"></div>
              </div>
              <h4 className="text-lg font-semibold">Chamar</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                @chamar_dev
              </p>
            </div>

            {/* Stats Cards */}
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

            {/* Profile Info */}
            <div className="bg-gray-100 dark:bg-zinc-700 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Profile Info
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Level:
                  </span>
                  <span className="font-medium">Intermediate</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Completed:
                  </span>
                  <span className="font-medium">
                    {completed}/{total} Questions
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Status:
                  </span>
                  <span className="flex items-center gap-1 font-medium text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Online
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Joined:
                  </span>
                  <span className="font-medium">Jan 2024</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
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

            {/* Recent Achievements */}
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
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Page;
