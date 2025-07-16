import { Server as IOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../types/next";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Messages";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!res.socket.server.io) {
    console.log("🟢 Initializing Socket.IO server...");

    const httpServer: HTTPServer = res.socket.server as any;

    const io = new IOServer(httpServer, {
      path: "/api/socketio",
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      console.log("👤 Client connected:", socket.id);

      socket.on("join", ({ conversationId }) => {
        socket.join(conversationId);
        console.log(`📥 ${socket.id} joined ${conversationId}`);
      });

      socket.on("leave", ({ conversationId }) => {
        socket.leave(conversationId);
        console.log(`📤 ${socket.id} left ${conversationId}`);
      });

      socket.on("message", async (data) => {
        const { conversationId, senderId, senderName, body } = data;

        // ✅ Save message to DB
        try {
          await connectDB();
          const saved = await Message.create({
            conversation: conversationId,
            sender: senderId,
            senderName,
            body,
          });

          // ✅ Broadcast to everyone in room (including sender)
          io.to(conversationId).emit("message", saved);

        } catch (err) {
          console.error("❌ Error saving/broadcasting message:", err);
        }
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}
