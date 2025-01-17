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

  public async getUserShop(userId: string) {
    const user = await this.user.findById(userId).populate("shop");
    return user?.shop;
  }

  public async createShop(shopData: ICreateShop): Promise<IShop> {
    const newShop: IShop = await this.shop.create({
      ...shopData,
    });
    return newShop;
  }

  public async getShopById(shopId: string) {
    const shop = await this.shop.findById(shopId).populate("products");
    return shop;
  }

  public async deleteProductFromShop(productId: string) {
    return await this.shop.updateMany(
      { products: productId },
      { $pull: { products: productId } }
    );
  }


}
export default ShopRepository;
