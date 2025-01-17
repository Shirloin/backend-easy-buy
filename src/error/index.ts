import { NextFunction, Request, Response } from "express";

export default function ErrorHandling(err: any, req: Request, res: Response, next: NextFunction){
    const status = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    const data = err.data || {}

    res.status(status).send({message: message, data: data})
}