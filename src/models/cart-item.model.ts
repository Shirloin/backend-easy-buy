import { model, Schema } from "mongoose";
import { ICartItem } from "../interfaces/cart-item.interface";

const cart_item_schema = new Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product"
    },
    shop: {
        type: Schema.Types.ObjectId,
        ref: "Shop"
    },
})

const CartItem = model<ICartItem & Document>("CartItem", cart_item_schema)
export default CartItem