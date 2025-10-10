import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";
import { Payload, UserType } from "../types/auth.type.js";
import { Socket } from "socket.io";

export const socketMiddleware = async (socket: Socket, next: any) => {
  try {
    // extract token from cookies
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

    if (!token) {
      console.error("No token provided");
      throw new Error("No token provided");
    }

    // verify token
    if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
    const decoded = (await jwt.verify(token, JWT_SECRET)) as Payload;
    if (!decoded) {
      console.error("Invalid token");
      throw new Error("Invalid token");
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("Socket connection rejected: User not found");
      return next(new Error("User not found"));
    }

    socket.user = user;
    socket.userId = user._id.toString();
    console.log(`socket authenticated for user: ${user.fullName}`);

    next();
  } catch (e: Error | any) {
    console.error("socketMiddleware error: ", e);
    next(e);
  }
};
