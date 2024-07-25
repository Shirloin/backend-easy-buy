import { NextFunction, Request, Response } from "express";
import ShopRepository from "../repositories/shop.repository";
import UserRepository from "../repositories/user.repository";

class ShopController {
  public shop_repository = ShopRepository.getInstance();
  public user_repository = UserRepository.getInstance();
  public getShop = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log(req);
      // const user = req.session.user;
      // if (!user) {
      //   return res.status(401).send({ message: "Unauthorized" });
      // }
      // const shop = await this.user_repository.getShop(user._id);
      // res.status(200).json({ shop });
    } catch (error) {
      next(error);
    }
  };
}

export default ShopController;
