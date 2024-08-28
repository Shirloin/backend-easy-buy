import { Document, model, Schema } from "mongoose";
import ITransactionHeader from "../interfaces/transaction-header.interface";

const transaction_header_schema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    shop: {
        type: Schema.Types.ObjectId,
        ref: "Shop",
    },
    date: {
        type: Date,
        default: Date.now,
    },
    address: {
        receiverName: {
            type: String
        },
        receiverPhone: {
            type: String
        },
        addressLabel: {
            type: String
        },
        street: {
            type: String
        }
    },
    transactionDetails: [
        {
            type: Schema.Types.ObjectId,
            ref: "TransactionDetail",
        }
    ]
})

const TransactionHeader = model<ITransactionHeader & Document>("TransactionHeader", transaction_header_schema)
export default TransactionHeader