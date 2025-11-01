import mongoose from "mongoose";
import { MONGO_URI } from "../config/env.js";

// export const connectDB = async () => {
//   try {
//     if (!MONGO_URI) throw new Error("mongoDB URI 를 확인하세요");
//     const con = await mongoose.connect(MONGO_URI, {});
//     console.log(con.connection.host);
//   } catch (e) {
//     console.error("Error to MONGODB connection:", e);
//     process.exit(1); // 1 status means fail, 0 status means success
//   }
// };

if (!MONGO_URI) throw new Error("mongoDB uri is not defined");

// 전역 캐시 (서버리스 콜드스타트/리로드 대응)
let cached = (global as any)._mongoose;
if (!cached) cached = (global as any)._mongoose = { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(
        MONGO_URI as string,
        {
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          // 개발 중 원인 파악용: bufferCommands: false
        } as any,
      )
      .then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
