"use client";

import React from "react";

const forums = ["dev", "cp", "python", "games"];

interface ForumSelectorProps {
  selected: string;
  onSelect: (topic: string) => void;
}

export default function ForumSelector({
  selected,
  onSelect,
}: ForumSelectorProps) {
  return (
    <div className="flex gap-4 p-4 border-b border-gray-200 dark:border-gray-700  transition-colors">
      {forums.map((forum) => (
        <button
          key={forum}
          className={`px-4 py-2 rounded font-bold transition
            ${
              forum === selected
                ? "bg-[#d946ef] text-white shadow"
                : "bg-gray-200 text-gray-900 hover:bg-primary/10 hover:text-[#d946ef] dark:bg-[#23263b] dark:text-gray-200 dark:hover:bg-[#c026d3]/50 dark:hover:text-white"
            }`}
          onClick={() => onSelect(forum)}
        >
          {forum.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
