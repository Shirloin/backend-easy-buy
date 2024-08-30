import { Document } from "mongoose"
import { IChatRoom } from "./chat-room.interface"
import { IShop } from "./shop.interface"
import { IUser } from "./user.interface"

export interface IChat extends Document {
    _id: string
    text: string
    sender: IUser | IShop
    chatRoom: IChatRoom
    createdAt: Date
    updatedAt: Date
}

export interface ICreateChat {
    text: string
    sender: IUser | IShop
    chatRoom: IChatRoom
}