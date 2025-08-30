"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
interface Player {
  name: string;
  questionsDone: number;
}

const COLLECTION_NAME = "leaderboard"; // Firestore collection name

const Lead = () => {
  const [leaderboardData, setLeaderboardData] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));

        const players: Player[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            name: data.name || "Anonymous",
            questionsDone: data.questionsDone || 0,
          };
        });

        // Sort descending by number of questions done
        players.sort((a, b) => b.questionsDone - a.questionsDone);

        setLeaderboardData(players);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const medals = ["🥇", "🥈", "🥉"];

  if (loading)
    return <p className="text-center py-10">Loading leaderboard...</p>;

  return (
    <div className="space-y-4 w-full lg:w-1/3">
      <h3 className="text-xl font-semibold">Leaderboard</h3>
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 space-y-4 overflow-y-auto max-h-[600px] shadow-[0_4px_20px_rgba(128,0,255,0.4)]">
        {leaderboardData.length === 0 ? (
          <p className="text-gray-500 text-center">No data available.</p>
        ) : (
          leaderboardData.map((player, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-600 pb-2 last:border-none"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`rounded-full h-10 w-10 ${
                    ["bg-yellow-500", "bg-gray-400", "bg-yellow-800"][index] ||
                    "bg-green-500"
                  }`}
                />
                <div>
                  <h4 className="font-semibold">{player.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Questions Done: {player.questionsDone}
                  </p>
                </div>
              </div>
              <div className="text-xl">{medals[index] || "🎖️"}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Lead;
