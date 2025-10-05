import jwt from "jsonwebtoken";
import { Response } from "express";
import { ENV_MODE, JWT_SECRET } from "../config/env.js";
import { Payload } from "../types/auth.type.js";

export const generateToken = (userId: string, res: Response) => {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  const payload: Payload = { userId };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  res.cookie("jwt", token, {
    httpOnly: true, // prevent XSS attacks
    secure: ENV_MODE !== "dev",
    sameSite: "strict", // CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
