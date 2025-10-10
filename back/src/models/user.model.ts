import mongoose from "mongoose";
import { UserType } from "../types/auth.type.js";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }, // createdAt, updatedAt
);

const User = mongoose.model<UserType>("User", userSchema);
export default User;
