import { model, Schema } from "mongoose";
import ITransactionDetail from "../interfaces/transaction-detail.interface";

const transaction_detail_schema: Schema = new Schema({
    quantity: {
        type: Number,
    },
    transactionHeader: {
        type: Schema.Types.ObjectId,
        ref: "TransactionHeader"
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
    },
    productVariant: {
        type: Schema.Types.ObjectId,
        ref: "ProductVariant",
    },
})
const TransactionDetail = model<ITransactionDetail & Document>("TransactionDetail", transaction_detail_schema)
export default TransactionDetail