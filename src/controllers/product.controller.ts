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

      res.status(200).json({ product: newProduct, message: "Product inserted" });
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
      const { productId } = req.params
      const { product, productVariants, productImages }: {
        product: ICreateProduct, productVariants: ICreateProductVariant[], productImages: ICreateProductImage[]
      } = req.body
      let productCategory = await this.productCategoryRespository.getProductCategoryByName(product.category)
      if (!productCategory) {
        productCategory = await this.productCategoryRespository.createProductCategory(product.category)
      }

      const updatedProductVariants = await Promise.all(
        productVariants.map(async (variant: ICreateProductVariant) => {
          return await this.productRepository.updateProductVariant(productId, variant)
        })
      ) as IProductVariant[]
      const updatedProductImages = await Promise.all(
        productImages.map(async (image: ICreateProductImage) => {
          return await this.productRepository.updateProductImage(productId, image)
        })
      ) as IProductImage[]
      const updatedProduct = await this.productRepository.updateProduct(productId, product, updatedProductVariants, updatedProductImages, productCategory)
      res.status(200).json({ product: updatedProduct, message: "Product updated" })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  public deleteProduct = async (req: Request,
    res: Response,
    next: NextFunction) => {
    try {
      const { productId } = req.params
      const sessionUser = (req.session as any).user;
      const user = await this.userRepository.getUserById(sessionUser.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await this.productCategoryRespository.deleteProductFromCategory(productId)
      await this.shopRepository.deleteProductFromShop(productId)
      const deletedProduct = this.productRepository.deleteProduct(productId)
      res.status(200).json({ product: deletedProduct, message: "Product deleted" })
    } catch (error) {
      next(error)
    }
  }

  public latestProduct = async (req: Request,
    res: Response,
    next: NextFunction) => {
    try {
      const products = await this.productRepository.latestProduct()
      res.status(200).json({ products: products })
    } catch (error) {
      next(error)
    }
  }
}
