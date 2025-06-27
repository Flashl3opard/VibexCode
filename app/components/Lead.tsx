import React from "react";
import { MdOutlineLeaderboard } from "react-icons/md";

const players = [
  { name: "Player1", score: 120 },
  { name: "Player2", score: 110 },
  { name: "Player3", score: 100 },
  { name: "Player4", score: 90 },
];

const Lead = () => {
  return (
    <div className="w-64 bg-slate-800 shadow-xl rounded-2xl overflow-hidden border border-slate-700">
      <div className="flex justify-between items-center text-emerald-400 text-xl font-semibold px-4 py-3 bg-slate-900 border-b border-slate-700">
        <h1>Leaderboard</h1>
        <MdOutlineLeaderboard className="text-2xl" />
      </div>

      <ul className="divide-y divide-slate-700 text-white">
        {players.map((player, index) => (
          <li
            key={index}
            className="flex justify-between items-center px-4 py-3 hover:bg-slate-700 transition-colors"
          >
            <span>
              {index + 1}. {player.name}
            </span>
            <span className="text-sm text-emerald-300">{player.score} pts</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Lead;
