import { IProduct } from "./product.interface";

export interface IProductVariant {
  _id: string;
  name: string;
  price: number;
  stock: number;
  product: IProduct;
}

export interface ICreateProductVariant {
  _id?: string
  name: string;
  price: number;
  stock: number;
  product: IProduct;
}
