import { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/utils/AppError.js";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  let statusCode = 500;
  let message = "Server Error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({ message });
};

export default errorMiddleware;
