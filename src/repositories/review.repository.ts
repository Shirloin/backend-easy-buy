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
}