import { NextFunction, Request, Response } from "express";
import ProductRepository from "../repositories/product.repository";
import ShopRepository from "../repositories/shop.repository";
import UserRepository from "../repositories/user.repository";
import { ICreateProduct } from "../interfaces/product.interface";
import { ICreateProductVariant, IProductVariant } from "../interfaces/product-variant.interface";
import ProductCategoryRepository from "../repositories/product-category.repository";
import logger from "../utils/logger";

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
      logger.info("ProductController.createProduct - Starting product creation", {
        userId: (req.session as any).user?.id,
      });
      const sessionUser = (req.session as any).user;
      const user = await this.userRepository.getUserById(sessionUser.id);
      if (!user) {
        logger.warn("ProductController.createProduct - User not found", {
          userId: sessionUser.id,
        });
        return res.status(404).json({ message: "User not found" });
      }
      const { product, productVariants } = req.body;

      const productData: ICreateProduct = { ...product, shop: user.shop };
      const productVariantData: ICreateProductVariant[] = productVariants;

      logger.info("ProductController.createProduct - Creating product in repository", {
        productName: productData.name,
        variantCount: productVariantData.length,
      });

      const newProduct = await this.productRepository.createProduct(
        productData,
        productVariantData,
      );

      const shop = await this.shopRepository.getShopById(productData.shop._id);
      if (!shop) {
        logger.warn("ProductController.createProduct - Shop not found", {
          shopId: productData.shop._id,
        });
        return res.status(404).json({ message: "Shop Not Found" });
      }
      shop.products.push(newProduct);
      await shop.save();

      logger.info("ProductController.createProduct - Product created successfully", {
        productId: newProduct._id,
        productName: newProduct.name,
      });
      res.status(200).json({ product: newProduct, message: "Product inserted" });
    } catch (error) {
      logger.error("ProductController.createProduct - Error creating product", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      next(error);
    }
  };

  public updateProduct = async (req: Request,
    res: Response,
    next: NextFunction) => {

    try {
      logger.info("ProductController.updateProduct - Starting product update", {
        productId: req.params.id,
        userId: (req.session as any).user?.id,
      });
      const sessionUser = (req.session as any).user;
      const user = await this.userRepository.getUserById(sessionUser.id);
      if (!user) {
        logger.warn("ProductController.updateProduct - User not found", {
          userId: sessionUser.id,
        });
        return res.status(404).json({ message: "User not found" });
      }
      const { id } = req.params
      const { product, productVariants }: {
        product: ICreateProduct, productVariants: ICreateProductVariant[]
      } = req.body
      let productCategory = await this.productCategoryRespository.getProductCategoryByName(product.category)
      if (!productCategory) {
        logger.info("ProductController.updateProduct - Creating new product category", {
          categoryName: product.category,
        });
        productCategory = await this.productCategoryRespository.createProductCategory(product.category)
      }

      const updatedProductVariants = await Promise.all(
        productVariants.map(async (variant: ICreateProductVariant) => {
          return await this.productRepository.updateProductVariant(id, variant)
        })
      ) as IProductVariant[]
      const updatedProduct = await this.productRepository.updateProduct(id, product, updatedProductVariants, productCategory)
      logger.info("ProductController.updateProduct - Product updated successfully", {
        productId: id,
      });
      res.status(200).json({ product: updatedProduct, message: "Product updated" })
    } catch (error) {
      logger.error("ProductController.updateProduct - Error updating product", {
        productId: req.params.id,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      next(error)
    }
  }

  public deleteProduct = async (req: Request,
    res: Response,
    next: NextFunction) => {
    try {
      logger.info("ProductController.deleteProduct - Starting product deletion", {
        productId: req.params.id,
        userId: (req.session as any).user?.id,
      });
      const { id } = req.params
      const sessionUser = (req.session as any).user;
      const user = await this.userRepository.getUserById(sessionUser.id);
      if (!user) {
        logger.warn("ProductController.deleteProduct - User not found", {
          userId: sessionUser.id,
        });
        return res.status(404).json({ message: "User not found" });
      }
      await this.productCategoryRespository.deleteProductFromCategory(id)
      await this.shopRepository.deleteProductFromShop(id)
      const deletedProduct = this.productRepository.deleteProduct(id)
      logger.info("ProductController.deleteProduct - Product deleted successfully", {
        productId: id,
      });
      res.status(200).json({ product: deletedProduct, message: "Product deleted" })
    } catch (error) {
      logger.error("ProductController.deleteProduct - Error deleting product", {
        productId: req.params.id,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      next(error)
    }
  }

  public getLatestProduct = async (req: Request,
    res: Response,
    next: NextFunction) => {
    try {
      logger.info("ProductController.getLatestProduct - Fetching latest products");
      const products = await this.productRepository.getLatestProduct()
      logger.info("ProductController.getLatestProduct - Latest products fetched successfully", {
        count: products.length,
      });
      res.status(200).json({ products: products })
    } catch (error) {
      logger.error("ProductController.getLatestProduct - Error fetching latest products", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      next(error)
    }
  }

  public getProductDetail = async (req: Request,
    res: Response,
    next: NextFunction) => {
    try {
      logger.info("ProductController.getProductDetail - Fetching product detail", {
        productId: req.params.id,
      });
      const { id } = req.params
      const product = await this.productRepository.getProductDetail(id)
      logger.info("ProductController.getProductDetail - Product detail fetched successfully", {
        productId: id,
      });
      res.status(200).json({ product: product })
    } catch (error) {
      logger.error("ProductController.getProductDetail - Error fetching product detail", {
        productId: req.params.id,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      next(error)
    }
  }

  public searchProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("ProductController.searchProducts - Starting product search", {
        query: req.query.query,
      });
      const { query } = req.query;
      if (!query || typeof query !== 'string') {
        logger.warn("ProductController.searchProducts - Invalid search query", {
          query: req.query.query,
        });
        return res.status(400).json({ message: "Search query is required and must be a string" });
      }

      const products = await this.productRepository.searchProducts(query as string);

      logger.info("ProductController.searchProducts - Product search completed", {
        query: query,
        resultCount: products.length,
      });
      return res.status(200).json({ products });
    } catch (error) {
      logger.error("ProductController.searchProducts - Error searching products", {
        query: req.query.query,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      next(error);
    }
  }

  public getRelatedProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("ProductController.getRelatedProducts - Fetching related products", {
        categoryId: req.params.id,
      });
      const { id } = req.params
      const products = await this.productRepository.getRelatedProduct(id)

      logger.info("ProductController.getRelatedProducts - Related products fetched successfully", {
        categoryId: id,
        count: products.length,
      });
      return res.status(200).json({ products })
    } catch (error) {
      logger.error("ProductController.getRelatedProducts - Error fetching related products", {
        categoryId: req.params.id,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      next(error)
    }
  }

  public getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;

      logger.info("ProductController.getAllProducts - Fetching all products", {
        page,
        limit,
        search,
      });

      // Validate pagination parameters
      if (page < 1) {
        logger.warn("ProductController.getAllProducts - Invalid page number", { page });
        return res.status(400).json({ message: "Page must be greater than 0" });
      }
      if (limit < 1 || limit > 100) {
        logger.warn("ProductController.getAllProducts - Invalid limit", { limit });
        return res.status(400).json({ message: "Limit must be between 1 and 100" });
      }

      const result = await this.productRepository.getAllProducts(page, limit, search);

      logger.info("ProductController.getAllProducts - Products fetched successfully", {
        page,
        limit,
        total: result.pagination.total,
        returned: result.products.length,
      });
      return res.status(200).json({
        products: result.products,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error("ProductController.getAllProducts - Error fetching products", {
        page: req.query.page,
        limit: req.query.limit,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      next(error);
    }
  }
}
