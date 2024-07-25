import { NextFunction, Request, Response } from "express";
import ShopRepository from "../repositories/shop.repository";
import UserRepository from "../repositories/user.repository";

class ShopController {
  public shop_repository = ShopRepository.getInstance();
  public user_repository = UserRepository.getInstance();
  public getShop = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id } = req.params;
      console.log(user_id);
      const shop = await this.user_repository.getShop(user_id);
      res.status(200).json({ shop });
    } catch (error) {
      next(error);
    }
  };
}

export default ShopController;
