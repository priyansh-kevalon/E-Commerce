import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { PRODUCT_IMAGES } from './productImages.js';

dotenv.config();

const CATEGORIES = [
  { name: 'Electronics', description: 'Gadgets, devices and accessories' },
  { name: 'Fashion', description: 'Clothing, footwear and accessories' },
  { name: 'Home & Kitchen', description: 'Everything for your home' },
  { name: 'Sports', description: 'Fitness and outdoor gear' },
];

const PRODUCTS = [
  { name: 'iPhone 15 Pro', description: 'Titanium build, A17 Pro chip and a pro-grade camera system.', price: 134900, discountPrice: 124900, category: 'Electronics', brand: 'Apple', stock: 12, rating: 4.7, numReviews: 214, isFeatured: true },
  { name: 'Samsung Galaxy S24', description: 'Compact flagship with a brilliant display and all-day battery.', price: 79999, discountPrice: 69999, category: 'Electronics', brand: 'Samsung', stock: 20, rating: 4.5, numReviews: 168, isFeatured: true },
  { name: 'Sony WH-1000XM5', description: 'Industry-leading noise cancelling wireless headphones.', price: 34990, discountPrice: 29990, category: 'Electronics', brand: 'Sony', stock: 8, rating: 4.8, numReviews: 302, isFeatured: true },
  { name: 'Dell XPS 13', description: 'Ultra-portable laptop with a stunning InfinityEdge display.', price: 119990, discountPrice: 0, category: 'Electronics', brand: 'Dell', stock: 6, rating: 4.4, numReviews: 88, isFeatured: false },
  { name: 'Men’s Classic Denim Jacket', description: 'Timeless denim jacket made from durable washed cotton.', price: 3999, discountPrice: 2799, category: 'Fashion', brand: 'Levi’s', stock: 25, rating: 4.3, numReviews: 74, isFeatured: true },
  { name: 'Running Shoes', description: 'Lightweight running shoes with responsive cushioning.', price: 5999, discountPrice: 4499, category: 'Fashion', brand: 'Nike', stock: 18, rating: 4.6, numReviews: 156, isFeatured: true },
  { name: 'Leather Wallet', description: 'Slim RFID-protected genuine leather wallet.', price: 1999, discountPrice: 0, category: 'Fashion', brand: 'Fossil', stock: 40, rating: 4.2, numReviews: 51, isFeatured: false },
  { name: 'Ceramic Dinner Set', description: '24-piece microwave-safe ceramic dinner set for six.', price: 7499, discountPrice: 5999, category: 'Home & Kitchen', brand: 'Corelle', stock: 15, rating: 4.4, numReviews: 63, isFeatured: false },
  { name: 'Stainless Steel Cookware', description: 'Tri-ply stainless steel cookware set with even heating.', price: 12999, discountPrice: 9999, category: 'Home & Kitchen', brand: 'Hawkins', stock: 10, rating: 4.5, numReviews: 97, isFeatured: true },
  { name: 'Air Fryer 5L', description: 'Oil-free cooking with rapid air technology.', price: 8999, discountPrice: 6499, category: 'Home & Kitchen', brand: 'Philips', stock: 22, rating: 4.6, numReviews: 188, isFeatured: false },
  { name: 'Yoga Mat Pro', description: 'Extra-thick non-slip yoga mat with carry strap.', price: 2499, discountPrice: 1799, category: 'Sports', brand: 'Adidas', stock: 30, rating: 4.3, numReviews: 45, isFeatured: false },
  { name: 'Adjustable Dumbbell Set', description: 'Space-saving adjustable dumbbells for home workouts.', price: 15999, discountPrice: 12999, category: 'Sports', brand: 'Bowflex', stock: 5, rating: 4.7, numReviews: 129, isFeatured: true },
];

const seedData = async () => {
  try {
    await connectDB();

    const existing = await Product.countDocuments();
    if (existing > 0) {
      console.log(`Database already has ${existing} product(s). Skipping seed (idempotent).`);
      await mongoose.connection.close();
      process.exit(0);
    }

    const categoryMap = {};
    for (const category of CATEGORIES) {
      const doc = await Category.findOneAndUpdate(
        { name: category.name },
        { $setOnInsert: category },
        { new: true, upsert: true }
      );
      categoryMap[category.name] = doc._id;
    }
    console.log(`Seeded ${Object.keys(categoryMap).length} categories.`);

    const docs = PRODUCTS.map((product) => ({
      ...product,
      category: categoryMap[product.category],
      images: PRODUCT_IMAGES[product.name] || [],
    }));
    await Product.insertMany(docs);
    console.log(`Seeded ${docs.length} products.`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedData();
