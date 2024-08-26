import { IShop } from "./shop.interface"
import { IUser } from "./user.interface"

export default interface ITransactionHeader {
    _id: string
    date: Date
    user: IUser
    shop: IShop
}