import { IProductCategory } from "./product-category.interface";
import { IProductVariant } from "./product-variant.interface";
import { IShop } from "./shop.interface";

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  productVariants: IProductVariant[];
  productCategory: IProductCategory;
  shop: IShop;
}

export interface ICreateProduct {
  _id?: string
  name: string;
  description: string;
  category: string;
  shop: IShop;
}
