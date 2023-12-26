import { io } from "socket.io-client";

const server = "https://collabcanvas.onrender.com";
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};


export const socket = io(server,connectionOptions);






