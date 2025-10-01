import mongoose from "mongoose";
import { MONGO_URI } from "../config/env.js";

export const connectDB = async () => {
  try {
    if (!MONGO_URI) throw new Error("mongoDB URI 를 확인하세요");
    const con = await mongoose.connect(MONGO_URI, {});
    console.log(con.connection.host);
  } catch (e) {
    console.error("Error to MONGODB connection:", e);
    process.exit(1); // 1 status means fail, 0 status means success
  }
};
