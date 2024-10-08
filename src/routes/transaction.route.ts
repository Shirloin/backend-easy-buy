import { Router } from "express";
import { Routes } from "../interfaces/auth.interface";
import { authMiddleware } from "../middleware";
import TransactionController from "../controllers/transaction.controller";

export default class TransationRoute implements Routes {
    public router = Router()
    private transactionController = new TransactionController()
    constructor() {
        this.initializeRoutes()
    }
    private initializeRoutes() {
        this.router.get("/transaction/shop", authMiddleware, this.transactionController.getTransactionByShop)
        this.router.post("/transaction", authMiddleware, this.transactionController.createTransaction)
        this.router.get("/transaction", authMiddleware, this.transactionController.getTransactionByUser)
        this.router.get("/transaction/no-review", authMiddleware, this.transactionController.getTransactionWithNoReview)
        this.router.get("/transaction/review", authMiddleware, this.transactionController.getTransactionWithReview)
    }
}