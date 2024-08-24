import { IProductCategory } from "../interfaces/product-category.interface";
import {
  ICreateProductImage,
  IProductImage,
} from "../interfaces/product-image.interface";
import {
  ICreateProductVariant,
  IProductVariant,
} from "../interfaces/product-variant.interface";
import { ICreateProduct, IProduct } from "../interfaces/product.interface";
import CartItem from "../models/cart-item.model";
import Cart from "../models/cart.model";
import ProductCategory from "../models/product-category.model";
import ProductImage from "../models/product-image.model";
import ProductVariant from "../models/product-variant.model";
import Product from "../models/product.model";
import Shop from "../models/shop.model";

export default class ProductRepository {
  static instance: ProductRepository;
  private shop = Shop;
  private product = Product;
  private productVariant = ProductVariant;
  private productImage = ProductImage;
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

  public async updateProduct(productId: string, productData: ICreateProduct,
    productVariantData: IProductVariant[],
    productImageData: IProductImage[],
    productCategory: IProductCategory) {
    const product = await this.product.findOne({ _id: productId })
    if (!product) {
      throw new Error("Product not found");
    }

    await this.productVariant.deleteMany({
      product: product.id,
      _id: { $nin: productVariantData }
    })

    await this.productImage.deleteMany({
      product: product.id,
      _id: { $nin: productImageData }
    })

    product.name = productData.name
    product.description = productData.description
    product.productVariants = productVariantData
    product.productImages = productImageData
    product.productCategory = productCategory
    await product.save()

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

  public async updateProductImage(productId: string, image: ICreateProductImage) {
    if (image._id) {
      return await this.productImage.findOneAndUpdate(
        { _id: image._id },
        { ...image, product: productId },
        { new: true }
      );
    }
    return await this.productImage.create(
      { ...image, product: productId }
    )
  }

  public async deleteProduct(productId: string) {
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
    await this.productImage.deleteMany({ product: productId })
    return await this.product.findOneAndDelete({ _id: productId })
  }

  public async getLatestProduct() {
    return await this.product.find()
      .populate([
        { path: 'productVariants' },
        { path: 'productImages' },
        { path: 'productCategory' },
        { path: 'shop' }
      ])
      .sort({ createdAt: -1 })
      .limit(10);
  }

  public async getProductDetail(productId: string) {
    return await this.product.findById(productId).populate([
      { path: 'productVariants' },
      { path: 'productImages' },
      { path: 'productCategory' },
      { path: 'shop' }
    ])
  }

  public async getProductVariantById(variantId: string) {
    return await this.productVariant.findById(variantId)
  }
}
