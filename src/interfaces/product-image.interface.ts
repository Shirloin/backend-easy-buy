import { IProduct } from "./product.interface";

export interface IProductImage {
  _id: string;
  imageUrl: string;
  product: IProduct;
}

export interface ICreateProductImage {
  image_url: string;
  product: IProduct;
}
