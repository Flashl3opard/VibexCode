// pages/community-chat.tsx
"use client";

import { useState } from "react";

import ChatWindow from "@/app/components/ChatWindow";
import ForumSelector from "@/app/components/ForumSelector";

interface Props {
  selfId: string;
  selfName: string;
}

export default function CommunityChatPage({ selfId, selfName }: Props) {
  const [selectedForum, setSelectedForum] = useState("dev");

  return (
    <div className="flex flex-col min-h-screen">
      <ForumSelector selected={selectedForum} onSelect={setSelectedForum} />
      <div className="flex-grow">
        <ChatWindow
          conversationId={selectedForum}
          selfId={selfId}
          selfName={selfName}
        />
      </div>
    </div>
  );
}
