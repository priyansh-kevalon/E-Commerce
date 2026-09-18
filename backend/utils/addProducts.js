import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { PRODUCT_IMAGES } from './productImages.js';

dotenv.config();

// The four existing catalogue categories.
const CATEGORIES = [
  { name: 'Electronics', description: 'Gadgets, devices and accessories' },
  { name: 'Fashion', description: 'Clothing, footwear and accessories' },
  { name: 'Home & Kitchen', description: 'Everything for your home' },
  { name: 'Sports', description: 'Fitness and outdoor gear' },
];

// 50 additional, varied products to grow the catalogue. Names must match the
// keys in productImages.js so each product gets its image set.
const PRODUCTS = [
  // -------------------- Electronics --------------------
  { name: 'Samsung Galaxy Watch 6', description: 'BT smartwatch with a bright AMOLED display, sleep tracking and 2-day battery.', price: 29999, discountPrice: 24999, category: 'Electronics', brand: 'Samsung', stock: 18, rating: 4.5, numReviews: 143, isFeatured: true },
  { name: 'iPad Air M2', description: 'Ultra-thin tablet with a 11-inch Liquid Retina display and M2 power.', price: 44900, discountPrice: 41900, category: 'Electronics', brand: 'Apple', stock: 9, rating: 4.6, numReviews: 96, isFeatured: false },
  { name: 'JBL Flip 6 Speaker', description: 'Portable waterproof Bluetooth speaker with punchy bass and 12h playtime.', price: 10999, discountPrice: 8999, category: 'Electronics', brand: 'JBL', stock: 26, rating: 4.4, numReviews: 211, isFeatured: true },
  { name: 'Logitech MX Master 3S Mouse', description: 'Precision wireless mouse with 8K DPI sensor and silent clicks.', price: 8995, discountPrice: 7499, category: 'Electronics', brand: 'Logitech', stock: 32, rating: 4.6, numReviews: 174, isFeatured: false },
  { name: 'Mechanical Keyboard K87', description: 'Hot-swappable TKL mechanical keyboard with RGB backlighting.', price: 5999, discountPrice: 4499, category: 'Electronics', brand: 'Keychron', stock: 21, rating: 4.5, numReviews: 88, isFeatured: false },
  { name: 'GoPro Hero 12 Action Camera', description: '5.3K60 action camera with HyperSmooth stabilisation.', price: 36990, discountPrice: 32990, category: 'Electronics', brand: 'GoPro', stock: 7, rating: 4.3, numReviews: 64, isFeatured: true },
  { name: '65-inch 4K Smart TV', description: 'Crystal UHD smart TV with Alexa built-in and wide viewing angles.', price: 54990, discountPrice: 48990, category: 'Electronics', brand: 'Samsung', stock: 5, rating: 4.4, numReviews: 132, isFeatured: false },
  { name: 'Wireless Earbuds Galaxy Buds3', description: 'True wireless earbuds with active noise cancellation and 24h total playtime.', price: 15999, discountPrice: 11999, category: 'Electronics', brand: 'Samsung', stock: 40, rating: 4.4, numReviews: 256, isFeatured: true },
  { name: 'Amazon Kindle Paperwhite', description: '6.8-inch 300ppi display, warm light and weeks of battery life.', price: 13999, discountPrice: 12499, category: 'Electronics', brand: 'Amazon', stock: 15, rating: 4.7, numReviews: 189, isFeatured: true },
  { name: 'Canon DSLR EOS 1500D', description: '24.1MP DSLR with full-HD video and standard 18-55mm lens kit.', price: 45990, discountPrice: 42990, category: 'Electronics', brand: 'Canon', stock: 4, rating: 4.3, numReviews: 47, isFeatured: false },
  { name: 'USB Podcast Microphone', description: 'Studio-quality cardioid condenser mic with plug-and-play USB.', price: 6999, discountPrice: 5699, category: 'Electronics', brand: 'Blue', stock: 23, rating: 4.2, numReviews: 58, isFeatured: false },
  { name: 'Smart Video Doorbell', description: '2K video doorbell with motion alerts and two-way audio.', price: 9999, discountPrice: 7999, category: 'Electronics', brand: 'Eufy', stock: 12, rating: 4.1, numReviews: 39, isFeatured: false },
  { name: 'Wi-Fi 6 Router AX3000', description: 'Dual-band Wi-Fi 6 router covering up to 2000 sq ft.', price: 5499, discountPrice: 4499, category: 'Electronics', brand: 'TP-Link', stock: 28, rating: 4.4, numReviews: 117, isFeatured: false },
  { name: 'Power Bank 20000mAh', description: '20000mAh fast-charging power bank with dual ports.', price: 2499, discountPrice: 1999, category: 'Electronics', brand: 'Anker', stock: 60, rating: 4.5, numReviews: 342, isFeatured: false },

  // -------------------- Fashion --------------------
  { name: "Women's Cotton Kurti", description: 'Breathable straight-fit kurti in a classic block print.', price: 1299, discountPrice: 899, category: 'Fashion', brand: 'Libas', stock: 55, rating: 4.2, numReviews: 87, isFeatured: false },
  { name: "Men's Slim Fit Shirt", description: 'Crisp daily-wear shirt with a comfortable slim fit.', price: 1499, discountPrice: 999, category: 'Fashion', brand: 'Peter England', stock: 48, rating: 4.1, numReviews: 73, isFeatured: false },
  { name: 'Sports Track Suit', description: 'Two-piece track suit with moisture-wicking fabric.', price: 2199, discountPrice: 1699, category: 'Fashion', brand: 'Puma', stock: 30, rating: 4.3, numReviews: 119, isFeatured: false },
  { name: 'Handcrafted Jute Bag', description: 'Eco-friendly handwoven jute tote with cotton lining.', price: 999, discountPrice: 749, category: 'Fashion', brand: 'Fabindia', stock: 42, rating: 4.4, numReviews: 51, isFeatured: false },
  { name: 'Brogue Formal Shoes', description: 'Classic tan brogues in premium leather with a cushioned sole.', price: 3999, discountPrice: 2999, category: 'Fashion', brand: 'Bata', stock: 22, rating: 4.2, numReviews: 66, isFeatured: true },
  { name: 'Aviator Sunglasses', description: 'Metal-frame aviators with UV400 polarised lenses.', price: 1499, discountPrice: 999, category: 'Fashion', brand: 'Ray-Ban', stock: 38, rating: 4.3, numReviews: 94, isFeatured: false },
  { name: 'Silk Designer Saree', description: 'Pure silk saree with hand-embroidered border and matching blouse.', price: 4999, discountPrice: 3799, category: 'Fashion', brand: 'Biba', stock: 12, rating: 4.5, numReviews: 41, isFeatured: true },
  { name: "Men's Casual Sneakers", description: 'Everyday knit sneakers with ultra-light foam cushioning.', price: 3499, discountPrice: 2499, category: 'Fashion', brand: 'Puma', stock: 33, rating: 4.3, numReviews: 152, isFeatured: false },
  { name: "Women's Leather Handbag", description: 'Genuine leather handbag with gold-tone hardware.', price: 2799, discountPrice: 1999, category: 'Fashion', brand: 'Hidesign', stock: 19, rating: 4.4, numReviews: 63, isFeatured: false },
  { name: "Men's Classic Wrist Watch", description: 'Chronograph watch with a leather strap and mineral glass.', price: 5999, discountPrice: 4499, category: 'Fashion', brand: 'Fossil', stock: 25, rating: 4.6, numReviews: 138, isFeatured: true },
  { name: "Kids' Denim Dungaree", description: 'Soft denim dungarees with adjustable straps for growing kids.', price: 1199, discountPrice: 899, category: 'Fashion', brand: 'Mothercare', stock: 36, rating: 4.2, numReviews: 28, isFeatured: false },
  { name: 'Unisex Cozy Hoodie', description: 'Brushed-fleece hoodie with kangaroo pocket and drawstring hood.', price: 1999, discountPrice: 1499, category: 'Fashion', brand: 'H&M', stock: 44, rating: 4.4, numReviews: 97, isFeatured: false },
  { name: 'Sports Socks 6-Pack', description: 'Cushioned crew socks with breathable mesh zones.', price: 499, discountPrice: 399, category: 'Fashion', brand: 'Adidas', stock: 120, rating: 4.3, numReviews: 205, isFeatured: false },

  // -------------------- Home & Kitchen --------------------
  { name: 'Non-Stick Cookware Set', description: '5-piece non-stick cookware set with soft-touch handles.', price: 4999, discountPrice: 3999, category: 'Home & Kitchen', brand: 'Prestige', stock: 17, rating: 4.4, numReviews: 82, isFeatured: true },
  { name: 'Mixer Grinder 750W', description: '3-jar mixer grinder with 750W copper motor.', price: 3999, discountPrice: 3299, category: 'Home & Kitchen', brand: 'Bajaj', stock: 29, rating: 4.3, numReviews: 186, isFeatured: false },
  { name: 'Rice Cooker 1.8L', description: 'Multi-cooker with keep-warm mode and a non-stick inner pot.', price: 2599, discountPrice: 2099, category: 'Home & Kitchen', brand: 'Philips', stock: 34, rating: 4.4, numReviews: 143, isFeatured: false },
  { name: 'Espresso Coffee Maker', description: 'Compact espresso machine with 15-bar pump pressure.', price: 7999, discountPrice: 6499, category: 'Home & Kitchen', brand: 'Nescafé', stock: 14, rating: 4.5, numReviews: 76, isFeatured: true },
  { name: 'Memory Foam Mattress', description: '5-inch gel memory foam mattress with reversible firmness.', price: 8999, discountPrice: 7499, category: 'Home & Kitchen', brand: 'Sleepwell', stock: 8, rating: 4.3, numReviews: 58, isFeatured: false },
  { name: 'Cotton Bedsheet Set', description: '400TC cotton bedsheet with two pillow covers.', price: 1499, discountPrice: 999, category: 'Home & Kitchen', brand: 'Bombay Dyeing', stock: 50, rating: 4.2, numReviews: 91, isFeatured: false },
  { name: 'LED Table Lamp', description: '3-mode LED desk lamp with USB charging port.', price: 1299, discountPrice: 899, category: 'Home & Kitchen', brand: 'Philips', stock: 65, rating: 4.4, numReviews: 174, isFeatured: false },
  { name: 'Robotic Vacuum Cleaner', description: 'Robot vacuum with self-charging, mapping and smart app control.', price: 21999, discountPrice: 17999, category: 'Home & Kitchen', brand: 'iRobot', stock: 6, rating: 4.2, numReviews: 49, isFeatured: false },
  { name: 'RO Water Purifier', description: '7-stage RO+UV purifier with 8L storage tank.', price: 13999, discountPrice: 11999, category: 'Home & Kitchen', brand: 'Kent', stock: 11, rating: 4.3, numReviews: 102, isFeatured: true },
  { name: 'Steam Iron & Garment Steamer', description: '2-in-1 steam iron and vertical steamer for wrinkle-free clothes.', price: 2499, discountPrice: 1999, category: 'Home & Kitchen', brand: 'Philips', stock: 37, rating: 4.3, numReviews: 84, isFeatured: false },
  { name: 'Wooden Cutting Board Set', description: '3-pack bamboo cutting boards with juice groove.', price: 999, discountPrice: 699, category: 'Home & Kitchen', brand: 'Prestige', stock: 58, rating: 4.5, numReviews: 121, isFeatured: false },
  { name: 'Smart Security Camera', description: '360-degree pan/tilt camera with night vision and two-way talk.', price: 4499, discountPrice: 3499, category: 'Home & Kitchen', brand: 'TP-Link', stock: 26, rating: 4.2, numReviews: 67, isFeatured: false },
  { name: '2-Slice Toaster', description: 'Stainless steel toaster with 6 browning settings.', price: 1599, discountPrice: 1199, category: 'Home & Kitchen', brand: 'Bajaj', stock: 45, rating: 4.1, numReviews: 53, isFeatured: false },

  // -------------------- Sports --------------------
  { name: 'Folding Treadmill', description: 'Auto-incline 1HP folding treadmill with shock absorption.', price: 35999, discountPrice: 29999, category: 'Sports', brand: 'Reebok', stock: 4, rating: 4.3, numReviews: 46, isFeatured: true },
  { name: '21-Speed MTB Cycle', description: 'All-terrain mountain bike with reliable gear shifting.', price: 17999, discountPrice: 15999, category: 'Sports', brand: 'Hero', stock: 7, rating: 4.3, numReviews: 54, isFeatured: false },
  { name: 'English Willow Cricket Bat', description: 'Grade-1 English willow bat, size Short Handle.', price: 3499, discountPrice: 2799, category: 'Sports', brand: 'SG', stock: 16, rating: 4.4, numReviews: 38, isFeatured: false },
  { name: 'Football Size 5', description: 'Machine-stitched football with water-resistant PU cover.', price: 1499, discountPrice: 1099, category: 'Sports', brand: 'Adidas', stock: 39, rating: 4.3, numReviews: 92, isFeatured: false },
  { name: 'Badminton Racket Set', description: 'Lightweight pair of badminton rackets with shuttlecocks.', price: 1999, discountPrice: 1499, category: 'Sports', brand: 'Yonex', stock: 27, rating: 4.2, numReviews: 61, isFeatured: false },
  { name: 'Adjustable Skating Shoes', description: 'Size-adjustable inline skates with ABEC-7 bearings.', price: 2499, discountPrice: 1999, category: 'Sports', brand: 'Cosco', stock: 18, rating: 4.1, numReviews: 44, isFeatured: false },
  { name: 'Resistance Bands Set', description: '5-level resistance band kit with handles and ankle straps.', price: 899, discountPrice: 649, category: 'Sports', brand: 'Probody', stock: 80, rating: 4.4, numReviews: 156, isFeatured: false },
  { name: '4-Person Camping Tent', description: 'Waterproof dome tent with screened windows and carrying bag.', price: 5499, discountPrice: 4499, category: 'Sports', brand: 'Wildcraft', stock: 13, rating: 4.3, numReviews: 48, isFeatured: false },
  { name: 'Trekking Backpack 60L', description: 'Rain-cover 60L trekking pack with padded straps and compartments.', price: 3999, discountPrice: 2999, category: 'Sports', brand: 'Wildcraft', stock: 21, rating: 4.4, numReviews: 87, isFeatured: true },
  { name: 'Swimming Goggles', description: 'Anti-fog, UV-protection swim goggles with silicone seal.', price: 699, discountPrice: 499, category: 'Sports', brand: 'Speedo', stock: 70, rating: 4.5, numReviews: 133, isFeatured: false },
];

const seedExtraProducts = async () => {
  try {
    await connectDB();

    const categoryMap = {};
    for (const category of CATEGORIES) {
      const doc = await Category.findOneAndUpdate(
        { name: category.name },
        { $setOnInsert: category },
        { new: true, upsert: true }
      );
      categoryMap[category.name] = doc._id;
    }

    const docs = PRODUCTS.map((product) => ({
      ...product,
      category: categoryMap[product.category],
      images: PRODUCT_IMAGES[product.name] || [],
    }));

    // Upsert by unique product name so this script is safe to re-run.
    const result = await Product.bulkWrite(
      docs.map(({ category, ...update }) => ({
        updateOne: {
          filter: { name: update.name },
          update: { $set: { ...update, category } },
          upsert: true,
        },
      }))
    );

    const count = result.upsertedCount + result.modifiedCount;
    console.log(`Seeded ${count} of ${docs.length} products (${result.upsertedCount} new)`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Seeding extra products failed: ${error.message}`);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedExtraProducts();