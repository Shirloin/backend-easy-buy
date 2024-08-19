import { IProduct } from "./product.interface";

export interface IProductImage {
  _id: string;
  imageUrl: string;
  product: IProduct;
}

export interface ICreateProductImage {
  _id?: string
  image_url: string;
  product: IProduct;
}
