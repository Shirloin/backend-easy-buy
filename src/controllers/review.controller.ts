import { NextFunction, Request, Response } from "express";
import ReviewRepository from "../repositories/review.repository";
import UserRepository from "../repositories/user.repository";
import { ICreateReview } from "../interfaces/review.interface";
import TransactionRepository from "../repositories/transaction.repository";
import logger from "../utils/logger";

export default class ReviewController {
    private reviewRepository = ReviewRepository.getInstance()
    private transactionRepository = TransactionRepository.getInstance()
    private userRepository = UserRepository.getInstance();

    public createReview = async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info("ReviewController.createReview - Creating review", {
                userId: (req.session as any).user?.id,
                productId: req.body.product,
                rating: req.body.rating,
            });
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                logger.warn("ReviewController.createReview - User not found", {
                    userId: sessionUser.id,
                });
                return res.status(404).json({ message: "User not found" });
            }
            const { rating, text, product, productVariant, transactionDetail } = req.body
            const createReviewData: ICreateReview = {
                rating: rating,
                text: text,
                product: product,
                productVariant: productVariant,
                transactionDetail: transactionDetail,
                creator: user._id
            }

            const review = await this.reviewRepository.createReview(createReviewData)
            const transaction = await this.transactionRepository.updateTransaction(transactionDetail, review)

            logger.info("ReviewController.createReview - Review created successfully", {
                reviewId: review._id,
                productId: product,
            });
            return res.status(200).json({ review: review, message: "Review has been submitted" })
        } catch (error) {
            logger.error("ReviewController.createReview - Error creating review", {
                productId: req.body.product,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            next(error)
        }
    }

    public getReviewByProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info("ReviewController.getReviewByProduct - Fetching reviews by product", {
                productId: req.params.id,
            });
            const { id } = req.params
            const reviews = await this.reviewRepository.getReviewByProduct(id)
            logger.info("ReviewController.getReviewByProduct - Reviews fetched successfully", {
                productId: id,
                reviewCount: reviews.length,
            });
            return res.status(200).json({ reviews })
        } catch (error) {
            logger.error("ReviewController.getReviewByProduct - Error fetching reviews", {
                productId: req.params.id,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            next(error)
        }
    }

    public getReviewRating = async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info("ReviewController.getReviewRating - Fetching product rating", {
                productId: req.params.id,
            });
            const { id } = req.params
            const rating = await this.reviewRepository.getProductRating(id)
            logger.info("ReviewController.getReviewRating - Product rating fetched successfully", {
                productId: id,
                averageRating: rating.averageRating,
                userCount: rating.userCount,
            });
            return res.status(200).json({
                averageRating: rating.averageRating,
                userCount: rating.userCount
            });
        } catch (error) {
            logger.error("ReviewController.getReviewRating - Error fetching product rating", {
                productId: req.params.id,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            next(error)
        }
    }
}