import { IProductCategory } from "./product-category.interface";
import { IProductImage } from "./product-image.interface";
import { IProductVariant } from "./product-variant.interface";
import { IShop } from "./shop.interface";

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  product_variants: IProductVariant[];
  product_images: IProductImage[];
  product_category: IProductCategory;
  shop: IShop;
}

export interface ICreateProduct {
  name: string;
  description: string;
  category: string;
  product_variants: IProductVariant[];
  product_images: IProductImage[];
  shop: IShop;
}
