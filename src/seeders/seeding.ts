import mongoose from 'mongoose';
import bcrypt from "bcryptjs";
import { faker } from '@faker-js/faker';
import User from '../models/user.model';
import Shop from '../models/shop.model';
import Product from '../models/product.model';
import ProductVariant from '../models/product-variant.model';
import ProductCategory from '../models/product-category.model';
import Review from '../models/review.model';
import Address from '../models/address.model';
import { IProductCategory } from '../interfaces/product-category.interface';
import { IProduct } from '../interfaces/product.interface';
import { IUser } from '../interfaces/user.interface';
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
    const variants = [];
    for (let i = 0; i < 3; i++) {
        const variant = await createProductVariant(product._id);
        product.productVariants.push(variant);
        variants.push(variant);
    }

    await product.save();

    // Assign product to a random category
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    randomCategory.products.push(product);
    await randomCategory.save();

    return { product, variants };
};

// Function to create a review
const createReview = async (productId: string, productVariantId: string, userId: string) => {
    const review = new Review({
        rating: faker.number.int({ min: 1, max: 5 }),
        text: faker.lorem.paragraph(),
        product: productId,
        productVariant: productVariantId,
        creator: userId,
    });
    await review.save();
    return review;
};

// Function to create an address
const createAddress = async (userId: string) => {
    const address = new Address({
        receiverName: faker.person.fullName(),
        receiverPhone: faker.phone.number(),
        addressLabel: faker.helpers.arrayElement(['Home', 'Office', 'Other']),
        street: faker.location.streetAddress({ useFullAddress: true }),
        user: userId,
    });
    await address.save();
    return address;
};

// Function to create a shop with products (without reviews)
const createShop = async (userId: string, categories: IProductCategory[]) => {
    const shop = new Shop({
        name: faker.company.name(),
        description: faker.company.catchPhrase(),
        bannerUrl: faker.image.url(),
        imageUrl: faker.image.url(),
        user: userId,
        products: [],
    });

    await shop.save();

    // Create 10 products for each shop
    const productsWithVariants = [];
    for (let i = 0; i < 10; i++) {
        const { product, variants } = await createProduct(shop._id, categories);
        shop.products.push(product);
        productsWithVariants.push({ product, variants });
    }

    await shop.save();

    return { shop, productsWithVariants };
};

// Function to create a user (without shop)
const createUser = async (username: string, password: string = 'cx') => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username: username,
        email: faker.internet.email(),
        password: hashedPassword,
        dob: faker.date.past({ years: 30, refDate: new Date(2000, 0, 1) }),
        gender: faker.person.sex(),
        imageUrl: faker.image.url(),
        phone: faker.phone.number(),
        address: [],
    });

    await user.save();

    // Create 1-3 addresses for each user
    const addressCount = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < addressCount; i++) {
        const address = await createAddress(user._id);
        user.address.push(address);
    }

    await user.save();
    return user;
};

// Function to seed the database
const seedDatabase = async () => {
    try {
        await mongoose.connect(dbConnection.url);

        console.log('Clearing existing data...');
        // Clear existing data
        await Review.deleteMany({});
        await Address.deleteMany({});
        await User.deleteMany({});
        await Shop.deleteMany({});
        await Product.deleteMany({});
        await ProductVariant.deleteMany({});
        await ProductCategory.deleteMany({});

        console.log('Creating product categories...');
        // Create categories
        const categories: IProductCategory[] = [];
        const categoryNames = [
            'Electronics',
            'Clothing',
            'Home & Garden',
            'Sports & Outdoors',
            'Books',
            'Toys & Games',
            'Health & Beauty',
            'Automotive',
            'Food & Beverages',
            'Fashion'
        ];

        for (let i = 0; i < categoryNames.length; i++) {
            const category = new ProductCategory({
                name: categoryNames[i],
                products: [],
            });
            await category.save();
            categories.push(category);
        }

        console.log('Creating users and addresses...');
        // Create all users first (with addresses)
        const customUsernames = [
            "johndoe",
            "sarahj",
            "mikechen",
            "emilyr",
            "davidw",
            "jessm",
            "jamesa",
            "amandat",
            "robertb",
            "lisag",
            "chrislee",
            "michellew",
            "danh",
            "jenthompson",
            "mattdavis"
        ];
        const allUsers: IUser[] = [];

        // Create users with custom usernames
        for (const username of customUsernames) {
            const user = await createUser(username, 'easybuy');
            allUsers.push(user);
        }

        // Create additional users without shops (for reviews)
        for (let i = 0; i < 5; i++) {
            const user = await createUser(faker.internet.userName(), 'password123');
            allUsers.push(user);
        }

        console.log('Creating shops and products...');
        // Create shops and products for users who should have shops
        const allProductsWithVariants: Array<{ product: IProduct, variants: any[] }> = [];
        for (let i = 0; i < customUsernames.length; i++) {
            const user = allUsers[i];
            const { shop, productsWithVariants } = await createShop(user._id, categories);
            user.shop = shop;
            await user.save();
            allProductsWithVariants.push(...productsWithVariants);
        }

        console.log('Creating reviews...');
        // Create reviews for all products using all users
        for (const { product, variants } of allProductsWithVariants) {
            // Create 2-5 reviews per product
            const reviewCount = faker.number.int({ min: 2, max: 5 });
            for (let i = 0; i < reviewCount; i++) {
                const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
                const randomVariant = variants[Math.floor(Math.random() * variants.length)];
                await createReview(product._id, randomVariant._id, randomUser._id);
            }
        }

        console.log('Database seeded successfully!');
        console.log(`Created ${allUsers.length} users`);
        console.log(`Created ${categories.length} product categories`);
        const shopCount = await Shop.countDocuments();
        const productCount = await Product.countDocuments();
        const variantCount = await ProductVariant.countDocuments();
        const reviewCount = await Review.countDocuments();
        const addressCount = await Address.countDocuments();
        console.log(`Created ${shopCount} shops`);
        console.log(`Created ${productCount} products`);
        console.log(`Created ${variantCount} product variants`);
        console.log(`Created ${reviewCount} reviews`);
        console.log(`Created ${addressCount} addresses`);
    } catch (error) {
        console.error('Error seeding the database:', error);
    } finally {
        await mongoose.disconnect();
    }
};

seedDatabase();
