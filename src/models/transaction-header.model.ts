import { Document, model, Schema } from "mongoose";
import ITransactionHeader from "../interfaces/transaction-header.interface";

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

const TransactionHeader = model<ITransactionHeader & Document>("TransactionHeader", transacion_header_schema)
export default TransactionHeader