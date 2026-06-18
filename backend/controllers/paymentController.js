import dotenv from 'dotenv';
import Stripe from 'stripe';
import crypto from 'crypto';

dotenv.config();

// @desc    Get Stripe Public Key
// @route   GET /api/payment/stripe/config
// @access  Public
export const getStripeConfig = (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLIC_KEY || '' });
};

// @desc    Create Stripe Payment Intent
// @route   POST /api/payment/stripe/create-intent
// @access  Private
export const createStripePaymentIntent = async (req, res) => {
  const { amount, currency = 'mad' } = req.body;
  
  if (!process.env.STRIPE_SECRET_KEY) {
    res.status(500);
    throw new Error('STRIPE_SECRET_KEY non configurée');
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // En centimes
      currency,
    });
    
    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Erreur Stripe : ${error.message}`);
  }
};
