import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const URI = process.env.MONGODB_URL;
    await mongoose.connect(URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(0);
  }
};

export default connectDB;