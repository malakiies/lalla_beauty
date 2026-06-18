import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'lalla_beauty_products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage });

// @desc    Upload an image to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (req.file && req.file.path) {
    res.json({
      url: req.file.path,
      public_id: req.file.filename
    });
  } else {
    res.status(400).json({ message: 'Image upload failed' });
  }
});

export default router;
