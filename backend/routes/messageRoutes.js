import express from 'express';
import { sendMessage, getMessages, markMessageAsRead } from '../controllers/messageController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(sendMessage)
  .get(protect, admin, getMessages);

router.route('/:id/read')
  .put(protect, admin, markMessageAsRead);

export default router;
