"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
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
    <Card className="flex flex-col w-full max-w-3xl mx-auto shadow-lg border rounded-2xl overflow-hidden">
      <CardHeader className="text-xl font-semibold bg-muted dark:bg-muted/50 border-b px-6 py-4">
        💬 Community Chat
      </CardHeader>

      <CardContent className="flex flex-col flex-grow gap-2 px-4 py-3 overflow-y-auto max-h-[75vh] scrollbar-thin scrollbar-thumb-muted-foreground/30 dark:scrollbar-thumb-muted-foreground/50">
        {messages.map((m) => {
          const isSelf = m.sender === selfId;
          return (
            <div
              key={m._id}
              className={cn(
                "flex flex-col mb-2 max-w-[75%] px-4 py-2 rounded-xl transition-all",
                isSelf
                  ? "ml-auto bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                  : "bg-muted dark:bg-muted/60 text-foreground"
              )}
            >
              <div className="text-xs font-semibold opacity-70 mb-1">
                {m.senderName ?? m.sender}
              </div>
              <div className="whitespace-pre-wrap text-sm">{m.body}</div>
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
      </CardContent>

      <div className="flex items-center gap-2 border-t bg-background px-4 py-3">
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
    </Card>
  );
}
