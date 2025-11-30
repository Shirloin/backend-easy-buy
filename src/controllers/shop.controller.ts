import { NextFunction, Request, Response } from "express";
import ShopRepository from "../repositories/shop.repository";
import UserRepository from "../repositories/user.repository";
import { ICreateShop, IShop } from "../interfaces/shop.interface";
import { IUser } from "../interfaces/user.interface";
import ProductRepository from "../repositories/product.repository";
import logger from "../utils/logger";

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
      logger.info("ShopController.getUserShop - Fetching user shop", {
        userId: (req.session as any).user?._id,
      });
      const user = (req.session as any).user;
      const shop = await this.shopRepository.getUserShop(user._id);
      logger.info("ShopController.getUserShop - User shop fetched successfully", {
        userId: user._id,
        shopId: shop?._id,
      });
      res.status(200).json({ shop: shop });
    } catch (error) {
      logger.error("ShopController.getUserShop - Error fetching user shop", {
        userId: (req.session as any).user?._id,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      next(error);
    }
  };

  public createShop = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      logger.info("ShopController.createShop - Creating shop", {
        userId: (req.session as any).user?.id,
        shopName: req.body.name,
      });
      const sessionUser = (req.session as any).user;
      const user = await this.userRepository.getUserById(sessionUser.id);
      if (!user) {
        logger.warn("ShopController.createShop - User not found", {
          userId: sessionUser.id,
        });
        return res.status(404).json({ message: "User not found" });
      }
      const userId = user._id;
      const shopData: ICreateShop = { ...req.body, userId };
      const shop: IShop = await this.shopRepository.createShop(shopData);
      user.shop = shop;
      await user.save();
      logger.info("ShopController.createShop - Shop created successfully", {
        shopId: shop._id,
        shopName: shop.name,
        userId,
      });
      return res
        .status(200)
        .json({ message: "Shop has been registered", shop: shop });
    } catch (error) {
      logger.error("ShopController.createShop - Error creating shop", {
        userId: (req.session as any).user?.id,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      next(error);
    }
  };

  public getProductsByShop = async (req: Request,
    res: Response,
    next: NextFunction) => {
    try {
      logger.info("ShopController.getProductsByShop - Fetching products by shop", {
        shopId: req.params.shopId,
        userId: (req.session as any).user?.id,
      });
      const { shopId } = req.params
      const shop = await this.shopRepository.getShopById(shopId)

      if (!shop) {
        logger.warn("ShopController.getProductsByShop - Shop not found", {
          shopId,
        });
        return res.status(404).json({ message: "Shop not found" });
      }
      const sessionUser = (req.session as any).user;
      const user = await this.userRepository.getUserById(sessionUser.id);
      if (!user) {
        logger.warn("ShopController.getProductsByShop - User not found", {
          userId: sessionUser.id,
        });
        return res.status(404).json({ message: "User not found" });
      }
      const products = await this.productRepository.getProductsByShop(shopId)
      logger.info("ShopController.getProductsByShop - Products fetched successfully", {
        shopId,
        productCount: products.length,
      });
      res.status(200).json(products)
    } catch (error) {
      logger.error("ShopController.getProductsByShop - Error fetching products", {
        shopId: req.params.shopId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      next(error)
    }
  }

  public getMyShopProduct = async (req: Request,
    res: Response,
    next: NextFunction) => {
    try {
      logger.info("ShopController.getMyShopProduct - Fetching my shop products", {
        userId: (req.session as any).user?.id,
      });
      const sessionUser = (req.session as any).user;
      const user = await this.userRepository.getUserById(sessionUser.id);
      if (!user) {
        logger.warn("ShopController.getMyShopProduct - User not found", {
          userId: sessionUser.id,
        });
        return res.status(404).json({ message: "User not found" });
      }
      if (!user.shop || !user.shop._id) {
        logger.warn("ShopController.getMyShopProduct - Shop not found for user", {
          userId: user._id,
        });
        return res.status(404).json({ message: "Shop not found" });
      }
      const shopId = user.shop._id;
      const shop = await this.shopRepository.getShopById(shopId);

      if (!shop) {
        logger.warn("ShopController.getMyShopProduct - Shop not found", {
          shopId,
        });
        return res.status(404).json({ message: "Shop not found" });
      }
      const products = await this.productRepository.getProductsByShop(shopId)
      logger.info("ShopController.getMyShopProduct - Shop products fetched successfully", {
        shopId,
        productCount: products.length,
      });
      res.status(200).json({ "products": products })
    } catch (error) {
      logger.error("ShopController.getMyShopProduct - Error fetching shop products", {
        userId: (req.session as any).user?.id,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      next(error)
    }
  }
}

export default ShopController;
