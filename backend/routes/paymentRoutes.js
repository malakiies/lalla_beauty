import express from 'express';
import {
  getStripeConfig,
  createStripePaymentIntent
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Stripe Routes
router.route('/stripe/config').get(getStripeConfig);
router.route('/stripe/create-intent').post(protect, createStripePaymentIntent);

export default router;
