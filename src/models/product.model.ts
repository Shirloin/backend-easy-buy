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
  product_variants: [
    {
      type: Schema.Types.ObjectId,
      ref: "ProductVariant",
    },
  ],
  product_images: [
    {
      type: Schema.Types.ObjectId,
      ref: "ProductImage",
    },
  ],
  product_category: {
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
