import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";
import { Payload } from "../types/auth.type.js";

export const verifyCookie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = await req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (!JWT_SECRET) return res.status(401).json({ message: "No JWT secret" });
  const decoded = jwt.verify(token, JWT_SECRET);

  if (!decoded) {
    return res.status(401).json({ message: "Invalid Token" });
  }

  const user = await User.findById((decoded as Payload).userId).select(
    "-password"
  );
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }
  (req as any).user = user;
  next();
};
