import { NextFunction, Request, Response } from "express";

export const asyncWrap = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
