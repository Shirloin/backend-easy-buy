import { IProductCategory } from "../interfaces/product-category.interface";
import {
  ICreateProductVariant,
  IProductVariant,
} from "../interfaces/product-variant.interface";
import { ICreateProduct, IProduct } from "../interfaces/product.interface";
import CartItem from "../models/cart-item.model";
import Cart from "../models/cart.model";
import ProductCategory from "../models/product-category.model";
import ProductVariant from "../models/product-variant.model";
import Product from "../models/product.model";
import Shop from "../models/shop.model";
import logger from "../utils/logger";

export default class ProductRepository {
  static instance: ProductRepository;
  private shop = Shop;
  private product = Product;
  private productVariant = ProductVariant;
  private productCategory = ProductCategory;
  private cart = Cart
  private cartItem = CartItem

  constructor() {
    if (ProductRepository.instance) {
      throw new Error("Use Product Repository Get Instance Singleton");
    }
    ProductRepository.instance = this;
  }
  static getInstance() {
    if (!ProductRepository.instance) {
      ProductRepository.instance = new ProductRepository();
    }
    return ProductRepository.instance;
  }

  public async createProduct(
    productData: ICreateProduct,
    productVariantData: ICreateProductVariant[],
  ): Promise<IProduct> {
    logger.info("ProductRepository.createProduct - Creating product", {
      productName: productData.name,
      category: productData.category,
      variantCount: productVariantData.length,
    });
    let category = await this.productCategory.findOne({
      name: productData.category,
    });
    if (!category) {
      logger.info("ProductRepository.createProduct - Creating new category", {
        categoryName: productData.category,
      });
      category = await this.productCategory.create({
        name: productData.category,
      });
    }

    const newProduct = await this.product.create({
      ...productData,
      productCategory: category._id,
    });

    let newProductVariants: IProductVariant[] = [];

    if (productVariantData) {
      newProductVariants = await this.productVariant.create(
        productVariantData.map((variant) => ({
          ...variant,
          product: newProduct._id,
        }))
      );
    }
    newProduct.productVariants = newProductVariants;
    await newProduct.save();

    category.products.push(newProduct);
    await category.save();

    logger.info("ProductRepository.createProduct - Product created successfully", {
      productId: newProduct._id,
      productName: newProduct.name,
    });
    return newProduct;
  }

  public async getProductsByShop(shopId: string) {
    const products = await this.product.find({ shop: shopId })
      .populate([
        { path: 'productVariants' },
        { path: 'productCategory' }
      ])
      .exec();
    return products
  }

  public async updateProduct(productId: string, productData: ICreateProduct,
    productVariantData: IProductVariant[],
    productCategory: IProductCategory) {
    logger.info("ProductRepository.updateProduct - Updating product", {
      productId,
      productName: productData.name,
    });
    const product = await this.product.findOne({ _id: productId })
    if (!product) {
      logger.error("ProductRepository.updateProduct - Product not found", { productId });
      throw new Error("Product not found");
    }

    await this.productVariant.deleteMany({
      product: product.id,
      _id: { $nin: productVariantData }
    })
    product.name = productData.name
    product.description = productData.description
    product.productVariants = productVariantData
    product.productCategory = productCategory
    await product.save()

    logger.info("ProductRepository.updateProduct - Product updated successfully", {
      productId,
    });
    return product
  }

  public async updateProductVariant(productId: string, variant: ICreateProductVariant) {
    if (variant._id) {
      return await this.productVariant.findOneAndUpdate(
        { _id: variant._id },
        { ...variant, product: productId },
        { new: true }
      );
    }
    return await this.productVariant.create(
      { ...variant, product: productId }
    )
  }

  public async deleteProduct(productId: string) {
    logger.info("ProductRepository.deleteProduct - Deleting product", { productId });
    const productVariants = await this.productVariant.find({ product: productId })
    const variantIds = productVariants.map(variant => variant._id);
    const deletedCartItems = await this.cartItem.find({ variant: { $in: variantIds } });
    await this.cartItem.deleteMany({ variant: { $in: variantIds } });
    const deletedCartItemIds = deletedCartItems.map(item => item._id);
    await this.cart.updateMany(
      { items: { $in: deletedCartItemIds } },
      { $pull: { items: { $in: deletedCartItemIds } } }
    );
    await this.productVariant.deleteMany({ product: productId })
    const deletedProduct = await this.product.findOneAndDelete({ _id: productId })
    logger.info("ProductRepository.deleteProduct - Product deleted successfully", {
      productId,
      deletedVariants: variantIds.length,
      deletedCartItems: deletedCartItems.length,
    });
    return deletedProduct
  }

  public async getLatestProduct() {
    return await this.product.find()
      .populate([
        { path: 'productVariants' },
        { path: 'productCategory' },
        { path: 'shop' }
      ])
      .sort({ createdAt: -1 })
      .limit(100);
  }

  public async getProductDetail(productId: string) {
    return await this.product.findById(productId).populate([
      { path: 'productVariants' },
      { path: 'productCategory' },
      { path: 'shop' }
    ])
  }

  public async getProductVariantById(variantId: string) {
    return await this.productVariant.findById(variantId)
  }

  public async searchProducts(query: string) {
    const regex = new RegExp(query, "i")

    return await this.product.find({
      $or: [
        { name: { $regex: regex } },
        { "productVariants.name": { $regex: regex } },
        { "productCategory.name": { $regex: regex } },
        { "shop.name": { $regex: regex } },
      ]
    }).populate("productCategory")
      .populate("productVariants")
      .populate("shop")
      .exec();
  }

  public async getRelatedProduct(id: string) {
    return await this.product.find({ productCategory: id })
      .populate([
        { path: 'productVariants' },
        { path: 'shop' }
      ])
      .sort({ createdAt: -1 })
      .limit(10);
  }

  public async getAllProducts(page: number = 1, limit: number = 10, search?: string) {
    logger.info("ProductRepository.getAllProducts - Fetching products", {
      page,
      limit,
      search,
    });
    const skip = (page - 1) * limit;

    // Build search filter
    let filter: any = {};
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter = {
        $or: [
          { name: { $regex: regex } },
          { description: { $regex: regex } },
        ]
      };
    }

    // Get total count for pagination
    const total = await this.product.countDocuments(filter);

    // Get products with pagination
    const products = await this.product.find(filter)
      .populate([
        { path: 'productVariants' },
        { path: 'productCategory' },
        { path: 'shop' }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    logger.info("ProductRepository.getAllProducts - Products fetched successfully", {
      page,
      limit,
      total,
      returned: products.length,
    });
    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    };
  }
}
