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
            const { rating, text, productVariant, transactionDetail } = req.body
            const createReviewData: ICreateReview = {
                rating: rating,
                text: text,
                productVariant: productVariant,
                transactionDetail: transactionDetail,
                creator: user._id
            }
            const updatedTransaction = this.transactionRepository.updateTransactionReviewStatus(transactionDetail)

            const review = await this.reviewRepository.createReview(createReviewData)
            return res.status(200).json({ review: review, message: "Review has been submitted" })
        } catch (error) {
            next(error)
        }
    }
}