import { IProductVariant } from "../interfaces/product-variant.interface"
import { IShop } from "../interfaces/shop.interface"
import { IUser } from "../interfaces/user.interface"
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

    public async addToCart(user_id: string, product_id: string, shop_id: string, quantity: number) {
        const newCartItem = await this.cartItem.create({
            quantity: quantity,
            product: product_id,
            shop: shop_id
        })
        let cart = await this.cart.findOne({ user: user_id })
        if (!cart) {
            cart = await this.cart.create({
                user: user_id,
                items: [newCartItem._id]
            })
        } else {
            cart.items.push(newCartItem)
            await cart.save()
        }
        return cart
    }
}