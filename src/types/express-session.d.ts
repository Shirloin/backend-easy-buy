import "express-session";
import { IUser } from "../interfaces/user.interface";
import { Session } from "express-session";

declare module "express-session" {
  interface SessionData {
    user: IUser;
  }
}
