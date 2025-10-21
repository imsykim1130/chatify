import mongoose from "mongoose";

export type MessageType = {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  text?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
};
