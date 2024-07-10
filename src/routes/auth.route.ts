import { Router } from "express";
import { Routes } from "../interfaces/auth.interface.ts";
import AuthController from "../controllers/auth.controller.ts";

class AuthRoute implements Routes{
    public router = Router()
    public auth_controller = new AuthController()

    constructor(){
        this.initializeRoutes()
    }

    private initializeRoutes(){
        this.router.post('/register', this.auth_controller.register)
        this.router.get('/login', this.auth_controller.login)
    }
}

export default AuthRoute