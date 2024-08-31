import { Router } from "express";
import { Routes } from "../interfaces/auth.interface";
import ChatController from "../controllers/chat.controller";
import { authMiddleware } from "../middleware";

export default class ChatRoute implements Routes {
    public router = Router()
    public chatController = new ChatController()

    constructor() {
        this.initializeRoutes()
    }
    private initializeRoutes() {
        this.router.get("/user-chat-room", authMiddleware, this.chatController.getAllUserChatRoom)
        this.router.get("/chat-room", authMiddleware, this.chatController.getRoom)
        this.router.post("/chat-room", authMiddleware, this.chatController.createChatRoom)
    }
}