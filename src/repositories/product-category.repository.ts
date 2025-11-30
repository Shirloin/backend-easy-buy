import { IProductCategory } from "../interfaces/product-category.interface";
import ProductCategory from "../models/product-category.model";
import logger from "../utils/logger";

export default class ProductCategoryRepository {
    static instance: ProductCategoryRepository
    public productCategory = ProductCategory

    constructor() {
        if (ProductCategoryRepository.instance) {
            throw new Error("Use Product Repository Get Instance Singleton");
        }
        ProductCategoryRepository.instance = this;
    }
    static getInstance() {
        if (!ProductCategoryRepository.instance) {
            ProductCategoryRepository.instance = new ProductCategoryRepository();
        }
        return ProductCategoryRepository.instance;
    }

    public async getProductCategoryByName(category: string) {
        return await this.productCategory.findOne({ name: category })
    }
    public async createProductCategory(name: string) {
        logger.info("ProductCategoryRepository.createProductCategory - Creating product category", { name });
        const category = await this.productCategory.create({
            name: name,
        });
        logger.info("ProductCategoryRepository.createProductCategory - Product category created successfully", {
            categoryId: category._id,
            name,
        });
        return category
    }
    public async deleteProductFromCategory(productId: string) {
        logger.info("ProductCategoryRepository.deleteProductFromCategory - Removing product from category", { productId });
        const result = await this.productCategory.updateMany(
            { products: productId },
            { $pull: { products: productId } }
        );
        logger.info("ProductCategoryRepository.deleteProductFromCategory - Product removed from categories", {
            productId,
            modified: result.modifiedCount,
        });
        return result
    }
}