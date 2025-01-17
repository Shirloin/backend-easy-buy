import { model, Schema } from "mongoose";
import User from "./user.model";
import { IShop } from "../interfaces/shop.interface";

const shop_schema: Schema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  bannerUrl: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  transactions: [
    {
      type: Schema.Types.ObjectId,
      ref: "TransactionHeader",
    },
  ]
});

const Shop = model<IShop & Document>("Shop", shop_schema);
export default Shop;
