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

  // Fetch old messages
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

  // Handle real-time messages
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

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send new message
  const handleSend = async () => {
    if (!input.trim() || !selfId || !selfName || !conversationId) {
      console.error("❌ Missing required message data");
      return;
    }

    const messageData = {
      conversationId,
      senderId: selfId,
      senderName: selfName,
      body: input.trim(),
    };

    console.log("📤 Sending message:", messageData);

    socket?.emit("message", messageData);

    try {
      const res = await axios.post(
        `/api/messages/${conversationId}`,
        messageData
      );
      console.log("✅ Message saved to DB:", res.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          "❌ Failed to save message to DB:",
          err.response?.data || err.message
        );
      } else if (err instanceof Error) {
        console.error("❌ Failed to save message to DB:", err.message);
      } else {
        console.error("❌ Failed to save message to DB:", err);
      }
    }

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
