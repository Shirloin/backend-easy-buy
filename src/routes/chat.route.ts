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
        this.router.get("/shop-chat-room", authMiddleware, this.chatController.getAllShopChatRoom)
        this.router.post("/chat-room", authMiddleware, this.chatController.createChatRoom)
        this.router.get("/chat/:chatRoomId", authMiddleware, this.chatController.getChat)
        this.router.post("/chat", authMiddleware, this.chatController.createChat)
    }
}