import { ICart } from "./cart.interface";
import { IShop } from "./shop.interface";

export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  dob: Date;
  gender: string;
  imageUrl: string;
  phone: string;
  shop: IShop;
  carts: ICart[]
}

export interface ICreateUser {
  username: string;
  email: string;
  password: string;
}
