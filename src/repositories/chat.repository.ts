import { ICreateChatRoom } from "../interfaces/chat-room.interface"
import { ICreateChat } from "../interfaces/chat.interface"
import ChatRoom from "../models/chat-room.model"
import Chat from "../models/chat.model"

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

    public async getChatRoomByUser(userId: string) {
        return await this.chatRoom.findOne({ user: userId })
    }
    public async getChatRoomByShop(shopId: string) {
        return await this.chatRoom.findOne({ shop: shopId })
    }
    public async getAllUserChatRoom(userId: string) {
        return await this.chatRoom.find({ user: userId })
    }
    public async getAllShopChatRoom(shopId: string) {
        return await this.chatRoom.find({ shop: shopId })
    }
    public async createChatRoom(chatRoom: ICreateChatRoom) {
        return await this.chatRoom.create(chatRoom)
    }

    public async createChat(chat: ICreateChat) {
        return await this.chat.create(chat)
    }
    public async getChatByRoom(chatRoomId: string) {
        return await this.chat.find({ chatRoom: chatRoomId })
    }
}