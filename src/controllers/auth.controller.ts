import { NextFunction, Request, Response } from "express";
import { ICreateUser, IUser } from "../interfaces/user.interface.ts";
import AuthRepository from "../repositories/auth.repository.ts";

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

    public login = async(req: Request, res: Response, next: NextFunction) => {
        res.status(200).json({message: 'Login'})
    }

}

export default AuthController