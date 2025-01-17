import { IProductVariant } from "./product-variant.interface"
import { IProduct } from "./product.interface"
import ITransactionDetail from "./transaction-detail.interface"
import { IUser } from "./user.interface"

export interface IReview {
    rating: number
    text: string
    product: IProduct
    productVariant: IProductVariant
    transactionDetail: ITransactionDetail
    creator: IUser
    createdAt: Date
    updatedAt: Date
}

export interface ICreateReview {
    rating: number
    text: string
    product: string
    productVariant: string
    transactionDetail: string
    creator: string
}