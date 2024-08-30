import { Document } from "mongoose"
import { IChat } from "./chat.interface"
import { IShop } from "./shop.interface"
import { IUser } from "./user.interface"

export interface IChatRoom extends Document {
    _id: string
    user: IUser
    shop: IShop
    chat: IChat
}