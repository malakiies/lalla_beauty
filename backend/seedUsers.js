import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';

dotenv.config();
connectDB();

const importUsers = async () => {
  try {
    try {
      await User.collection.dropIndex('username_1');
      console.log('Dropped username index');
    } catch (err) {
      console.log('Username index not found, skipping');
    }

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@lallabeauty.ma' });
    if (!adminExists) {
      await User.create({
        firstName: 'Admin',
        lastName: 'Lalla',
        email: 'admin@lallabeauty.ma',
        password: 'password123',
        role: 'admin'
      });
      console.log('Admin user created');
    }

    // Check if customer already exists
    const customerExists = await User.findOne({ email: 'client@lallabeauty.ma' });
    if (!customerExists) {
      await User.create({
        firstName: 'Client',
        lastName: 'Test',
        email: 'client@lallabeauty.ma',
        password: 'password123',
        role: 'user'
      });
      console.log('Client user created');
    }

    console.log('User Seed Finished!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importUsers();
