import { Router } from "express";
import { Routes } from "../interfaces/auth.interface";
import ShopController from "../controllers/shop.controller";
import { authMiddleware } from "../middleware";

class ShopRoute implements Routes {
  public router = Router();
  public shop_controller = new ShopController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get("/shop", authMiddleware, this.shop_controller.getUserShop);
    this.router.post("/shop", authMiddleware, this.shop_controller.createShop);
  }
}
export default ShopRoute;
