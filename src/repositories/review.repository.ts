import { Types } from "mongoose"
import { ICreateReview } from "../interfaces/review.interface"
import Review from "../models/review.model"

export default class ReviewRepository {
    static instance: ReviewRepository
    private review = Review
    constructor() {
        if (ReviewRepository.instance) {
            throw new Error("Use Cart Repository Get Instance Singleton")
        }
        ReviewRepository.instance = this
    }

    static getInstance() {
        if (!ReviewRepository.instance) {
            ReviewRepository.instance = new ReviewRepository()
        }
        return ReviewRepository.instance
    }

    public async createReview(createReviewData: ICreateReview) {
        return await this.review.create(createReviewData)
    }

    public async getReviewByProduct(productId: string) {
        return await this.review.find({ product: productId })
            .populate([
                { path: "creator" },
                { path: "productVariant" }
            ])
            .limit(10)
    }

    public async getProductRating(productId: string) {
        const result = await this.review.aggregate([
            { $match: { product: new Types.ObjectId(productId) } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    userCount: {
                        $sum: 1
                    }
                }
            },
        ]).exec()
        if (result.length > 0) {
            return result[0]
        }
        return { averageRating: 0, userCount: 0 }
    }
}