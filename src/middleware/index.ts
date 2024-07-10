import { NextFunction, Response } from "express";
import jwt from 'jsonwebtoken'
import { IRequest } from "../interfaces/request.interface";

export function validate_token(req: IRequest, res: Response, next: NextFunction){
    if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT'){
        const authHeader = req.headers['authorization']
        const token = authHeader.split(' ')[1]
        const SECRET_KEY = process.env.SECRET_KEY || "SECRET_KEY"
        jwt.verify(token, SECRET_KEY, (err:any, user:any) => {
            if(err){
                return res.sendStatus(403)
            }
            req.user = user
            next()
        })
    }
    next()

}