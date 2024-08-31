import { NextFunction, Request, Response } from "express";
import ShopRepository from "../repositories/shop.repository";
import UserRepository from "../repositories/user.repository";
import ChatRepository from "../repositories/chat.repository";
import { ICreateChatRoom } from "../interfaces/chat-room.interface";

export default class ChatController {
    public shopRepository = ShopRepository.getInstance();
    public userRepository = UserRepository.getInstance();
    public chatRepository = ChatRepository.getInstance()

    public getAllUserChatRoom = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const chatRooms = await this.chatRepository.getAllUserChatRoom(user._id)
            console.log(chatRooms)
            return res.status(200).json({ chatRooms: chatRooms })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    public getAllShopChatRoom = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const chatRooms = await this.chatRepository.getAllShopChatRoom(user.shop._id)
            return res.status(200).json({ chatRooms: chatRooms })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    public createChatRoom = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const { shopId } = req.body
            console.log(shopId)
            let chatRoom = await this.chatRepository.getRoom(user._id, shopId)
            if (!chatRoom) {
                chatRoom = await this.chatRepository.createChatRoom(shopId, user._id)
            }
            return res.status(200).json({ chatRoom: chatRoom })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    public getRoom = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const { shopId } = req.body
            let chatRoom = await this.chatRepository.getRoom(user._id, shopId)
            if (!chatRoom) {
                chatRoom = await this.chatRepository.createChatRoom(shopId, user._id)
            }
            return res.status(200).json({ chatRoom: chatRoom })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}