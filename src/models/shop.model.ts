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
  banner_url: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Shop = model<IShop & Document>("Shop", shop_schema);
export default Shop;
