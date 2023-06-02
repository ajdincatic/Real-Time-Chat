import { createContext } from "react";
import { Socket, io } from "socket.io-client";

export const socket = io(process.env.REACT_APP_SOCKET_URL, {
  autoConnect: false,
});
export const SocketContext = createContext<Socket | null>(null);
