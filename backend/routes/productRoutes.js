import express from 'express';
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createOrUpdateProductReview,
  deleteProductReview,
  getProductRecommendations
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.route('/:id/recommendations')
  .get(getProductRecommendations);

router.route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

router.route('/:id/reviews')
  .post(protect, createOrUpdateProductReview)
  .delete(protect, deleteProductReview);

export default router;
