import { UserType } from "./auth.type.js";
import mongoose from "mongoose";

declare module "socket.io" {
  interface Socket {
    user?: mongoose.document<UserType>;
    userId?: string;
  }
}

export {};
