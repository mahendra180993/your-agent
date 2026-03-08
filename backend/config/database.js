// config/database.js
import mongoose from 'mongoose';
import logger from '../src/utils/logger.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    logger.warn('Backend will continue but database features will not work until MongoDB is connected.');
    // Don't exit - allow server to run without DB for testing
    // process.exit(1);
  }
};

export default connectDB;
