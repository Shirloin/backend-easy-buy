import { NextFunction, Request } from "express";
import UserRepository from "../repositories/user.repository";

class UserController {
  public user_repository = UserRepository.getInstance();
  public getShop = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.session.user;
      console.log(user);
    } catch (error) {}
  };
}
