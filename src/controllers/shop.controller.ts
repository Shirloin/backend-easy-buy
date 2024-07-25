import { NextFunction, Request, Response } from "express";
import ShopRepository from "../repositories/shop.repository";
import UserRepository from "../repositories/user.repository";

class ShopController {
  public shop_repository = ShopRepository.getInstance();
  public user_repository = UserRepository.getInstance();

  public createShop = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
    } catch (error) {}
  };

  public getShop = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req.session as any).user;
      console.log(user);
      const shop = await this.user_repository.getShop(user._id);
      res.status(200).json({ shop: shop });
    } catch (error) {
      next(error);
    }
  };
}

export default ShopController;
