import { NextFunction, Request, Response } from "express";
import ProductRepository from "../repositories/product.repository";
import ShopRepository from "../repositories/shop.repository";
import UserRepository from "../repositories/user.repository";
import { ICreateProduct } from "../interfaces/product.interface";
import { ICreateProductVariant } from "../interfaces/product-variant.interface";
import { ICreateProductImage } from "../interfaces/product-image.interface";

export default class ProductController {
  public productRepository = ProductRepository.getInstance();
  public shopRepository = ShopRepository.getInstance();
  public userRepository = UserRepository.getInstance();

  public createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const sessionUser = (req.session as any).user;
      const user = await this.userRepository.getUserById(sessionUser.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { product, productVariants, productImages } = req.body;

      const productData: ICreateProduct = { ...product, shop: user.shop };
      const productVariantData: ICreateProductVariant[] = productVariants;
      const productImageData: ICreateProductImage[] = productImages;

      const newProduct = await this.productRepository.createProduct(
        productData,
        productVariantData,
        productImageData
      );

      const shop = await this.shopRepository.getShopById(productData.shop._id);
      if (!shop) {
        return res.status(404).json({ message: "Shop Not Found" });
      }
      shop.products.push(newProduct);
      await shop.save();

      res.status(200).json(newProduct);
    } catch (error) {
      next(error);
    }
  };

  public updateProduct = async (req: Request,
    res: Response,
    next: NextFunction) => {
    const sessionUser = (req.session as any).user;
    const user = await this.userRepository.getUserById(sessionUser.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { product } = req.body
    const productCategory = product.productCategory
    const productVariants = product.productVariants
    const productImages = product.productImages
    console.log(productVariants)

    try {

    } catch (error) {

    }
    res.status(200).json(product)
  }
}
