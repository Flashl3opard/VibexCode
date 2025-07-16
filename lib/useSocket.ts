import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export const useSocket = (): Socket | null => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);

  useEffect(() => {
    if (!socket) {
      socket = io({
        path: "/api/socketio", // ✅ Must match server
      });

      socket.on("connect", () => {
        console.log("✅ Socket connected:", socket.id);
      });

      socket.on("disconnect", () => {
        console.log("❌ Socket disconnected");
      });
    }

    setSocketInstance(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return socketInstance;
};
