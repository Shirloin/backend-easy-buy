import { IProductCategory } from "../interfaces/product-category.interface";
import ProductCategory from "../models/product-category.model";

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
        return await this.productCategory.create({
            name: name,
        });
    }
}