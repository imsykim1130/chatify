import express from "express";
import { signup } from "../controllers/auth.controller.js";
import { asyncWrap } from "../lib/utils.js";

const authRouter = express.Router();

authRouter.post("/signup", asyncWrap(signup));
authRouter.post("/login", (req, res) => {
  res.send("");
});
authRouter.post("/logout", (req, res) => {
  res.send("");
});

export default authRouter;
