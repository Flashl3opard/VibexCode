import { Server as IOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import type { NextApiRequest } from "next";
import type { NextApiResponseServerIO } from "../../types/next"; // your extended type

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
        socket.join(conversationId);
        console.log(`👥 ${socket.id} joined room ${conversationId}`);
      });

      socket.on("leave", ({ conversationId }) => {
        socket.leave(conversationId);
        console.log(`🚪 ${socket.id} left room ${conversationId}`);
      });

      // 🔁 Echo/broadcast to all in the room (including sender)
      socket.on("message", (message) => {
        const { conversationId } = message;
        console.log(`📣 Broadcasting message to room: ${conversationId}`, message);
        io?.to(conversationId).emit("message", {
          ...message,
          _id: `${Date.now()}`, // add _id if needed
          createdAt: new Date().toISOString(),
        });
      });
    });

    res.socket.server.io = io;
    console.log("✅ Socket.io initialized");
  }

  res.end();
}
