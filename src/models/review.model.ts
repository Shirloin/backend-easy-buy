import { Document, model, Schema } from "mongoose";
import { IReview } from "../interfaces/review.interface";
import { timeStamp } from "console";

const review_schema: Schema = new Schema({
    rating: {
        type: Number,
        required: true,
    },
    text: {
        type: String,
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product"
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
}, { timestamps: true })

const Review = model<IReview & Document>("Review", review_schema)
export default Review