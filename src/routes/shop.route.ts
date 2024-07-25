import { Router } from "express";
import { Routes } from "../interfaces/auth.interface";
import ShopController from "../controllers/shop.controller";
import { validate_token } from "../middleware";

class ShopRoute implements Routes {
  public router = Router();
  public shop_controller = new ShopController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get("/shop", validate_token, this.shop_controller.getShop);
  }
}
export default ShopRoute;
