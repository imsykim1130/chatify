import express from "express";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import { CLIENT_URL, PORT } from "./config/env.js";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./lib/db.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import { app, server } from "./lib/socket.js";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 이미지 base64 는 긴 경우가 많기 때문에 limit 늘려줌
app.use(express.json({ limit: "10mb" })); // req.body
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/messages", messageRouter);

app.use(errorMiddleware);

// // 배포 환경에서 static 파일을 가져오는 곳(react)
// if (process.env.NODE_ENV === "prod") {
//   app.use(express.static(path.join(__dirname, "../../front/dist")));
//   app.get("*", (_, res) => {
//     res.sendFile(path.join(__dirname, "../../front", "dist", "index.html"));
//   });
// }

app.get("/", (_req, res) => {
  res.status(200).json({ message: "Hello World" });
});

const port = PORT || 3000;
server.listen(port, () => {
  console.log("listen ", port);
  connectDB();
});

export default app;
