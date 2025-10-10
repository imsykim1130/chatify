import { UserType } from "../auth.type";

declare global {
  namespace Express {
    interface Request {
      user?: Omit<UserType, "password">;
    }
  }
}

export {};
