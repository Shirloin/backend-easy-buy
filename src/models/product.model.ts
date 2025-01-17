import { model, Schema } from "mongoose";
import { IProduct } from "../interfaces/product.interface";

const product_schema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  productVariants: [
    {
      type: Schema.Types.ObjectId,
      ref: "ProductVariant",
    },
  ],
  productCategory: {
    type: Schema.Types.ObjectId,
    ref: "ProductCategory",
  },
  shop: {
    type: Schema.Types.ObjectId,
    ref: "Shop",
  },
});

const Product = model<IProduct & Document>("Product", product_schema);
export default Product;
