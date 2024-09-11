import { Router } from "express";
import { Routes } from "../interfaces/auth.interface";

export default class ReviewRoute implements Routes {
    public router = Router()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router
    }
}