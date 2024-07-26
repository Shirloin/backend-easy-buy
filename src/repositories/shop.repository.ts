import { ICreateShop, IShop } from "../interfaces/shop.interface";
import Shop from "../models/shop.model";
import User from "../models/user.model";

class ShopRepository {
  static instance: ShopRepository;
  public shop = Shop;
  public user = User;

  constructor() {
    if (ShopRepository.instance) {
      throw new Error("Use Shop Repository Get Instance Singleton");
    }
    ShopRepository.instance = this;
  }

  static getInstance() {
    if (!ShopRepository.instance) {
      ShopRepository.instance = new ShopRepository();
    }
    return ShopRepository.instance;
  }

  public async createShop(shopData: ICreateShop): Promise<IShop> {
    const newShop: IShop = await this.shop.create({
      ...shopData,
    });
    return newShop;
  }
}
export default ShopRepository;
