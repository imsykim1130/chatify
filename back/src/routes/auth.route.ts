import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
} from "../controllers/auth.controller.js";
import { asyncWrap } from "../lib/utils.js";
import { verifyCookie } from "../middlewares/auth.middleware.js";
import { arcjetMiddleware } from "../middlewares/arcjet.middleware.js";

const authRouter = express.Router();

authRouter.use(arcjetMiddleware);
authRouter.post("/signup", asyncWrap(signup));
authRouter.post("/login", asyncWrap(login));
authRouter.post("/logout", asyncWrap(logout));
authRouter.put("/profile", verifyCookie, asyncWrap(updateProfile));
authRouter.get("/ckeck", verifyCookie, (req, res) =>
  res.status(200).json(req.user),
);

export default authRouter;
