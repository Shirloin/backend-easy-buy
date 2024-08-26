import { IProductVariant } from "./product-variant.interface"
import { IProduct } from "./product.interface"
import ITransactionHeader from "./transaction-header.interface"

export default interface ITransactionDetail {
    _id: string
    quantity: number
    transactionHeader: ITransactionHeader
    product: IProduct
    productVariant: IProductVariant
}