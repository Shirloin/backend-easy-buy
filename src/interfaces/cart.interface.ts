import { ICartItem } from "./cart-item.interface";
import { IShop } from "./shop.interface";
import { IUser } from "./user.interface";

export interface ICart {
    _id: string
    user: IUser
    shop: IShop
    items: ICartItem[]
} 