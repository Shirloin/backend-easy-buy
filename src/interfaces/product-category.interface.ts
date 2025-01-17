import { Document } from "mongoose";
import { IProduct } from "./product.interface";

export interface IProductCategory extends Document {
  _id: string;
  name: string;
  products: IProduct[];
}

export interface ICreateProductCategory {
  name: string;
  product: IProduct;
}
