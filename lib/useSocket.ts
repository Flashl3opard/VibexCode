import { useMemo } from "react";
import { io } from "socket.io-client";

export function useSocket() {
  return useMemo(() => {
    return io({
      path: "/api/socketio",  // this must match
      autoConnect: false,
    });
  }, []);
}
