import { model, Schema } from "mongoose";
import { ICartItem } from "../interfaces/cart-item.interface";

const cart_item_schema = new Schema({
    quantity: {
        type: Number,
        required: true
    },
    variant: {
        type: Schema.Types.ObjectId,
        ref: "ProductVariant"
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: "Cart"
    }
})

const CartItem = model<ICartItem & Document>("CartItem", cart_item_schema)
export default CartItem