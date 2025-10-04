import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";
import { asyncWrap } from "../lib/utils.js";

const authRouter = express.Router();

authRouter.post("/signup", asyncWrap(signup));
authRouter.post("/login", asyncWrap(login));
authRouter.post("/logout", asyncWrap(logout));

export default authRouter;
