import { Router } from "express";
import { Routes } from "../interfaces/auth.interface";
import { authMiddleware } from "../middleware";
import CartController from "../controllers/cart.controller";

export default class CartRoute implements Routes {
    public router = Router()
    private cartController = new CartController()

    constructor() {
        this.initializeRoutes()
    }
    private initializeRoutes() {
        this.router.get("/cart", authMiddleware)
        this.router.get("add-to-cart", authMiddleware, this.cartController.addToCart)
    }
}