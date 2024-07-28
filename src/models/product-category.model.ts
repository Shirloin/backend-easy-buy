import { model, Schema } from "mongoose";
import { IProductCategory } from "../interfaces/product-category.interface";

const product_cateogry_schema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const ProductCategory = model<IProductCategory & Document>(
  "ProductCategory",
  product_cateogry_schema
);
export default ProductCategory;
