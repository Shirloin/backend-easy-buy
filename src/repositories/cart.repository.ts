import { populate } from "dotenv"
import CartItem from "../models/cart-item.model"
import Cart from "../models/cart.model"

export default class CartRepository {
    static instance: CartRepository
    private cart = Cart
    private cartItem = CartItem
    constructor() {
        if (CartRepository.instance) {
            throw new Error("Use Cart Repository Get Instance Singleton")
        }
        CartRepository.instance = this
    }

    static getInstance() {
        if (!CartRepository.instance) {
            CartRepository.instance = new CartRepository()
        }
        return CartRepository.instance
    }

    public async addToCart(userId: string, variantId: string, shopId: string, quantity: number) {
        let cart = await this.cart.findOne({ user: userId, shop: shopId });

        if (cart) {
            const existingCartItem = await this.cartItem.findOne({ variant: variantId, _id: { $in: cart.items } },)

            if (existingCartItem) {
                existingCartItem.quantity += quantity;
                await existingCartItem.save()
            } else {
                const newCartItem = await this.cartItem.create({
                    quantity: quantity,
                    variant: variantId,
                });
                cart.items.push(newCartItem);
            }

            await cart.save();
        } else {
            const newCartItem = await this.cartItem.create({
                quantity: quantity,
                variant: variantId,
            });

            cart = await this.cart.create({
                user: userId,
                shop: shopId,
                items: [newCartItem],
            });
        }
        return cart
    }
    public async getCart(userId: string) {
        return await this.cart.find({ user: userId })
            .populate([{
                path: 'items',
                populate: [
                    {
                        path: 'variant',
                        model: 'ProductVariant',
                        populate: [
                            {
                                path: "product",
                                model: "Product",
                                populate: [
                                    {
                                        path: "productImages",
                                        model: "ProductImage"
                                    }

                                ]
                            }
                        ]
                    },
                ],
            },
            { path: "shop", model: "Shop" }])
            .exec();
    }

    public async updateCartQuantity(cartItemId: string, quantity: number) {
        const cartItem = await this.cartItem.findById(cartItemId)

        if (!cartItem) return null
        cartItem.quantity = quantity
        await cartItem.save()
        return cartItem
    }

    public async incrementCartQuantity(cartItemId: string) {
        const cartItem = await this.cartItem.findById(cartItemId)
        if (!cartItem) return null
        cartItem.quantity += 1
        await cartItem.save()
        return cartItem
    }
    public async decrementCartQuantity(cartItemId: string) {
        const cartItem = await this.cartItem.findById(cartItemId)
        if (!cartItem) return null
        cartItem.quantity -= 1
        await cartItem.save()
        return cartItem
    }

    public async getCartItem(cartId: string, variantId: string) {
        const cartItem = await this.cartItem.findOne({
            cart: cartId,
            variant: variantId
        });
        return cartItem
    }

    public async getCartItemById(cartItemId: string) {
        return await this.cartItem.findById(cartItemId).populate([
            "variant",
        ])
    }

    public async deleteCartItem(cartItemId: string) {
        const cartItem = await this.cartItem.deleteOne({ _id: cartItemId })
        if (cartItem.deletedCount === 0) {
            return null
        }
        const cart = await this.cart.updateMany(
            { items: cartItemId },
            { $pull: { items: cartItemId } }
        );
        return cart
    }
}