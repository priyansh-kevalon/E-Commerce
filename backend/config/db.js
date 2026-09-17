import mongoose from 'mongoose';

/**
 * Connect to MongoDB using the MONGO_URI from environment variables.
 * Does not exit the process on failure so the web server can still start
 * (useful during development and for /api/health checks).
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};

export default connectDB;