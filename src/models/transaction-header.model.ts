import { Schema } from "mongoose";

const transacion_header_schema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    shop: {
        type: Schema.Types.ObjectId,
        ref: "Shop",
    },
    date: {
        type: Date
    }
})