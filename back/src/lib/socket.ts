import express from "express";
import { Server } from "socket.io";
import http from "http";
import { CLIENT_URL } from "../config/env.js";
import { socketMiddleware } from "../middlewares/socket.middleware.js";

const app = express();
const server = http.createServer(app);

const userSocketMap = new Map<string, string>();

export const getReceiverSocketId = (userId: string) => {
  return userSocketMap.get(userId);
};

const io = new Server(server, {
  cors: {
    origin: [CLIENT_URL!],
    credentials: true, // for cookies
  },
});

// apply authentication middleware to all socket connections
io.use(socketMiddleware);

// 클라이언트에서 웹에 접근하면 연결됨
io.on("connection", (socket) => {
  console.log("a user connected", socket.user.fullName);
  const userId = socket.userId;
  if (!userId) return;

  userSocketMap.set(userId, socket.id);

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // disconnect event
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.user.fullName);
    userSocketMap.delete(userId);
  });
});

export { io, app, server };
