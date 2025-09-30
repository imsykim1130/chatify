import express from "express";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import { ENV_MODE, PORT } from "./config/env.js";
import path from "path";
import { fileURLToPath } from "url";
const server = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
server.use("/api/v1/auth", authRouter);
server.use("/api/v1/messages", messageRouter);
// 배포 환경에서 static 파일을 가져오는 곳(react)
if (ENV_MODE === "prod") {
    server.use(express.static(path.join(__dirname, "../../front/dist")));
    server.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../../front", "dist", "index.html"));
    });
}
server.listen(PORT || 3000, () => {
    console.log("listen");
});
