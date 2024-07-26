import { NextFunction, Request, Response } from "express";
import ShopRepository from "../repositories/shop.repository";
import UserRepository from "../repositories/user.repository";
import { ICreateShop, IShop } from "../interfaces/shop.interface";

class ShopController {
  public shop_repository = ShopRepository.getInstance();
  public user_repository = UserRepository.getInstance();

  public getUserShop = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = (req.session as any).user;
      const shop = await this.user_repository.getShop(user._id);
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
      const user = await this.user_repository.getUserById(sessionUser._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const shopData: ICreateShop = { ...req.body, user };
      const shop: IShop = await this.shop_repository.createShop(shopData);
      return res
        .status(200)
        .json({ message: "Shop has been registered", shop: shop });
    } catch (error) {
      next(error);
    }
  };
}

export default ShopController;
