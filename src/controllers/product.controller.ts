import { NextFunction, Request, Response } from "express";
import ProductRepository from "../repositories/product.repository";
import ShopRepository from "../repositories/shop.repository";
import UserRepository from "../repositories/user.repository";
import { ICreateProduct } from "../interfaces/product.interface";
import { ICreateProductVariant, IProductVariant } from "../interfaces/product-variant.interface";
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
      const { product, productVariants } = req.body;

      const productData: ICreateProduct = { ...product, shop: user.shop };
      const productVariantData: ICreateProductVariant[] = productVariants;

      const newProduct = await this.productRepository.createProduct(
        productData,
        productVariantData,
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
      const { id } = req.params
      const { product, productVariants }: {
        product: ICreateProduct, productVariants: ICreateProductVariant[]
      } = req.body
      let productCategory = await this.productCategoryRespository.getProductCategoryByName(product.category)
      if (!productCategory) {
        productCategory = await this.productCategoryRespository.createProductCategory(product.category)
      }

      const updatedProductVariants = await Promise.all(
        productVariants.map(async (variant: ICreateProductVariant) => {
          return await this.productRepository.updateProductVariant(id, variant)
        })
      ) as IProductVariant[]
      const updatedProduct = await this.productRepository.updateProduct(id, product, updatedProductVariants, productCategory)
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
      const { id } = req.params
      const sessionUser = (req.session as any).user;
      const user = await this.userRepository.getUserById(sessionUser.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await this.productCategoryRespository.deleteProductFromCategory(id)
      await this.shopRepository.deleteProductFromShop(id)
      const deletedProduct = this.productRepository.deleteProduct(id)
      res.status(200).json({ product: deletedProduct, message: "Product deleted" })
    } catch (error) {
      next(error)
    }
  }

  public getLatestProduct = async (req: Request,
    res: Response,
    next: NextFunction) => {
    try {
      const products = await this.productRepository.getLatestProduct()
      res.status(200).json({ products: products })
    } catch (error) {
      next(error)
    }
  }

  public getProductDetail = async (req: Request,
    res: Response,
    next: NextFunction) => {
    try {
      const { id } = req.params
      const product = await this.productRepository.getProductDetail(id)
      res.status(200).json({ product: product })
    } catch (error) {
      next(error)
    }
  }

  public searchProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { query } = req.query;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: "Search query is required and must be a string" });
      }


      const products = await this.productRepository.searchProducts(query as string);

      return res.status(200).json({ products });
    } catch (error) {
      next(error);
    }
  }

  public getRelatedProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const products = await this.productRepository.getRelatedProduct(id)

      return res.status(200).json({ products })
    } catch (error) {
      next(error)
    }
  }

  public getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;

      // Validate pagination parameters
      if (page < 1) {
        return res.status(400).json({ message: "Page must be greater than 0" });
      }
      if (limit < 1 || limit > 100) {
        return res.status(400).json({ message: "Limit must be between 1 and 100" });
      }

      const result = await this.productRepository.getAllProducts(page, limit, search);

      return res.status(200).json({
        products: result.products,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }
}
