import express from "express";
import {
  getAllContacts,
  getChatPartners,
  getMessagesByUserId,
  sendMessage,
} from "../controllers/message.controller.js";
import { arcjetMiddleware } from "../middlewares/arcjet.middleware.js";
import { verifyCookie } from "../middlewares/auth.middleware.js";

const messageRouter = express.Router();

// arcjet first
messageRouter.use(arcjetMiddleware, verifyCookie);

messageRouter.get("/contacts", getAllContacts);
messageRouter.get("/chat", getChatPartners);
messageRouter.get("/:id", getMessagesByUserId);
messageRouter.post("/send/:id", sendMessage);

export default messageRouter;
