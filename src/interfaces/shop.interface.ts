import { IProduct } from "./product.interface";
import ITransactionHeader from "./transaction-header.interface";
import { IUser } from "./user.interface";

export interface IShop {
  _id: string;
  name: string;
  description: string;
  bannerUrl: string;
  imageUrl: string;
  user: IUser;
  products: IProduct[];
  transactions: ITransactionHeader[]
}

export interface ICreateShop {
  name: string;
  description: string;
  bannerUrl: string;
  imageUrl: string;
  user: IUser;
}
