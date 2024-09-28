import { NextFunction, Request, Response } from "express";
import ReviewRepository from "../repositories/review.repository";
import UserRepository from "../repositories/user.repository";
import { ICreateReview } from "../interfaces/review.interface";
import TransactionRepository from "../repositories/transaction.repository";

export default class ReviewController {
    private reviewRepository = ReviewRepository.getInstance()
    private transactionRepository = TransactionRepository.getInstance()
    private userRepository = UserRepository.getInstance();

    public createReview = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
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

            return res.status(200).json({ review: review, message: "Review has been submitted" })
        } catch (error) {
            next(error)
        }
    }

    public getReviewByProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params
            const reviews = await this.reviewRepository.getReviewByProduct(id)
            return res.status(200).json({ reviews })
        } catch (error) {
            next(error)
        }
    }

    public getReviewRating = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params
            const rating = await this.reviewRepository.getProductRating(id)
            return res.status(200).json({
                averageRating: rating.averageRating,
                userCount: rating.userCount
            });
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}