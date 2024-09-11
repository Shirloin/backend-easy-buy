import { IProductVariant } from "./product-variant.interface"
import { IProduct } from "./product.interface"
import { IReview } from "./review.interface"
import ITransactionHeader from "./transaction-header.interface"

export default interface ITransactionDetail {
    _id: string
    quantity: number
    transaction: ITransactionHeader
    product: IProduct
    variant: IProductVariant
    review: IReview
}