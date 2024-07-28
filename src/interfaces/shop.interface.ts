import { IProduct } from "./product.interface";
import { IUser } from "./user.interface";

export interface IShop {
  _id: string;
  name: string;
  description: string;
  banner_url: string;
  image_url: string;
  user: IUser;
  products: IProduct[];
}

export interface ICreateShop {
  name: string;
  description: string;
  banner_url: string;
  image_url: string;
  user: IUser;
}
