import { NextFunction, Request, Response } from "express";
import ShopRepository from "../repositories/shop.repository";
import UserRepository from "../repositories/user.repository";
import ChatRepository from "../repositories/chat.repository";
import { ICreateChatRoom } from "../interfaces/chat-room.interface";
import { ICreateChat } from "../interfaces/chat.interface";
import { Websocket } from "../websocket/websocket";
import logger from "../utils/logger";

export default class ChatController {
    public shopRepository = ShopRepository.getInstance();
    public userRepository = UserRepository.getInstance();
    public chatRepository = ChatRepository.getInstance()
    private io = Websocket.getInstance()

    public getAllUserChatRoom = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            logger.info("ChatController.getAllUserChatRoom - Fetching user chat rooms", {
                userId: (req.session as any).user?.id,
            });
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                logger.warn("ChatController.getAllUserChatRoom - User not found", {
                    userId: sessionUser.id,
                });
                return res.status(404).json({ message: "User not found" });
            }
            const chatRooms = await this.chatRepository.getAllUserChatRoom(user._id)
            logger.info("ChatController.getAllUserChatRoom - Chat rooms fetched successfully", {
                userId: user._id,
                chatRoomCount: chatRooms.length,
            });
            return res.status(200).json({ chatRooms: chatRooms })
        } catch (error) {
            logger.error("ChatController.getAllUserChatRoom - Error fetching chat rooms", {
                userId: (req.session as any).user?.id,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            next(error)
        }
    }
    public getAllShopChatRoom = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            logger.info("ChatController.getAllShopChatRoom - Fetching shop chat rooms", {
                userId: (req.session as any).user?.id,
            });
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                logger.warn("ChatController.getAllShopChatRoom - User not found", {
                    userId: sessionUser.id,
                });
                return res.status(404).json({ message: "User not found" });
            }
            const chatRooms = await this.chatRepository.getAllShopChatRoom(user.shop._id)
            logger.info("ChatController.getAllShopChatRoom - Shop chat rooms fetched successfully", {
                shopId: user.shop._id,
                chatRoomCount: chatRooms.length,
            });
            return res.status(200).json({ chatRooms: chatRooms })
        } catch (error) {
            logger.error("ChatController.getAllShopChatRoom - Error fetching shop chat rooms", {
                userId: (req.session as any).user?.id,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            next(error)
        }
    }
    public createChatRoom = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            logger.info("ChatController.createChatRoom - Creating chat room", {
                userId: (req.session as any).user?.id,
                shopId: req.body.shopId,
            });
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                logger.warn("ChatController.createChatRoom - User not found", {
                    userId: sessionUser.id,
                });
                return res.status(404).json({ message: "User not found" });
            }
            const { shopId } = req.body
            let chatRoom = await this.chatRepository.getRoom(user._id, shopId)
            if (!chatRoom) {
                logger.info("ChatController.createChatRoom - Creating new chat room", {
                    userId: user._id,
                    shopId,
                });
                chatRoom = await this.chatRepository.createChatRoom(shopId, user._id)
            } else {
                logger.info("ChatController.createChatRoom - Existing chat room found", {
                    chatRoomId: chatRoom._id,
                });
            }
            logger.info("ChatController.createChatRoom - Chat room ready", {
                chatRoomId: chatRoom._id,
            });
            return res.status(200).json({ chatRoom: chatRoom })
        } catch (error) {
            logger.error("ChatController.createChatRoom - Error creating chat room", {
                userId: (req.session as any).user?.id,
                shopId: req.body.shopId,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            next(error)
        }
    }

    public getChat = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            logger.info("ChatController.getChat - Fetching chats", {
                userId: (req.session as any).user?.id,
                chatRoomId: req.params.chatRoomId,
            });
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                logger.warn("ChatController.getChat - User not found", {
                    userId: sessionUser.id,
                });
                return res.status(404).json({ message: "User not found" });
            }
            const { chatRoomId } = req.params
            const chats = await this.chatRepository.getChat(chatRoomId)
            logger.info("ChatController.getChat - Chats fetched successfully", {
                chatRoomId,
                chatCount: chats.length,
            });
            return res.status(200).json({ chats: chats })
        } catch (error) {
            logger.error("ChatController.getChat - Error fetching chats", {
                chatRoomId: req.params.chatRoomId,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            next(error)
        }
    }

    public createChat = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            logger.info("ChatController.createChat - Creating chat message", {
                userId: (req.session as any).user?.id,
                chatRoomId: req.body.chatRoomId,
                senderId: req.body.senderId,
            });
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                logger.warn("ChatController.createChat - User not found", {
                    userId: sessionUser.id,
                });
                return res.status(404).json({ message: "User not found" });
            }
            const { text, senderId, chatRoomId, type } = req.body
            const chatData: ICreateChat = { text, sender: senderId, chatRoom: chatRoomId, type }
            const chat = await this.chatRepository.createChat(chatData)
            this.io.to(chatRoomId).emit("receive_message", chat);
            logger.info("ChatController.createChat - Chat message created and sent", {
                chatId: chat._id,
                chatRoomId,
            });
            return res.status(200).json({ chat: "" })
        } catch (error) {
            logger.error("ChatController.createChat - Error creating chat message", {
                chatRoomId: req.body.chatRoomId,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            next(error)
        }
    }

}