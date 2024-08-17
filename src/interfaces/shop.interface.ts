import { IProduct } from "./product.interface";
import { IUser } from "./user.interface";

export interface IShop {
  _id: string;
  name: string;
  description: string;
  bannerUrl: string;
  imageUrl: string;
  user: IUser;
  products: IProduct[];
}

export interface ICreateShop {
  name: string;
  description: string;
  bannerUrl: string;
  imageUrl: string;
  user: IUser;
}
