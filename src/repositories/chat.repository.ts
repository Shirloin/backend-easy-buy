import { Document } from "mongoose"
import { ICreateChatRoom } from "../interfaces/chat-room.interface"
import { IChat, ICreateChat } from "../interfaces/chat.interface"
import ChatRoom from "../models/chat-room.model"
import Chat from "../models/chat.model"
import logger from "../utils/logger"

export default class ChatRepository {
    static instance: ChatRepository
    private chat = Chat
    private chatRoom = ChatRoom

    constructor() {
        if (ChatRepository.instance) {
            throw new Error("Ue Chat Repository Get Instance")
        }
        ChatRepository.instance = this
    }
    static getInstance() {
        if (!ChatRepository.instance) {
            ChatRepository.instance = new ChatRepository()
        }
        return ChatRepository.instance
    }
    public async getAllUserChatRoom(userId: string) {
        return await this.chatRoom.find({ user: userId }).populate([
            { path: "user" },
            { path: "shop" }
        ])
    }
    public async getAllShopChatRoom(shopId: string) {
        return await this.chatRoom.find({ shop: shopId }).populate([
            { path: "user" },
            { path: "shop" }
        ])
    }
    public async createChatRoom(shopId: string, userId: string) {
        logger.info("ChatRepository.createChatRoom - Creating chat room", {
            shopId,
            userId,
        });
        const chatRoom = await this.chatRoom.create({ shop: shopId, user: userId })
        await chatRoom.populate([{ path: "user" }, { path: "shop" }])
        logger.info("ChatRepository.createChatRoom - Chat room created successfully", {
            chatRoomId: chatRoom._id,
        });
        return chatRoom
    }

    public async createChat(chat: ICreateChat) {
        logger.info("ChatRepository.createChat - Creating chat message", {
            chatRoomId: chat.chatRoom,
            senderId: chat.sender,
        });
        const newChat = await this.chat.create(chat)
        await newChat.populate({ path: "sender" })
        logger.info("ChatRepository.createChat - Chat message created successfully", {
            chatId: newChat._id,
        });
        return newChat
    }
    public async getChat(chatRoomId: string) {
        const chats = await this.chat.find({ chatRoom: chatRoomId }).populate({ path: "sender" }).exec();
        return chats
    }

    public async getRoom(userId: string, shopId: string) {
        return await this.chatRoom.findOne({ user: userId, shop: shopId }).populate([{ path: "user" }, { path: "shop" }])
    }
}