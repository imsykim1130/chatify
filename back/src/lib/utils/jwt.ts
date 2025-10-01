import jwt from "jsonwebtoken";
import {ENV_MODE, JWT_SECRET} from "../../config/env.js";
import { Response } from "express";

export const generateToken = (userId: string, res: Response) => {
  const token = jwt.sign({ userId }, JWT_SECRET!, { expiresIn: "7d" });
  res.cookie("token", token, {
    httpOnly: true, // prevent XSS attacks
    secure: ENV_MODE !== "dev",
    sameSite: "strict", // CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
