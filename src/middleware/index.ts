import { NextFunction,  Response } from "express";
import jwt from 'jsonwebtoken'
import { IRequest } from "../interfaces/request.interface";
import UserRepository from "../repositories/user.repository";

export async function validate_token(req: IRequest, res: Response, next: NextFunction){
    if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
        const authHeader = req.headers['authorization']
        const token = authHeader.split(' ')[1]
        const SECRET_KEY = process.env.SECRET_KEY || "SECRET_KEY"
        jwt.verify(token, SECRET_KEY, async (err:any, user:any) => {
            if(err){
                return res.sendStatus(403)
            }
            const id = user.id
            const user_repository = UserRepository.getInstance()
            const validateUser = await user_repository.getUserById(id)
            if(validateUser!=null){
                req.user = user
            }
            else{
                return res.sendStatus(403)
            }
            next()
        })
    }
    next()
}