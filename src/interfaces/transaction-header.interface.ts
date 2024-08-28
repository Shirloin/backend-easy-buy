import { IAddress } from "./address.interface"
import { IShop } from "./shop.interface"
import ITransactionDetail from "./transaction-detail.interface"
import { IUser } from "./user.interface"

export default interface ITransactionHeader {
    _id: string
    date: Date
    address: IAddress
    user: IUser
    shop: IShop
    transactionDetails: ITransactionDetail[]
}