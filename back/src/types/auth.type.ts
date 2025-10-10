import { Request } from "express";
import mongoose from "mongoose";

export type SignUpRequest = {
  email: string;
  fullName: string;
  password: string;
};

export type LogInRequest = {
  email: string;
  password: string;
};

export type Payload = {
  userId: string;
};

export interface UpdateProfileRequest extends Request {
  // user: Pick<UserType, "_id">;
  // body: { profilePic: string };
}

export type UserType = {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  password?: string;
  profilePic: string;
  createdAt: NativeDate;
  updatedAt: NativeDate;
};
