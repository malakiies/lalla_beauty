import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  type: {
    type: String,
    required: true,
    enum: ['ORDER_NEW', 'ORDER_SHIPPED', 'PROMO', 'PRODUCT_NEW']
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  link: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
