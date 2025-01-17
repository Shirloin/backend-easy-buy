import { Router } from "express";
import { Routes } from "../interfaces/auth.interface";
import UserController from "../controllers/user.controller";
import { authMiddleware } from "../middleware";
import ProductController from "../controllers/product.controller";

class UserRoute implements Routes {
    public router = Router()
    public userController = new UserController()
    public productController = new ProductController()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {

    }
}