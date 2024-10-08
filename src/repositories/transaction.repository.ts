import { IProductVariant } from "../interfaces/product-variant.interface"
import { IProduct } from "../interfaces/product.interface"
import { IReview } from "../interfaces/review.interface"
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
            user: userId,
            shop: shopId,
        })
    }

    public async createTransactionDetail(quantity: number, product: IProduct, variant: IProductVariant) {
        return await this.transactionDetail.create({
            quantity: quantity,
            product: product,
            variant: variant
        })
    }

    public async getTransactionByShop(shopId: string) {
        return await this.transactionHeader.find({ shop: shopId }).populate([
            {
                path: "details", populate: [
                    { path: "product" },
                    { path: "variant" },
                ]
            },
            { path: "shop" }
        ]
        )
    }

    public async getTransactionByUser(userId: string) {
        return await this.transactionHeader.find({ user: userId }).populate([
            {
                path: "details", populate: [
                    { path: "product" },
                    { path: "variant" },
                ]
            },
            { path: "shop" }
        ]
        )
    }

    public async getTransactionWithNoReview(userId: string) {
        return await this.transactionHeader.find({
            user: userId,
        }).populate([
            {
                path: "details",
                match: { reviewStatus: false },
                populate: [
                    { path: "product" },
                    { path: "variant" },
                ]
            },
            { path: "shop" }
        ]
        ).exec()
            .then((transactions) => {
                return transactions.filter((transaction) => transaction.details.length > 0)
            })
    }

    public async getTransactionWithReview(userId: string) {
        return await this.transactionHeader.find({
            user: userId,
        }).populate([
            {
                path: "details",
                match: { reviewStatus: true },
                populate: [
                    { path: "review" },
                    { path: "product" },
                    { path: "variant" },
                ]
            },
            { path: "shop" }
        ]
        ).exec()
            .then((transactions) => {
                return transactions.filter((transaction) => transaction.details.length > 0)
            })
    }

    public async updateTransaction(transactionDetailId: string, review: IReview) {
        return await this.transactionDetail.updateOne({ _id: transactionDetailId }, { reviewStatus: true, review: review })
    }
}