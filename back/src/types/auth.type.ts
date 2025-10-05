import { Request } from "express";

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
  _id: string;
  fullName: string;
  email: string;
  password: string;
  profilePic: string;
};
