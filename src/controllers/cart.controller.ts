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
            const { cartItemId, quantity } = req.body

            const cartItem = await this.cartRepository.getCartItemById(cartItemId)
            if (!cartItem) {
                return res.status(404).json({ message: "Cart Item not found" })
            }
            if (cartItem.variant.stock < quantity) {
                return res.status(422).json({ message: "Quantity must be lower than total stock" })
            }

            const cart = await this.cartRepository.updateCartQuantity(cartItemId, quantity)
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
            const { cartItemId } = req.params
            const cartItem = await this.cartRepository.getCartItemById(cartItemId)
            if (!cartItem) {
                return res.status(404).json({ message: "Cart Item not found" })
            }
            if (cartItem.variant.stock <= cartItem.quantity) {
                return res.status(422).json({ message: "Quantity must be lower than total stock" })
            }
            const cart = await this.cartRepository.incrementCartQuantity(cartItemId)
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
            const { cartItemId } = req.params
            const cartItem = await this.cartRepository.getCartItemById(cartItemId)
            if (!cartItem) {
                return res.status(404).json({ message: "Cart Item not found" })
            }
            if (cartItem.quantity <= 1) {
                return res.status(422).json({ message: "Quantity must be at least 1" })
            }
            const cart = await this.cartRepository.decrementCartQuantity(cartItemId)
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
            const updatedUser = await this.cartRepository.removeCartFromUser(user._id)

            return res.status(200).json({ message: "Cart has been removed" })
        } catch (error) {
            next(error)
        }
    }

    public deleteCartItems = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const { cartItemIds } = req.body
            if (cartItemIds.length === 0 || !Array.isArray(cartItemIds)) {
                return res.status(400).json({ message: "Invalid cart item ID's" })
            }
            const cart = await this.cartRepository.deleteCartItems(cartItemIds)
            const updatedUser = await this.cartRepository.removeCartFromUser(user._id)
            await this.cartRepository.deleteEmptyCart()
            return res.status(200).json({ message: "Cart has been removed" })
        } catch (error) {
            next(error)
        }
    }



}