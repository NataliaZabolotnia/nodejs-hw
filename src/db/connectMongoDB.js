import mongoose from 'mongoose';
import { Note } from '../models/note.js';
export const connectMongoDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    await mongoose.connect(mongoUrl);
    console.log('✅ MongoDB connection established successfully');
    await Note.syncIndexes();
    console.log("Indexes synced Successfully");

  } catch (error) {
    console.error('Failed to connect', error.message);
    process.exit(1);
  }
};
