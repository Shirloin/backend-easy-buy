import { NextFunction, Request, Response } from "express";
import ProductRepository from "../repositories/product.repository";
import ShopRepository from "../repositories/shop.repository";
import UserRepository from "../repositories/user.repository";
import { ICreateProduct } from "../interfaces/product.interface";
import { ICreateProductVariant, IProductVariant } from "../interfaces/product-variant.interface";
import { ICreateProductImage, IProductImage } from "../interfaces/product-image.interface";
import ProductCategoryRepository from "../repositories/product-category.repository";

export default class ProductController {
  public productRepository = ProductRepository.getInstance();
  public shopRepository = ShopRepository.getInstance();
  public userRepository = UserRepository.getInstance();
  public productCategoryRespository = ProductCategoryRepository.getInstance()

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

    try {
      const sessionUser = (req.session as any).user;
      const user = await this.userRepository.getUserById(sessionUser.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { product, productVariants, productImages } = req.body
      const productData: ICreateProduct = { ...product, category: product.productCategory.name };
      const productVariantData: ICreateProductVariant[] = productVariants;
      const productImageData: ICreateProductImage[] = productImages;
      let productCategory = await this.productCategoryRespository.getProductCategoryByName(productData.category)
      if (!productCategory) {
        productCategory = await this.productCategoryRespository.createProductCategory(productData.category)
      }

      const updatedProductVariants = await Promise.all(
        productVariantData.map(async (variant: ICreateProductVariant) => {
          return await this.productRepository.updateProductVariant(productData, variant)
        })
      ) as IProductVariant[]
      const updatedProductImages = await Promise.all(
        productImageData.map(async (image: ICreateProductImage) => {
          return await this.productRepository.updateProductImage(productData, image)
        })
      ) as IProductImage[]
      const updatedProduct = await this.productRepository.updateProduct(productData, updatedProductVariants, updatedProductImages, productCategory)
      res.status(200).json(updatedProduct)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}
