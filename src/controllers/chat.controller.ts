import { NextFunction, Request, Response } from "express";
import ShopRepository from "../repositories/shop.repository";
import UserRepository from "../repositories/user.repository";
import ChatRepository from "../repositories/chat.repository";
import { ICreateChatRoom } from "../interfaces/chat-room.interface";
import { ICreateChat } from "../interfaces/chat.interface";
import { Websocket } from "../websocket/websocket";

export default class ChatController {
    public shopRepository = ShopRepository.getInstance();
    public userRepository = UserRepository.getInstance();
    public chatRepository = ChatRepository.getInstance()
    private io = Websocket.getInstance()

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

    public getChat = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const { chatRoomId } = req.params
            const chats = await this.chatRepository.getChat(chatRoomId)
            console.log(chats)
            return res.status(200).json({ chats: chats })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    public createChat = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const { text, senderId, chatRoomId, type } = req.body
            const chatData: ICreateChat = { text, sender: senderId, chatRoom: chatRoomId, type }
            const chat = await this.chatRepository.createChat(chatData)
            this.io.to(chatRoomId).emit("receive_message", chat);
            return res.status(200).json({ chat: "" })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

}