import { NextFunction, Request } from "express";
import UserRepository from "../repositories/user.repository";

export default class UserController {
  public userRepository = UserRepository.getInstance();
  public getShop = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.session.user;
    } catch (error) { }
  };
}
