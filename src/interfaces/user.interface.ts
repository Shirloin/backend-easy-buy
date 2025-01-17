import { Document } from "mongoose";
import { IAddress } from "./address.interface";
import { ICart } from "./cart.interface";
import { IShop } from "./shop.interface";

export interface IUser extends Document {
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
  address: IAddress[]
}

export interface ICreateUser {
  username: string;
  email: string;
  password: string;
}
