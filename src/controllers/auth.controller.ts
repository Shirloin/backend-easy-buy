import { NextFunction, Request, Response } from "express";
import { ICreateUser, IUser } from "../interfaces/user.interface.ts";
import AuthRepository from "../repositories/auth.repository.ts";
import UserRepository from "../repositories/user.repository.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/index.ts";
import { IRequest } from "../interfaces/request.interface.ts";

class AuthController {
  public auth_repository = new AuthRepository();
  public user_repository = UserRepository.getInstance();

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: ICreateUser = req.body;
      const user: IUser = await this.auth_repository.register(userData);
      res.status(200).send({ message: "User registered successfully" });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      const user: IUser | null = await this.user_repository.getUserByUsername(
        username
      );
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      const isValid = bcrypt.compareSync(password, user.password);
      if (!isValid) {
        return res.status(401).send({ message: "Wrong password" });
      }
      var token = jwt.sign(
        {
          id: user._id,
        },
        SECRET_KEY || "SECRET_KEY",
        { expiresIn: 86400 }
      );
      res
        .status(200)
        .json({ user: user, message: "Login successfull", token: token });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
