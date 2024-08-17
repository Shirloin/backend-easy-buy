import { model, Schema } from "mongoose";
import { IProductVariant } from "../interfaces/product-variant.interface";
import { IProductImage } from "../interfaces/product-image.interface";

const product_image_schema: Schema = new Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
});

const ProductImage = model<IProductImage & Document>(
  "ProductImage",
  product_image_schema
);
export default ProductImage;
