import { IProductVariant } from "../interfaces/product-variant.interface"
import { IProduct } from "../interfaces/product.interface"
import ITransactionDetail from "../interfaces/transaction-detail.interface"
import TransactionDetail from "../models/transaction-detail.model"
import TransactionHeader from "../models/transaction-header.model"

export default class TransactionRepository {
    static instance: TransactionRepository
    private transactionHeader = TransactionHeader
    private transactionDetail = TransactionDetail

    constructor() {
        if (TransactionRepository.instance) {
            throw new Error("Use Transaction Repository Get Instance Singleton")
        }
        TransactionRepository.instance = this
    }
    static getInstance() {
        if (!TransactionRepository.instance) {
            TransactionRepository.instance = new TransactionRepository()
        }
        return TransactionRepository.instance
    }
    public async createTransactionHeader(userId: string, shopId: string) {
        return await this.transactionHeader.create({
            userId: userId,
            shopId: shopId,
        })
    }

    public async createTransactionDetail(quantity: number, product: IProduct, productVariant: IProductVariant) {
        return await this.transactionDetail.create({
            quantity: quantity,
            product: product,
            productVariant: productVariant
        })
    }
}