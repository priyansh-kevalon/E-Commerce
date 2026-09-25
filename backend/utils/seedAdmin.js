import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

/**
 * Seed (or promote) an admin account.
 * Usage:
 *   npm run seed:admin
 *   npm run seed:admin -- --reset-password   (also resets the password)
 */
const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const resetPassword = process.argv.includes('--reset-password');

  try {
    if (!email || !password) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be configured before seeding an admin.');
    }

    await connectDB();

    let user = await User.findOne({ email }).select('+password');

    if (user) {
      user.role = 'admin';
      user.isActive = true;
      if (resetPassword) {
        user.password = password;
      }
      await user.save();
      console.log(`Admin account updated: ${email}`);
    } else {
      await User.create({ name: 'Administrator', email, password, role: 'admin' });
      console.log(`Admin account created: ${email}`);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedAdmin();
