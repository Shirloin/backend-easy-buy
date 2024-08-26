import mongoose from 'mongoose';
import bcrypt from "bcryptjs";
import { faker } from '@faker-js/faker';
import User from '../models/user.model';
import Shop from '../models/shop.model';
import Product from '../models/product.model';
import ProductVariant from '../models/product-variant.model';
import ProductCategory from '../models/product-category.model';
import { IProductCategory } from '../interfaces/product-category.interface';
import { dbConnection } from '../database';

// Function to create a product variant
const createProductVariant = async (productId: string) => {
    const productVariant = new ProductVariant({
        name: faker.commerce.productMaterial(),
        price: parseFloat(faker.commerce.price()),
        stock: faker.number.int({ min: 0, max: 100 }),
        imageUrl: faker.image.url(),
        product: productId,
    });
    await productVariant.save();
    return productVariant;
};

// Function to create a product with variants
const createProduct = async (shopId: string, categories: IProductCategory[]) => {
    const product = new Product({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        shop: shopId,
        productCategory: categories[Math.floor(Math.random() * categories.length)]._id,
        productVariants: [],
    });

    await product.save();

    // Create 3 variants for each product
    for (let i = 0; i < 3; i++) {
        const variant = await createProductVariant(product._id);
        product.productVariants.push(variant);
    }

    await product.save();

    // Assign product to a random category
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    randomCategory.products.push(product);
    await randomCategory.save();

    return product;
};

// Function to create a shop with products
const createShop = async (userId: string, categories: IProductCategory[]) => {
    const shop = new Shop({
        name: faker.company.name(),
        description: faker.company.catchPhrase(),
        bannerUrl: faker.image.url(),
        imageUrl: faker.image.avatar(),
        user: userId,
        products: [],
    });

    await shop.save();

    // Create 10 products for each shop
    for (let i = 0; i < 10; i++) {
        const product = await createProduct(shop._id, categories);
        shop.products.push(product);
    }

    await shop.save();

    return shop;
};

// Function to create a user with a shop
const createUser = async (username: string, categories: IProductCategory[]) => {
    const hashedPassword = await bcrypt.hash('cx', 10);

    const user = new User({
        username: username,
        email: faker.internet.email(),
        password: hashedPassword,
        dob: faker.date.past({ years: 30, refDate: new Date(2000, 0, 1) }),
        gender: faker.person.sex(),
        imageUrl: faker.image.avatar(),
        phone: faker.phone.number(),
    });

    const shop = await createShop(user._id, categories);
    user.shop = shop;

    await user.save();
    return user;
};

// Function to seed the database
const seedDatabase = async () => {
    try {
        await mongoose.connect(dbConnection.url);

        // Clear existing data
        await User.deleteMany({});
        await Shop.deleteMany({});
        await Product.deleteMany({});
        await ProductVariant.deleteMany({});
        await ProductCategory.deleteMany({});

        // Create categories
        const categories: IProductCategory[] = [];
        for (let i = 0; i < 10; i++) {
            const category = new ProductCategory({
                name: faker.commerce.department(),
                products: [],
            });
            await category.save();
            categories.push(category);
        }

        // Seed users with custom usernames
        const customUsernames = ["cx", "asdf"];
        for (const username of customUsernames) {
            await createUser(username, categories);
        }

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding the database:', error);
    } finally {
        await mongoose.disconnect();
    }
};

seedDatabase();
