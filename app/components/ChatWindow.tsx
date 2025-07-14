"use client";

import { useEffect, useState, useRef } from "react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";

import { Input } from "@/src/components/ui/input";
import { useSocket } from "@/lib/useSocket";
import axios from "axios";

interface Props {
  conversationId: string;
  selfId: string;
  selfName: string; // ✅ Added
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
        console.error("Error fetching messages:", err);
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
    };
  }, [socket, conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    socket?.emit("message", {
      conversationId,
      senderId: selfId,
      senderName: selfName, // ✅ Added
      body: input.trim(),
    });
    setInput("");
  };

  return (
    <Card>
      <CardHeader className="text-lg font-semibold">Community Chat</CardHeader>
      <CardContent className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
        {messages.map((m) => (
          <div
            key={m._id}
            className={`rounded-lg px-4 py-2 max-w-[70%] text-sm whitespace-pre-wrap shadow-sm ${
              m.sender === selfId
                ? "ml-auto bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            <p className="text-xs text-muted-foreground mb-1">
              {m.senderName ?? m.sender}
            </p>
            <p>{m.body}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      <div className="flex items-center gap-2 border-t p-4">
        <Input
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </Card>
  );
}
