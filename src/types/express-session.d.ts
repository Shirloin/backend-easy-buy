import "express-session";
import { IUser } from "../interfaces/user.interface";

declare module "express-session" {
  interface SessionData {
    user?: IUser;
  }
}
