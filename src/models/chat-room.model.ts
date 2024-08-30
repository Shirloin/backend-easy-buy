import { model, Schema } from "mongoose";
import { IChatRoom } from "../interfaces/chat-room.interface";

const chat_room_schema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    shop: {
        type: Schema.Types.ObjectId,
        ref: "Shop"
    },
    chats: [{
        type: Schema.Types.ObjectId,
        ref: "Chat",
    }],
})

const ChatRoom = model<IChatRoom & Document>("ChatRoom", chat_room_schema)
export default ChatRoom