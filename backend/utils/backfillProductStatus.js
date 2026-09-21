import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

// Backfill seller + status fields on products created before the seller
// feature existed. Store-owned items become approved; seller items that
// somehow lack a status are flagged for review.
const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const missingStatus = await Product.updateMany(
    { status: { $exists: false } },
    { $set: { status: 'approved', seller: null } }
  );

  console.log(`Set status/seller on ${missingStatus.modifiedCount} legacy products`);
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});