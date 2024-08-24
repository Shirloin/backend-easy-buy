import { NextFunction, Request, Response } from "express";
import UserRepository from "../repositories/user.repository";
import CartRepository from "../repositories/cart.repository";
import { IProductVariant } from "../interfaces/product-variant.interface";
import ShopRepository from "../repositories/shop.repository";
import ProductRepository from "../repositories/product.repository";

export default class CartController {
    private userRepository = UserRepository.getInstance();
    private cartRepository = CartRepository.getInstance();
    private shopRepository = ShopRepository.getInstance()
    private productRepository = ProductRepository.getInstance()
    public addToCart = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const { variantId, shopId, quantity } = req.body
            const newCart = await this.cartRepository.addToCart(user._id, variantId, shopId, quantity)
            user.carts.push(newCart)
            await user.save()
            res.status(200).json({ cart: newCart, message: "Product has been added to cart" })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    public getCart = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const carts = await this.cartRepository.getCart(user._id)
            res.status(200).json({ carts: carts })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    public updateCartQuantity = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const { variantId, cartId, quantity } = req.body

            const productVariant = await this.productRepository.getProductVariantById(variantId)
            if (!productVariant) {
                return res.status(404).json({ message: "Product Variant not found" })
            }
            if (productVariant.stock < quantity) {
                return res.status(422).json({ message: "Quantity must be lower than total stock" })
            }

            const cart = await this.cartRepository.updateCartQuantity(cartId, variantId, quantity)
            res.status(200).json({ cart: cart })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    public incrementCartQuantity = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const { cartId, variantId } = req.body
            const productVariant = await this.productRepository.getProductVariantById(variantId)
            if (!productVariant) {
                return res.status(404).json({ message: "Product Variant not found" })
            }
            const cartItem = await this.cartRepository.getCartItem(cartId, variantId)
            if (!cartItem) {
                return res.status(404).json({ message: "Cart Item not found" })
            }
            if (productVariant.stock < cartItem.quantity) {
                return res.status(422).json({ message: "Quantity must be lower than total stock" })
            }
            const cart = await this.cartRepository.incrementCartQuantity(cartId, variantId)
            res.status(200).json({ cart: cart })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    public decrementCartQuantity = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const { cartId, variantId } = req.body
            const productVariant = await this.productRepository.getProductVariantById(variantId)
            if (!productVariant) {
                return res.status(404).json({ message: "Product Variant not found" })
            }
            const cartItem = await this.cartRepository.getCartItem(cartId, variantId)
            if (!cartItem) {
                return res.status(404).json({ message: "Cart Item not found" })
            }
            if (cartItem.quantity <= 1) {
                return res.status(422).json({ message: "Quantity must be at least 1" })
            }
            const cart = await this.cartRepository.decrementCartQuantity(cartId, variantId)
            res.status(200).json({ cart: cart })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    public deleteCartItem = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const { cartItemId } = req.params
            const cart = await this.cartRepository.deleteCartItem(cartItemId)
            return res.status(200).json({ message: "Cart has been removed" })
        } catch (error) {
            next(error)
        }
    }



}