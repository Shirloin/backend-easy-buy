import { NextFunction, Request, Response } from "express";
import TransactionRepository from "../repositories/transaction.repository";
import UserRepository from "../repositories/user.repository";
import { ICart } from "../interfaces/cart.interface";
import ITransactionHeader from "../interfaces/transaction-header.interface";
import CartRepository from "../repositories/cart.repository";
import ShopRepository from "../repositories/shop.repository";
import logger from "../utils/logger";

export default class TransactionController {
    private transactionRepository = TransactionRepository.getInstance()
    private userRepository = UserRepository.getInstance();
    private cartRepository = CartRepository.getInstance();
    private shopRepository = ShopRepository.getInstance()

    public createTransaction = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            logger.info("TransactionController.createTransaction - Creating transaction", {
                userId: (req.session as any).user?.id,
                cartIds: req.body.cartIds,
            });
            const sessionUser = (req.session as any).user;
            let user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                logger.warn("TransactionController.createTransaction - User not found", {
                    userId: sessionUser.id,
                });
                return res.status(404).json({ message: "User not found" });
            }
            const { cartIds } = req.body
            if (cartIds.length === 0 || !Array.isArray(cartIds)) {
                logger.warn("TransactionController.createTransaction - No selected items", {
                    cartIds: req.body.cartIds,
                });
                return res.status(400).json({ message: "No Selected Item" })
            }
            const transactions: ITransactionHeader[] = []
            for (const id of cartIds) {
                const cart = await this.cartRepository.getCartById(id);
                if (!cart) {
                    logger.warn("TransactionController.createTransaction - Cart not found", { cartId: id });
                    continue;
                }
                const transactionHeader = await this.transactionRepository.createTransactionHeader(user._id, cart.shop._id);

                for (const item of cart.items) {
                    const transactionDetail = await this.transactionRepository.createTransactionDetail(item.quantity, item.variant.product, item.variant);
                    transactionHeader.details.push(transactionDetail);
                }

                await transactionHeader.save();
                transactions.push(transactionHeader);
            }
            const deletedCarts = await this.cartRepository.deleteCarts(cartIds)
            user = await this.userRepository.removeCartFromUser(user._id, cartIds)

            logger.info("TransactionController.createTransaction - Transaction created successfully", {
                userId: user?._id,
                transactionCount: transactions.length,
            });
            return res.status(200).json({ transactions: transactions, message: "Transaction has successfully been made" })
        } catch (error) {
            logger.error("TransactionController.createTransaction - Error creating transaction", {
                userId: (req.session as any).user?.id,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            next(error)
        }
    }

    public getTransactionByShop = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            logger.info("TransactionController.getTransactionByShop - Fetching transactions by shop", {
                userId: (req.session as any).user?.id,
            });
            const sessionUser = (req.session as any).user;
            let user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                logger.warn("TransactionController.getTransactionByShop - User not found", {
                    userId: sessionUser.id,
                });
                return res.status(404).json({ message: "User not found" });
            }
            const transactions = await this.transactionRepository.getTransactionByShop(user.shop._id)

            logger.info("TransactionController.getTransactionByShop - Transactions fetched successfully", {
                shopId: user.shop._id,
                transactionCount: transactions.length,
            });
            return res.status(200).json({ transactions: transactions })
        } catch (error) {
            logger.error("TransactionController.getTransactionByShop - Error fetching transactions", {
                userId: (req.session as any).user?.id,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            next(error)
        }
    }
    public getTransactionByUser = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            logger.info("TransactionController.getTransactionByUser - Fetching transactions by user", {
                userId: (req.session as any).user?.id,
            });
            const sessionUser = (req.session as any).user;
            let user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                logger.warn("TransactionController.getTransactionByUser - User not found", {
                    userId: sessionUser.id,
                });
                return res.status(404).json({ message: "User not found" });
            }
            const transactions = await this.transactionRepository.getTransactionByUser(user._id)

            logger.info("TransactionController.getTransactionByUser - Transactions fetched successfully", {
                userId: user._id,
                transactionCount: transactions.length,
            });
            return res.status(200).json({ transactions: transactions })
        } catch (error) {
            logger.error("TransactionController.getTransactionByUser - Error fetching transactions", {
                userId: (req.session as any).user?.id,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            next(error)
        }
    }

    public getTransactionWithNoReview = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            logger.info("TransactionController.getTransactionWithNoReview - Fetching transactions without review", {
                userId: (req.session as any).user?.id,
            });
            const sessionUser = (req.session as any).user;
            let user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                logger.warn("TransactionController.getTransactionWithNoReview - User not found", {
                    userId: sessionUser.id,
                });
                return res.status(404).json({ message: "User not found" });
            }
            const transactions = await this.transactionRepository.getTransactionWithNoReview(user._id)

            logger.info("TransactionController.getTransactionWithNoReview - Transactions fetched successfully", {
                userId: user._id,
                transactionCount: transactions.length,
            });
            return res.status(200).json({ transactions: transactions })
        } catch (error) {
            logger.error("TransactionController.getTransactionWithNoReview - Error fetching transactions", {
                userId: (req.session as any).user?.id,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            next(error)
        }
    }
    public getTransactionWithReview = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            logger.info("TransactionController.getTransactionWithReview - Fetching transactions with review", {
                userId: (req.session as any).user?.id,
            });
            const sessionUser = (req.session as any).user;
            let user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                logger.warn("TransactionController.getTransactionWithReview - User not found", {
                    userId: sessionUser.id,
                });
                return res.status(404).json({ message: "User not found" });
            }
            const transactions = await this.transactionRepository.getTransactionWithReview(user._id)

            logger.info("TransactionController.getTransactionWithReview - Transactions fetched successfully", {
                userId: user._id,
                transactionCount: transactions.length,
            });
            return res.status(200).json({ transactions: transactions })
        } catch (error) {
            logger.error("TransactionController.getTransactionWithReview - Error fetching transactions", {
                userId: (req.session as any).user?.id,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            next(error)
        }
    }
}