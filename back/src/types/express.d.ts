import { UserType } from "./auth.type.js";

declare global {
  namespace Express {
    export interface Request {
      user?: Omit<UserType, "password">;
    }
  }
}
