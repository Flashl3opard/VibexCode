import type { NextApiResponse } from "next";
import type { Socket as NetSocket } from "net";
import type { Server as IOServer } from "socket.io";

export interface NextApiResponseServerIO extends NextApiResponse {
  socket: NetSocket & {
    server: NetSocket["server"] & {
      io: IOServer;
    };
  };
}
