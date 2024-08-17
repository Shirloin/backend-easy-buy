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
    let category = await this.productCategory.findOne({
      name: productData.category,
    });
    if (!category) {
      category = await this.productCategory.create({
        name: productData.category,
      });
    }

    const newProduct = await this.product.create({
      ...productData,
      product_category: category._id,
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

    let newProductImages: IProductImage[] = [];
    if (productImageData) {
      newProductImages = await this.productImage.create(
        productImageData.map((image) => ({
          ...image,
          product: newProduct._id,
        }))
      );
    }
    newProduct.productVariants = newProductVariants;
    newProduct.productImages = newProductImages;
    await newProduct.save();

    category.products.push(newProduct);
    await category.save();

    return newProduct;
  }

  public async getProductsByShop(shopId: string) {
    const products = await this.product.find({ shop: shopId })
      .populate([
        { path: 'productVariants' },
        { path: 'productImages' },
        { path: 'productCategory' }
      ])
      .exec();
    return products
  }
}
