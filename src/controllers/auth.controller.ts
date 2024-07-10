import { NextFunction, Request, Response } from "express";
import { ICreateUser, IUser } from "../interfaces/user.interface.ts";
import AuthRepository from "../repositories/auth.repository.ts";
import UserRepository from "../repositories/user.repository.ts";

class AuthController {
  public auth_repository = new AuthRepository();
  public user_repository = new UserRepository();

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: ICreateUser = req.body;
    //   if (
    //     userData.email.trim().length === 0 ||
    //     userData.username.trim().length === 0 ||
    //     userData.password.trim().length === 0
    //   ) {
    //     res.status(403).json({message: 'All fields must be filled'})
    //   }
    //   else if(await this.user_repository.getUserByEmail(userData.email) !== null){
    //     res.status(403).json({message: 'Email must be unique'})
    //   }
    //   else if(await this.user_repository.getUserByUsername(userData.username) !== null){
    //     res.status(403).json({message: 'Username must be unique'})
    //   }
      const user: IUser = await this.auth_repository.register(userData);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: "Login" });
  };
}

export default AuthController;
