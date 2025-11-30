import { NextFunction, Request, Response } from "express";
import UserRepository from "../repositories/user.repository";
import CartRepository from "../repositories/cart.repository";
import { IProductVariant } from "../interfaces/product-variant.interface";
import ShopRepository from "../repositories/shop.repository";
import ProductRepository from "../repositories/product.repository";
import logger from "../utils/logger";

export default class CartController {
    private userRepository = UserRepository.getInstance();
    private cartRepository = CartRepository.getInstance();
    private shopRepository = ShopRepository.getInstance()
    private productRepository = ProductRepository.getInstance()
    public addToCart = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            logger.info("CartController.addToCart - Adding item to cart", {
                userId: (req.session as any).user?.id,
                variantId: req.body.variantId,
                shopId: req.body.shopId,
                quantity: req.body.quantity,
            });
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                logger.warn("CartController.addToCart - User not found", {
                    userId: sessionUser.id,
                });
                return res.status(404).json({ message: "User not found" });
            }
            const { variantId, shopId, quantity } = req.body
            let cart = await this.cartRepository.getCartByUserAndShop(user._id, shopId)
            // Cart Exist
            if (cart) {
                const existingCartItem = await this.cartRepository.getCartItemByCartAndVariant(cart.items, variantId)

                // Cart Item Exist
                if (existingCartItem) {
                    existingCartItem.quantity += quantity;
                    await existingCartItem.save()
                    logger.info("CartController.addToCart - Updated existing cart item", {
                        cartItemId: existingCartItem._id,
                    });
                }
                // Cart Item Not Exist
                else {
                    const newCartItem = await this.cartRepository.createCartItem(variantId, quantity);
                    cart.items.push(newCartItem);
                    await cart.save()
                    logger.info("CartController.addToCart - Added new item to existing cart", {
                        cartItemId: newCartItem._id,
                    });
                }
            }
            // Cart Not Exist
            else {
                const newCartItem = await this.cartRepository.createCartItem(variantId, quantity);
                cart = await this.cartRepository.createCart(user._id, shopId, newCartItem._id)
                user.carts.push(cart)
                await user.save()
                logger.info("CartController.addToCart - Created new cart", {
                    cartId: cart._id,
                });
            }
            logger.info("CartController.addToCart - Item added to cart successfully", {
                cartId: cart._id,
            });
            res.status(200).json({ cart: cart, message: "Product has been added to cart" })
        } catch (error) {
            logger.error("CartController.addToCart - Error adding item to cart", {
                variantId: req.body.variantId,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            next(error)
        }
    }
    public getCart = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            logger.info("CartController.getCart - Fetching user cart", {
                userId: (req.session as any).user?.id,
            });
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                logger.warn("CartController.getCart - User not found", {
                    userId: sessionUser.id,
                });
                return res.status(404).json({ message: "User not found" });
            }
            const carts = await this.cartRepository.getCart(user._id)
            logger.info("CartController.getCart - Cart fetched successfully", {
                userId: user._id,
                cartCount: carts.length,
            });
            res.status(200).json({ carts: carts })
        } catch (error) {
            logger.error("CartController.getCart - Error fetching cart", {
                userId: (req.session as any).user?.id,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            next(error)
        }
    }
    public updateCartQuantity = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            logger.info("CartController.updateCartQuantity - Updating cart quantity", {
                userId: (req.session as any).user?.id,
                cartItemId: req.body.cartItemId,
                quantity: req.body.quantity,
            });
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                logger.warn("CartController.updateCartQuantity - User not found", {
                    userId: sessionUser.id,
                });
                return res.status(404).json({ message: "User not found" });
            }
            const { cartItemId, quantity } = req.body

            const cartItem = await this.cartRepository.getCartItemById(cartItemId)
            if (!cartItem) {
                logger.warn("CartController.updateCartQuantity - Cart item not found", {
                    cartItemId,
                });
                return res.status(404).json({ message: "Cart Item not found" })
            }
            if (cartItem.variant.stock < quantity) {
                logger.warn("CartController.updateCartQuantity - Insufficient stock", {
                    cartItemId,
                    requestedQuantity: quantity,
                    availableStock: cartItem.variant.stock,
                });
                return res.status(422).json({ message: "Quantity must be lower than total stock" })
            }

            const cart = await this.cartRepository.updateCartQuantity(cartItemId, quantity)
            logger.info("CartController.updateCartQuantity - Cart quantity updated successfully", {
                cartItemId: req.body.cartItemId,
            });
            res.status(200).json({ cart: cart })
        } catch (error) {
            logger.error("CartController.updateCartQuantity - Error updating cart quantity", {
                cartItemId: req.body.cartItemId,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            next(error)
        }
    }
    public incrementCartQuantity = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            logger.info("CartController.incrementCartQuantity - Incrementing cart quantity", {
                userId: (req.session as any).user?.id,
                cartItemId: req.params.cartItemId,
            });
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                logger.warn("CartController.incrementCartQuantity - User not found", {
                    userId: sessionUser.id,
                });
                return res.status(404).json({ message: "User not found" });
            }
            const { cartItemId } = req.params
            const cartItem = await this.cartRepository.getCartItemById(cartItemId)
            if (!cartItem) {
                logger.warn("CartController.incrementCartQuantity - Cart item not found", {
                    cartItemId,
                });
                return res.status(404).json({ message: "Cart Item not found" })
            }
            if (cartItem.variant.stock <= cartItem.quantity) {
                logger.warn("CartController.incrementCartQuantity - Insufficient stock", {
                    cartItemId,
                    currentQuantity: cartItem.quantity,
                    availableStock: cartItem.variant.stock,
                });
                return res.status(422).json({ message: "Quantity must be lower than total stock" })
            }
            const cart = await this.cartRepository.incrementCartQuantity(cartItemId)
            logger.info("CartController.incrementCartQuantity - Cart quantity incremented successfully", {
                cartItemId,
            });
            res.status(200).json({ cart: cart })
        } catch (error) {
            logger.error("CartController.incrementCartQuantity - Error incrementing cart quantity", {
                cartItemId: req.params.cartItemId,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            next(error)
        }
    }
    public decrementCartQuantity = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            logger.info("CartController.decrementCartQuantity - Decrementing cart quantity", {
                userId: (req.session as any).user?.id,
                cartItemId: req.params.cartItemId,
            });
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                logger.warn("CartController.decrementCartQuantity - User not found", {
                    userId: sessionUser.id,
                });
                return res.status(404).json({ message: "User not found" });
            }
            const { cartItemId } = req.params
            const cartItem = await this.cartRepository.getCartItemById(cartItemId)
            if (!cartItem) {
                logger.warn("CartController.decrementCartQuantity - Cart item not found", {
                    cartItemId,
                });
                return res.status(404).json({ message: "Cart Item not found" })
            }
            if (cartItem.quantity <= 1) {
                logger.warn("CartController.decrementCartQuantity - Quantity already at minimum", {
                    cartItemId,
                    quantity: cartItem.quantity,
                });
                return res.status(422).json({ message: "Quantity must be at least 1" })
            }
            const cart = await this.cartRepository.decrementCartQuantity(cartItemId)
            logger.info("CartController.decrementCartQuantity - Cart quantity decremented successfully", {
                cartItemId,
            });
            res.status(200).json({ cart: cart })
        } catch (error) {
            logger.error("CartController.decrementCartQuantity - Error decrementing cart quantity", {
                cartItemId: req.params.cartItemId,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            next(error)
        }
    }

    public deleteCartItem = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            logger.info("CartController.deleteCartItem - Deleting cart item", {
                userId: (req.session as any).user?.id,
                cartItemId: req.params.cartItemId,
            });
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                logger.warn("CartController.deleteCartItem - User not found", {
                    userId: sessionUser.id,
                });
                return res.status(404).json({ message: "User not found" });
            }
            const { cartItemId } = req.params
            const cart = await this.cartRepository.deleteCartItem(cartItemId)
            const updatedUser = await this.cartRepository.removeCartFromUser(user._id)
            await this.cartRepository.deleteEmptyCart()
            logger.info("CartController.deleteCartItem - Cart item deleted successfully", {
                cartItemId,
            });
            return res.status(200).json({ message: "Cart has been removed" })
        } catch (error) {
            logger.error("CartController.deleteCartItem - Error deleting cart item", {
                cartItemId: req.params.cartItemId,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            next(error)
        }
    }

    public deleteCartItems = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            logger.info("CartController.deleteCartItems - Deleting multiple cart items", {
                userId: (req.session as any).user?.id,
                cartItemIds: req.body.cartItemIds,
            });
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                logger.warn("CartController.deleteCartItems - User not found", {
                    userId: sessionUser.id,
                });
                return res.status(404).json({ message: "User not found" });
            }
            const { cartItemIds } = req.body
            if (cartItemIds.length === 0 || !Array.isArray(cartItemIds)) {
                logger.warn("CartController.deleteCartItems - Invalid cart item IDs", {
                    cartItemIds: req.body.cartItemIds,
                });
                return res.status(400).json({ message: "Invalid cart item ID's" })
            }
            const cart = await this.cartRepository.deleteCartItems(cartItemIds)
            const updatedUser = await this.cartRepository.removeCartFromUser(user._id)
            await this.cartRepository.deleteEmptyCart()
            logger.info("CartController.deleteCartItems - Cart items deleted successfully", {
                deletedCount: cartItemIds.length,
            });
            return res.status(200).json({ message: "Cart has been removed" })
        } catch (error) {
            logger.error("CartController.deleteCartItems - Error deleting cart items", {
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            next(error)
        }
    }



}