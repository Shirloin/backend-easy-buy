import { NextFunction, Request, Response } from "express";
import ShopRepository from "../repositories/shop.repository";
import UserRepository from "../repositories/user.repository";
import { ICreateShop, IShop } from "../interfaces/shop.interface";
import { IUser } from "../interfaces/user.interface";
import ProductRepository from "../repositories/product.repository";

class ShopController {
  public shopRepository = ShopRepository.getInstance();
  public userRepository = UserRepository.getInstance();
  public productRepository = ProductRepository.getInstance()

  public getUserShop = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = (req.session as any).user;
      const shop = await this.shopRepository.getUserShop(user._id);
      res.status(200).json({ shop: shop });
    } catch (error) {
      next(error);
    }
  };

  public createShop = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const sessionUser = (req.session as any).user;
      const user = await this.userRepository.getUserById(sessionUser.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const userId = user._id;
      const shopData: ICreateShop = { ...req.body, userId };
      const shop: IShop = await this.shopRepository.createShop(shopData);
      user.shop = shop;
      await user.save();
      return res
        .status(200)
        .json({ message: "Shop has been registered", shop: shop });
    } catch (error) {
      console.log(error)
      next(error);
    }
  };

  public getProductsByShop = async (req: Request,
    res: Response,
    next: NextFunction) => {

    const { shopId } = req.params
    const shop = await this.shopRepository.getShopById(shopId)

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    const sessionUser = (req.session as any).user;
    const user = await this.userRepository.getUserById(sessionUser.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    try {
      const products = await this.productRepository.getProductsByShop(shopId)
      res.status(200).json(products)
    } catch (error) {
      next(error)
    }
  }

  public getMyShopProduct = async (req: Request,
    res: Response,
    next: NextFunction) => {
    const sessionUser = (req.session as any).user;
    const user = await this.userRepository.getUserById(sessionUser.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const shopId = user.shop._id
    const shop = await this.shopRepository.getShopById(shopId)

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    try {
      const products = await this.productRepository.getProductsByShop(shopId)
      res.status(200).json({ "products": products })
    } catch (error) {
      next(error)
    }
  }
}

export default ShopController;
