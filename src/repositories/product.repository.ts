import {
  ICreateProductImage,
  IProductImage,
} from "../interfaces/product-image.interface";
import {
  ICreateProductVariant,
  IProductVariant,
} from "../interfaces/product-variant.interface";
import { ICreateProduct, IProduct } from "../interfaces/product.interface";
import ProductCategory from "../models/product-category.model";
import ProductImage from "../models/product-image.model";
import ProductVariant from "../models/product-variant.model";
import Product from "../models/product.model";
import Shop from "../models/shop.model";

export default class ProductRepository {
  static instance: ProductRepository;
  public shop = Shop;
  public product = Product;
  public productVariant = ProductVariant;
  public productImage = ProductImage;
  public productCategory = ProductCategory;

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
    productImageData: ICreateProductImage[]
  ): Promise<IProduct> {
    const newProduct = await this.product.create({
      ...productData,
    });

    const newProductVariants: IProductVariant[] =
      await this.productVariant.create(
        productVariantData.map((variant) => ({
          ...variant,
          product: newProduct._id,
        }))
      );
    const newProductImages: IProductImage[] = await this.productImage.create(
      productImageData.map((image) => ({
        ...image,
        product: newProduct._id,
      }))
    );
    newProduct.product_variants = newProductVariants;
    newProduct.product_images = newProductImages;
    await newProduct.save();

    return newProduct;
  }
}
