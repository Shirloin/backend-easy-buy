import { ICart } from "./cart.interface";
import { IProductVariant } from "./product-variant.interface";
import { IShop } from "./shop.interface";

export interface ICartItem {
    _id: string
    quantity: number
    variant: IProductVariant
    cart: ICart
}