import mongoose from 'mongoose';

/**
 * Connect to MongoDB using the MONGO_URI from environment variables.
 * Does not exit the process on failure so the web server can still start
 * (useful during development and for /api/health checks).
 */
const connectDB = async() => {
    try {
        const mongoUri = process.env.MONGO_URI?.trim();

        if (!mongoUri) {
            throw new Error(
                'MONGO_URI is not set. Add your MongoDB Atlas connection string to the MONGO_URI environment variable on the server/Render.'
            );
        }

        const conn = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`[DB] MongoDB connection failed: ${error.message}`);
        throw error;
    }
};

export default connectDB;