import { ICartItem } from "./cart-item.interface";
import { IUser } from "./user.interface";

export interface ICart {
    user: IUser
    items: ICartItem[]
} 