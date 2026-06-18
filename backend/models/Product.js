import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  stock: { type: Number, required: true, default: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  image: { type: String, required: true },
  ingredients: { type: [String], default: [] },
  benefits: { type: [String], default: [] },
  featured: { type: Boolean, default: false },
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
  reviews: [reviewSchema]
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
