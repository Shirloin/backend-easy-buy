import { model, Schema } from "mongoose";
import ITransactionDetail from "../interfaces/transaction-detail.interface";

const transaction_detail_schema: Schema = new Schema({
    quantity: {
        type: Number,
    },
    reviewStatus: {
        type: Boolean,
        default: false
    },
    transaction: {
        type: Schema.Types.ObjectId,
        ref: "TransactionHeader"
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
    },
    variant: {
        type: Schema.Types.ObjectId,
        ref: "ProductVariant",
    },
    review: {
        type: Schema.Types.ObjectId,
        ref: "Review"
    }
})
const TransactionDetail = model<ITransactionDetail & Document>("TransactionDetail", transaction_detail_schema)
export default TransactionDetail