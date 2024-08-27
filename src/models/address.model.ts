import { model, Schema } from "mongoose";
import { IAddress } from "../interfaces/address.interface";

const address_schema: Schema = new Schema({
    receiverName: {
        type: String,
        required: true
    },
    receiverPhone: {
        type: String,
        required: true,
    },
    addressLabel: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

const Address = model<IAddress & Document>("Address", address_schema);
export default Address;
