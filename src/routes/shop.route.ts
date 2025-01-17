import { Router } from "express";
import { Routes } from "../interfaces/auth.interface";
import ShopController from "../controllers/shop.controller";
import { authMiddleware } from "../middleware";

class ShopRoute implements Routes {
  public router = Router();
  public shopController = new ShopController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get("/shop", authMiddleware, this.shopController.getUserShop);
    this.router.post("/shop", authMiddleware, this.shopController.createShop);
    this.router.get("/shop/:shopId/products", authMiddleware, this.shopController.getProductsByShop)
    this.router.get("/shop/products", authMiddleware, this.shopController.getMyShopProduct)
  }
}
export default ShopRoute;
