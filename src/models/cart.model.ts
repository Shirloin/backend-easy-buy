import { model, Schema } from "mongoose";
import { ICart } from "../interfaces/cart.interface";

const cart_schema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    items: [
        {
            type: Schema.Types.ObjectId,
            ref: "CartItem"
        }
    ]
})

const Cart = model<ICart & Document>("Cart", cart_schema)
export default Cart