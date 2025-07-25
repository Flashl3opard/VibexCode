"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useSocket } from "@/lib/useSocket";
import axios from "axios";
import { cn } from "@/lib/utils";

interface Props {
  conversationId: string;
  selfId: string;
  selfName: string;
}

interface Message {
  _id: string;
  sender: string;
  senderName?: string;
  body: string;
  image?: string;
  createdAt: string;
}

const forumWallpapers: Record<string, string> = {
  dev: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80",
  cp: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
  python:
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
  games:
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80",
};

export default function ChatWindow({
  conversationId,
  selfId,
  selfName,
}: Props) {
  const socket = useSocket();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"));
    }
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/messages/${conversationId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("❌ Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [conversationId]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("join", { conversationId });

    socket.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit("leave", { conversationId });
      socket.off("message");
    };
  }, [socket, conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const messageData = {
      conversationId,
      senderId: selfId,
      senderName: selfName,
      body: input.trim(),
    };

    socket?.emit("message", messageData);

    try {
      await axios.post(`/api/messages/${conversationId}`, messageData);
    } catch (err) {
      console.error("❌ Failed to save message to DB:", err);
    }

    setInput("");
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-[#101226] text-gray-900 dark:text-white transition-colors">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700 backdrop-blur bg-white/80 dark:bg-[#181b2e]/80 px-6 py-3 shadow-sm transition-colors">
        <h1 className="text-xl font-semibold tracking-wide uppercase">
          {conversationId} Chat
        </h1>
      </div>

      {/* Messages container with wallpaper in light mode */}
      <div
        className="flex-1 overflow-y-auto px-6 py-4 space-y-3 scrollbar-thin scrollbar-thumb-muted-foreground/30 dark:scrollbar-thumb-muted-foreground/50"
        style={
          !isDark && conversationId && forumWallpapers[conversationId]
            ? {
                backgroundImage: `url('${forumWallpapers[conversationId]}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }
            : {}
        }
      >
        {messages.map((m) => {
          const isSelf = m.sender === selfId;
          return (
            <div
              key={m._id}
              className={cn(
                "max-w-[75%] px-4 py-3 rounded-xl shadow transition-all",
                isSelf
                  ? "ml-auto bg-purple-800 text-white" // solid purple bg + text
                  : "bg-gray-100 text-gray-900 dark:bg-[#23263b] dark:text-white" // solid light/dark bg + text
              )}
            >
              <div className="text-xs font-semibold mb-1">
                {m.senderName ?? m.sender}
              </div>
              <div className="text-sm whitespace-pre-wrap">{m.body}</div>
              <div className="text-[10px] text-muted-foreground mt-1 text-right">
                {new Date(m.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center gap-4 bg-white dark:bg-[#181b2e] transition-colors">
        <Input
          placeholder="Type a message..."
          value={input}
          className="flex-1 rounded-full px-4 py-2 text-sm bg-gray-100 dark:bg-[#23263b] border-none focus:ring-2 focus:ring-[#d946ef] dark:focus:ring-[#d946ef] transition"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button
          onClick={handleSend}
          className="rounded-full px-5 py-2 text-sm font-medium bg-[#d946ef] hover:bg-[#c026d3] text-white shadow transition"
        >
          Send
        </Button>
      </div>
    </div>
  );
}
