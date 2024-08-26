import { model, Schema } from "mongoose";
import { IProductVariant } from "../interfaces/product-variant.interface";

const product_variant_schema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
});

const ProductVariant = model<IProductVariant & Document>(
  "ProductVariant",
  product_variant_schema
);
export default ProductVariant;
