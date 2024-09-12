import { Document, model, Schema } from "mongoose";
import { IReview } from "../interfaces/review.interface";

const review_schema: Schema = new Schema({
    rating: {
        type: Number,
        required: true,
    },
    text: {
        type: String,
        required: true
    },
    productVariant: {
        type: Schema.Types.ObjectId,
        ref: "ProductVariant",
    },
    transactionDetail: {
        type: Schema.Types.ObjectId,
        ref: "TrasactionDetail",
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
})

const Review = model<IReview & Document>("Review", review_schema)
export default Review