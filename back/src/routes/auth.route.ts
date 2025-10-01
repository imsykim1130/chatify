import express from "express";
import { signup } from "../controllers/auth.controller.js";
import { asyncWrap } from "../lib/utils/asyncWrap.js";

const authRouter = express.Router();

authRouter.get("/signup", asyncWrap(signup));
authRouter.get("/login", (req, res) => {
  res.send("");
});
authRouter.get("/logout", (req, res) => {
  res.send("");
});

export default authRouter;
