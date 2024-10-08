import { model, Schema, Types } from "mongoose";
import { IChat } from "../interfaces/chat.interface";

const chat_schema: Schema = new Schema({
    text: {
        type: String,
    },
    sender: {
        type: Schema.Types.ObjectId,
        refPath: "type"
    },
    type: {
        type: String,
        enum: ["User", "Shop"]
    },
    chatRoom: {
        type: Schema.Types.ObjectId,
        ref: "ChatRoom"
    },
}, { timestamps: true })

const Chat = model<IChat & Document>("Chat", chat_schema)
export default Chat