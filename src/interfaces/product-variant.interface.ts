import { IProduct } from "./product.interface";
import { IReview } from "./review.interface";

export interface IProductVariant {
  _id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
  product: IProduct;
  reviews: IReview[]
}

export interface ICreateProductVariant {
  _id?: string
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
  product: IProduct;
}
