import { IProductCategory } from "./product-category.interface";
import { IProductImage } from "./product-image.interface";
import { IProductVariant } from "./product-variant.interface";
import { IShop } from "./shop.interface";

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  productVariants: IProductVariant[];
  productImages: IProductImage[];
  productCategory: IProductCategory;
  shop: IShop;
}

export interface ICreateProduct {
  name: string;
  description: string;
  category: string;
  shop: IShop;
}
