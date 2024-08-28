import { NextFunction, Request, Response } from "express";
import TransactionRepository from "../repositories/transaction.repository";
import UserRepository from "../repositories/user.repository";
import { ICart } from "../interfaces/cart.interface";
import ITransactionHeader from "../interfaces/transaction-header.interface";
import CartRepository from "../repositories/cart.repository";

export default class TransactionController {
    public transactionRepository = TransactionRepository.getInstance()
    public userRepository = UserRepository.getInstance();
    public cartRepository = CartRepository.getInstance();

    public createTransaction = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            const sessionUser = (req.session as any).user;
            let user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const { cartIds } = req.body
            if (cartIds.length === 0 || !Array.isArray(cartIds)) {
                return res.status(400).json({ message: "No Selected Item" })
            }
            const transactions: ITransactionHeader[] = []
            for (const id of cartIds) {
                const cart = await this.cartRepository.getCartById(id);
                if (!cart) {
                    continue;
                }
                const transactionHeader = await this.transactionRepository.createTransactionHeader(user._id, cart.shop._id);

                for (const item of cart.items) {
                    const transactionDetail = await this.transactionRepository.createTransactionDetail(item.quantity, item.variant.product, item.variant);
                    transactionHeader.transactionDetails.push(transactionDetail);
                }

                await transactionHeader.save();
                transactions.push(transactionHeader);
            }
            const deletedCarts = await this.cartRepository.deleteCarts(cartIds)
            user = await this.userRepository.removeCartFromUser(user._id, cartIds)

            return res.status(200).json({ transactions: transactions, message: "Transaction has successfully been made" })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}