import { Request, Response, NextFunction } from "express";
import arcjet from "@arcjet/node";
import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res
          .status(429)
          .json({ message: "Too many requests. Try again later." });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Bot detected" });
      } else {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    if (decision.results.some(isSpoofedBot))
      return res.status(403).json({ message: "Malicious Bot detected" });

    next();
  } catch (err) {
    console.error("Arcjet error", err);
    next();
  }
};
