import { NextFunction, Request, Response } from "express";
import ShopRepository from "../repositories/shop.repository";
import UserRepository from "../repositories/user.repository";
import { ICreateShop, IShop } from "../interfaces/shop.interface";
import { IUser } from "../interfaces/user.interface";

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
      console.log(user);
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
      console.log(req.session as any);
      const user = await this.user_repository.getUserById(sessionUser.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const user_id = user._id;
      const shopData: ICreateShop = { ...req.body, user_id };
      const shop: IShop = await this.shop_repository.createShop(shopData);
      user.shop = shop;
      await user.save();
      return res
        .status(200)
        .json({ message: "Shop has been registered", shop: shop });
    } catch (error) {
      next(error);
    }
  };
}

export default ShopController;
