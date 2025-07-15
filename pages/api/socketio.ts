// pages/api/socketio.ts
import type { NextApiRequest } from "next";
import type { NextApiResponseServerIO } from "../../types/next";
import { Server as IOServer } from "socket.io";
import { Server as HTTPServer } from "http";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!res.socket?.server.io) {
    const httpServer = res.socket.server as HTTPServer;

    const io = new IOServer(httpServer, {
      path: "/api/socketio",
      cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
      console.log("🟢 New client connected");

      socket.on("join", ({ conversationId }) => {
        socket.join(conversationId);
      });

      socket.on("leave", ({ conversationId }) => {
        socket.leave(conversationId);
      });

      socket.on("message", async (payload) => {
        const { conversationId, senderId, senderName, body, image } = payload;

        const { default: connectDB } = await import("@/lib/mongodb");
        const Message = (await import("@/models/Messages")).default;
        const Convo = (await import("@/models/Convo")).default;

        await connectDB();

        const msgDoc = await Message.create({
          conversation: conversationId,
          sender: senderId,
          senderName,
          body,
          image,
        });

        try {
          await Convo.findByIdAndUpdate(conversationId, {
            lastMessageAt: new Date(),
          });
        } catch {
          console.warn(
            "⚠️ Could not update Convo timestamp (OK if using static IDs)"
          );
        }

        io.to(conversationId).emit("message", {
          _id: msgDoc._id,
          sender: senderId,
          senderName,
          body,
          image,
          createdAt: msgDoc.createdAt,
        });
      });
    });

    // store io instance so Next.js won't create multiple servers in dev
    res.socket.server.io = io;
    console.log("✅ Socket.IO server initialized");
  }

  res.end();
}
