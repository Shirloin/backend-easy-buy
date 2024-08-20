import { Router } from "express";
import { Routes } from "../interfaces/auth.interface";
import ProductController from "../controllers/product.controller";
import { authMiddleware } from "../middleware";

export default class ProductRoute implements Routes {
  public router = Router();
  public productController = new ProductController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/product",
      authMiddleware,
      this.productController.createProduct
    );
    this.router.put(
      "/product/:productId",
      authMiddleware,
      this.productController.updateProduct
    )
    this.router.delete("/product/:productId", authMiddleware, this.productController.deleteProduct)
    this.router.get("/product/latest-product", this.productController.latestProduct)
  }
}
