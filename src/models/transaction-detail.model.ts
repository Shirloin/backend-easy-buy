import { Schema } from "mongoose";

const transaction_detail_schema: Schema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
    },
    productVariant: {
        type: Schema.Types.ObjectId,
        ref: "ProductVariant",
    }
})