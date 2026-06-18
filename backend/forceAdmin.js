import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';

dotenv.config();
connectDB();

const forceAdmin = async () => {
  try {
    const user = await User.findOne({ email: 'admin@lallabeauty.ma' });
    if (user) {
      user.role = 'admin';
      await user.save();
      console.log('Force updated admin@lallabeauty.ma to admin role.');
    } else {
      console.log('User not found.');
    }
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

forceAdmin();
