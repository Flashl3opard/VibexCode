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

export default function ChatWindow({
  conversationId,
  selfId,
  selfName,
}: Props) {
  const socket = useSocket();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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
    <div className="flex flex-col h-full w-full bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border backdrop-blur bg-background/70 px-6 py-3 shadow-sm">
        <h1 className="text-xl font-semibold tracking-wide uppercase">
          {conversationId} Chat
        </h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 scrollbar-thin scrollbar-thumb-muted-foreground/30 dark:scrollbar-thumb-muted-foreground/50">
        {messages.map((m) => {
          const isSelf = m.sender === selfId;
          return (
            <div
              key={m._id}
              className={cn(
                "max-w-[75%] px-4 py-3 rounded-xl shadow transition-all",
                isSelf
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted dark:bg-muted/50 text-foreground"
              )}
            >
              <div className="text-xs font-semibold mb-1 opacity-70">
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
      <div className="border-t border-border px-6 py-4 flex items-center gap-4 bg-background">
        <Input
          placeholder="Type a message..."
          value={input}
          className="flex-1 rounded-full px-4 py-2 text-sm"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button
          onClick={handleSend}
          className="rounded-full px-5 py-2 text-sm font-medium"
        >
          Send
        </Button>
      </div>
    </div>
  );
}
