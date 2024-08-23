import { populate } from "dotenv"
import { IProductVariant } from "../interfaces/product-variant.interface"
import { IShop } from "../interfaces/shop.interface"
import { IUser } from "../interfaces/user.interface"
import CartItem from "../models/cart-item.model"
import Cart from "../models/cart.model"
import path from "path"

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
        const newCartItem = await this.cartItem.create({
            quantity: quantity,
            variant: variantId,
        })
        let cart = await this.cart.findOne({ user: userId, shop: shopId })
        if (!cart) {
            cart = await this.cart.create({
                user: userId,
                shop: shopId,
                items: [newCartItem],
            })
        } else {
            cart.items.push(newCartItem)
            await cart.save()
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
}