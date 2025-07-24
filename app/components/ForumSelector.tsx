// components/ForumSelector.tsx
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
    <div className="flex gap-4 p-4 border-b">
      {forums.map((forum) => (
        <button
          key={forum}
          className={`px-4 py-2 rounded ${
            forum === selected
              ? "bg-primary text-white"
              : "bg-muted text-foreground"
          }`}
          onClick={() => onSelect(forum)}
        >
          {forum.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
