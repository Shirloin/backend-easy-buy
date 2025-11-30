import { Types } from "mongoose"
import { ICreateReview } from "../interfaces/review.interface"
import Review from "../models/review.model"
import logger from "../utils/logger"

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
        logger.info("ReviewRepository.createReview - Creating review", {
            productId: createReviewData.product,
            creatorId: createReviewData.creator,
            rating: createReviewData.rating,
        });
        const review = await this.review.create(createReviewData)
        logger.info("ReviewRepository.createReview - Review created successfully", {
            reviewId: review._id,
            productId: createReviewData.product,
        });
        return review
    }

    public async getReviewByProduct(productId: string) {
        logger.info("ReviewRepository.getReviewByProduct - Fetching reviews by product", { productId });
        const reviews = await this.review.find({ product: productId })
            .populate([
                { path: "creator" },
                { path: "productVariant" }
            ])
            .limit(10)
        logger.info("ReviewRepository.getReviewByProduct - Reviews fetched successfully", {
            productId,
            count: reviews.length,
        });
        return reviews
    }

    public async getProductRating(productId: string) {
        logger.info("ReviewRepository.getProductRating - Calculating product rating", { productId });
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
        const rating = result.length > 0 ? result[0] : { averageRating: 0, userCount: 0 }
        logger.info("ReviewRepository.getProductRating - Product rating calculated", {
            productId,
            averageRating: rating.averageRating,
            userCount: rating.userCount,
        });
        return rating
    }
}