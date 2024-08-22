import { ICartItem } from "./cart-item.interface";
import { IUser } from "./user.interface";

export interface ICart {
    _id: string
    user: IUser
    items: ICartItem[]
} 