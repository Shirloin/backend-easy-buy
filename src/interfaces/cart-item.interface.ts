import { IProduct } from "./product.interface";
import { IShop } from "./shop.interface";

export interface ICartItem {
    quantity: number
    product: IProduct
    shop: IShop
}