import { Router } from "express";
import { Routes } from "../interfaces/auth.interface";
import { authMiddleware } from "../middleware";
import ReviewController from "../controllers/review.controller";

export default class ReviewRoute implements Routes {
    public router = Router()
    private reviewController = new ReviewController()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.post("/review", authMiddleware, this.reviewController.createReview)
    }
}