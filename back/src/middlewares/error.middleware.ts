import { NextFunction, Request, Response } from "express";

// 500 error 처리
export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return res
    .status(500)
    .json({ message: "Internal Server Error: " + err.message });
};

export default errorMiddleware;
