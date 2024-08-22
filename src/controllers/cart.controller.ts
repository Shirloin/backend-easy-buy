import { NextFunction, Request, Response } from "express";
import UserRepository from "../repositories/user.repository";
import CartRepository from "../repositories/cart.repository";
import { IProductVariant } from "../interfaces/product-variant.interface";
import ShopRepository from "../repositories/shop.repository";

export default class CartController {
    private userRepository = UserRepository.getInstance();
    private cartRepository = CartRepository.getInstance();
    private shopRepository = ShopRepository.getInstance()
    public addToCart = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const { productId, shopId, quantity } = req.body
            const newCart = await this.cartRepository.addToCart(user._id, productId, shopId, quantity)
            res.status(200).json({ cart: newCart, message: "Product has been added to cart" })
        } catch (error) {
            next(error)
        }
    }
}