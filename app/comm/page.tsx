"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

interface PollData {
  question: string;
  options: string[];
  votes: Record<string, number>;
}

const forums = ["Python", "Dev", "DSA", "Fullstack", "AI", "Design"];

export default function CommunityPage() {
  const [poll, setPoll] = useState<PollData | null>(null);
  const [voted, setVoted] = useState<string | null>(null);
  const [selectedForum, setSelectedForum] = useState<string>(forums[0]);

  useEffect(() => {
    fetch("/api/community/poll")
      .then((res) => res.json())
      .then(setPoll);
  }, []);

  const handleVote = async (option: string) => {
    if (voted || !poll) return;
    const res = await fetch("/api/community/poll", {
      method: "POST",
      body: JSON.stringify({ option }),
      headers: { "Content-Type": "application/json" },
    });
    const updatedPoll = await res.json();
    setPoll(updatedPoll);
    setVoted(option);
  };

  const totalVotes = poll
    ? Object.values(poll.votes).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-100  dark:bg-[#0c1317]">
      <Navbar />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 dark:border-gray-700 bg-[#f1f5f9] dark:bg-[#111b21] p-4">
          <h2 className="text-lg font-semibold mb-4">📚 Forums</h2>
          <ul className="space-y-2">
            {forums.map((forum) => (
              <li
                key={forum}
                onClick={() => setSelectedForum(forum)}
                className={`${
                  selectedForum === forum ? "cursor-text2" : "cursor-pointer2"
                } px-4 py-3 rounded-lg transition text-sm font-medium
      ${
        selectedForum === forum
          ? "bg-gradient-to-tr from-indigo-400 to-blue-500 text-white shadow-md"
          : "hover:bg-blue-100 dark:hover:bg-gray-800 dark:text-gray-200"
      }`}
              >
                {forum}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Section */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Poll Section */}
          <div className="mb-6 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm bg-white dark:bg-[#2a3942]">
            {poll ? (
              <>
                <h2 className="text-xl font-semibold mb-4">
                  🗳️ {poll.question}
                </h2>
                <div className="space-y-3">
                  {poll.options.map((option) => (
                    <div
                      key={option}
                      className="flex items-center justify-between gap-4"
                    >
                      <button
                        onClick={() => handleVote(option)}
                        disabled={!!voted}
                        className={`w-40 py-2 rounded-md font-medium text-sm transition border 
                          ${
                            voted === option
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 hover:bg-blue-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                          }`}
                      >
                        {option}
                      </button>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {poll.votes[option] ?? 0} vote
                        {poll.votes[option] !== 1 ? "s" : ""}
                        {totalVotes > 0 && (
                          <span className="ml-2 text-blue-500">
                            (
                            {((poll.votes[option] / totalVotes) * 100).toFixed(
                              1
                            )}
                            %)
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                {voted && (
                  <p className="mt-4 text-green-600 dark:text-green-400 font-medium">
                    You voted for <strong>{voted}</strong>. Thanks!
                  </p>
                )}
              </>
            ) : (
              <p className="text-center py-4">Loading poll...</p>
            )}
          </div>

          {/* Forum Messages Placeholder */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-5 bg-[#fdfdfd] dark:bg-[#2a3942]">
            <p className="text-gray-500 italic dark:text-gray-400">
              No posts in <strong>{selectedForum}</strong> yet. Start the
              conversation!
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
