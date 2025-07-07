import React from "react";

const Lead = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Leaderboard</h3>
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 space-y-4 overflow-y-auto max-h-[600px] shadow-[0_4px_20px_rgba(128,0,255,0.4)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_6px_30px_rgba(128,0,255,0.6)]">
        {[
          {
            name: "Player 1",
            color: "bg-red-500",
            medal: "🥇",
            text: "text-yellow-500",
          },
          {
            name: "Player 2",
            color: "bg-blue-500",
            medal: "🥈",
            text: "text-gray-400",
          },
          {
            name: "Player 3",
            color: "bg-yellow-500",
            medal: "🥉",
            text: "text-yellow-800",
          },
          {
            name: "Player 4",
            color: "bg-green-500",
            medal: "🎖️",
            text: "text-green-500",
          },
          {
            name: "Player 5",
            color: "bg-purple-500",
            medal: "🎖️",
            text: "text-purple-500",
          },
          {
            name: "Player 6",
            color: "bg-pink-500",
            medal: "🎖️",
            text: "text-pink-500",
          },
        ].map((player, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-600 pb-2 last:border-none"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <div className="flex items-center gap-4">
              <div className={`rounded-full h-10 w-10 ${player.color}`} />
              <div>
                <h4 className="font-semibold">{player.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Status
                </p>
              </div>
            </div>
            <div className={`${player.text} text-xl`}>{player.medal}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lead;
