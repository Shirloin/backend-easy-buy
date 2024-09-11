import { IProductVariant } from "./product-variant.interface"
import ITransactionDetail from "./transaction-detail.interface"
import { IUser } from "./user.interface"

export interface IReview {
    rating: number
    text: string
    productVariant: IProductVariant
    transaction: ITransactionDetail
    creator: IUser
}

export interface ICreateReview {
    rating: number
    text: string
    productVariant: string
    transaction: string
    creator: string
}