import express, { Request, Response } from "express";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import { PORT } from "./config/env.js";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./lib/db.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

const server = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

server.use(express.json()); // req.body
server.use(cookieParser());

server.use("/api/v1/auth", authRouter);
server.use("/api/v1/messages", messageRouter);

server.use(errorMiddleware);

// 배포 환경에서 static 파일을 가져오는 곳(react)
if (process.env.NODE_ENV === "prod") {
  server.use(express.static(path.join(__dirname, "../../front/dist")));
  server.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../../front", "dist", "index.html"));
  });
}

server.listen(PORT || 3000, () => {
  console.log("listen");
  connectDB();
});
