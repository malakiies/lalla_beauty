import Order from '../models/Order.js';
import Notification from '../models/Notification.js';

// @desc    Create new order
// @route   POST /api/orders
export const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    await Notification.create({
      user: req.user._id,
      type: 'ORDER_NEW',
      title: 'Nouvelle commande',
      message: `Votre commande #${createdOrder._id.toString().substring(0, 8)} a été confirmée.`,
      link: '/profile'
    });

    res.status(201).json(createdOrder);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
export const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
      gateway: req.body.gateway || order.paymentMethod
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

// @desc    Get all orders
// @route   GET /api/orders
export const getOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name firstName lastName email');
  res.json(orders);
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
export const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      await Order.updateOne(
        { _id: order._id },
        { $set: { isDelivered: true, deliveredAt: Date.now() } }
      );
      
      const updatedOrder = await Order.findById(req.params.id);

      if (updatedOrder.user) {
        await Notification.create({
          user: updatedOrder.user,
          type: 'ORDER_SHIPPED',
          title: 'Commande expédiée',
          message: `Votre commande #${updatedOrder._id.toString().substring(0, 8)} est en route !`,
          link: '/profile'
        });
      }

      res.json(updatedOrder);
    } else {
      res.status(404);
      res.json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error("Deliver Error:", error);
    res.status(500).json({ message: error.message });
  }
};
