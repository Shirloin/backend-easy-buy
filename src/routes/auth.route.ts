import { Router } from "express";
import { Routes } from "../interfaces/auth.interface.js";
import AuthController from "../controllers/auth.controller.js";

class AuthRoute implements Routes{
    public router = Router()
    public auth_controller = new AuthController()

    constructor(){
        this.initializeRoutes()
    }

    private initializeRoutes(){
        this.router.post('/register', this.auth_controller.register)
    }
}

export default AuthRoute