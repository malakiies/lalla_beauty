import Product from '../models/Product.js';
import cloudinary from '../utils/cloudinary.js';

// @desc    Fetch all products
// @route   GET /api/products
export const getProducts = async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const products = await Product.find({ ...keyword }).populate('category', 'name');
  res.json(products);
};

// @desc    Fetch single product
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name');

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

// @desc    Get product recommendations
// @route   GET /api/products/:id/recommendations
export const getProductRecommendations = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // 1. Similar products: Same category, not this product
  let similar = [];
  if (product.category) {
    similar = await Product.find({
      category: product.category,
      _id: { $ne: productId }
    }).limit(4);
  }

  // 2. Popular products: Top rated
  const popular = await Product.find({ _id: { $ne: productId } })
    .sort({ rating: -1, numReviews: -1 })
    .limit(4);

  // 3. Complementary products: Popular products from other categories
  let complementary = [];
  if (product.category) {
    complementary = await Product.find({
      category: { $ne: product.category },
      _id: { $ne: productId }
    })
      .sort({ rating: -1, numReviews: -1 })
      .limit(4);
  } else {
    complementary = await Product.find({ _id: { $ne: productId } })
      .sort({ rating: -1, numReviews: -1 })
      .limit(4);
  }

  res.json({
    similar,
    popular,
    complementary
  });
};

// @desc    Create a product
// @route   POST /api/products
export const createProduct = async (req, res) => {
  const { name, price, description, stock, category, image } = req.body;

  const product = new Product({
    name: name || 'Nouveau Produit',
    price: price || 0,
    user: req.user._id,
    image: image || '/images/placeholder.jpg',
    category: category || null,
    countInStock: stock || 0,
    numReviews: 0,
    description: description || 'Description du produit',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    category,
    countInStock,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    if (product.image && product.image.includes('cloudinary.com')) {
      try {
        const urlParts = product.image.split('/');
        const filenameWithExtension = urlParts[urlParts.length - 1];
        const folder = urlParts[urlParts.length - 2];
        const filename = filenameWithExtension.split('.')[0];
        const publicId = `${folder}/${filename}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error('Failed to delete image from Cloudinary:', err);
      }
    }
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

// @desc    Create new review or update existing one
// @route   POST /api/products/:id/reviews
export const createOrUpdateProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      // Update existing review
      alreadyReviewed.rating = Number(rating);
      alreadyReviewed.comment = comment;
    } else {
      // Create new review
      const reviewName = req.user.firstName ? `${req.user.firstName} ${req.user.lastName}`.trim() : req.user.name || 'Anonymous';
      const review = {
        name: reviewName,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
    }

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added/updated successfully' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

// @desc    Delete a review
// @route   DELETE /api/products/:id/reviews
export const deleteProductReview = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    const reviewIndex = product.reviews.findIndex(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (reviewIndex !== -1) {
      product.reviews.splice(reviewIndex, 1);
      product.numReviews = product.reviews.length;

      if (product.reviews.length > 0) {
        product.rating =
          product.reviews.reduce((acc, item) => item.rating + acc, 0) /
          product.reviews.length;
      } else {
        product.rating = 0;
      }

      await product.save();
      res.json({ message: 'Review removed successfully' });
    } else {
      res.status(404);
      throw new Error('Review not found');
    }
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};
