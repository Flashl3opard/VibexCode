import { Server as IOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import type { NextApiRequest } from "next";
import type { NextApiResponseServerIO } from "../../types/next"; // your extended type
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: {
    bodyParser: false,
  },
};

let io: IOServer | undefined;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!res.socket.server.io) {
    console.log("🔌 Initializing Socket.io server...");
    const httpServer = res.socket.server as unknown as HTTPServer;

    io = new IOServer(httpServer, {
      path: "/api/socketio",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("🟢 Socket connected:", socket.id);

      socket.on("join", ({ conversationId }) => {
        if (typeof conversationId === "string") {
          socket.join(conversationId);
          console.log(`👥 ${socket.id} joined room ${conversationId}`);
        }
      });

      socket.on("leave", ({ conversationId }) => {
        if (typeof conversationId === "string") {
          socket.leave(conversationId);
          console.log(`🚪 ${socket.id} left room ${conversationId}`);
        }
      });

      socket.on("message", (message) => {
        const { conversationId } = message;
        if (typeof conversationId !== "string") {
          console.warn(`Received message without valid conversationId from ${socket.id}`);
          return;
        }
        console.log(`📣 Broadcasting message to room: ${conversationId}`, message);
        io?.to(conversationId).emit("message", {
          ...message,
          _id: uuidv4(),
          createdAt: new Date().toISOString(),
        });
      });

      socket.on("disconnect", () => {
        console.log(`🔴 Socket disconnected: ${socket.id}`);
      });
    });

    res.socket.server.io = io;
    console.log("✅ Socket.io initialized");
  }

  res.end();
}
