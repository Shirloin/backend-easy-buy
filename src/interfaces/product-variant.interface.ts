import { IProduct } from "./product.interface";

export interface IProductVariant {
  _id: string;
  name: string;
  price: DoubleRange;
  stock: DoubleRange;
  product: IProduct;
}

export interface ICreateProductVariant {
  name: string;
  price: DoubleRange;
  stock: DoubleRange;
  product: IProduct;
}
