import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Coupon from './models/Coupon.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importCoupons = async () => {
  try {
    await Coupon.deleteMany();

    const coupons = [
      {
        code: 'BIENVENUE10',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Valid 1 year
        isActive: true
      },
      {
        code: 'MINUS50',
        discountType: 'FIXED',
        discountValue: 50,
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        isActive: true
      }
    ];

    await Coupon.insertMany(coupons);

    console.log('Coupons Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importCoupons();
