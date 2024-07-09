import { NextFunction, Request, Response } from "express";
import { ICreateUser, IUser } from "../interfaces/user.interface.js";
import AuthRepository from "../repositories/auth.repository.js";

class AuthController{
    public auth_repository = new AuthRepository()

    public register = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: ICreateUser = req.body
            const user: IUser = await this.auth_repository.register(userData)
        } catch (error) {
            next(error)
        }
    }

}

export default AuthController