import { Router } from "express";
import { Routes } from "../interfaces/auth.interface";
import { authMiddleware } from "../middleware";
import CartController from "../controllers/cart.controller";
import { ValidateAddToCart, ValidateUpdateCartQuantity } from "../validators/cart.validator";

export default class CartRoute implements Routes {
    public router = Router()
    private cartController = new CartController()

    constructor() {
        this.initializeRoutes()
    }
    private initializeRoutes() {
        this.router.get("/cart", authMiddleware, this.cartController.getCart)
        this.router.post("/cart/add-to-cart", authMiddleware, ValidateAddToCart, this.cartController.addToCart)
        this.router.put("/cart/update-quantity", authMiddleware, ValidateUpdateCartQuantity, this.cartController.updateCartQuantity)
        this.router.put("/cart/:cartItemId/increment-quantity", authMiddleware, this.cartController.incrementCartQuantity)
        this.router.put("/cart/:cartItemId/decrement-quantity", authMiddleware, this.cartController.decrementCartQuantity)
        this.router.delete("/cart/:cartItemId", authMiddleware, this.cartController.deleteCartItem)
        this.router.delete("/carts", authMiddleware, this.cartController.deleteCartItems)

    }
}