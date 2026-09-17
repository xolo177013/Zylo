const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Simulates calling out to a real payment processor (Stripe/Razorpay-style).
// Resolves after a short delay with a transaction id, honoring a configurable
// success rate so failure handling can be exercised in the UI.
const runMockPaymentGateway = (amount) =>
  new Promise((resolve) => {
    const successRate = Number(process.env.PAYMENT_SIMULATED_SUCCESS_RATE ?? 1);
    setTimeout(() => {
      const succeeded = Math.random() < successRate;
      resolve({
        success: succeeded,
        transactionId: succeeded ? `MOCK_TXN_${crypto.randomBytes(8).toString('hex')}` : null,
        gateway: 'MockPay',
        amount
      });
    }, 600);
  });

// @desc    Create a new order from the user's current cart, then process mock payment
// @route   POST /api/orders
// @body    { shippingAddress, paymentMethod }
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod = 'MOCK_CARD' } = req.body;

  if (
    !shippingAddress ||
    !shippingAddress.fullName ||
    !shippingAddress.phone ||
    !shippingAddress.line1 ||
    !shippingAddress.city ||
    !shippingAddress.state ||
    !shippingAddress.pincode
  ) {
    res.status(400);
    throw new Error('A complete shipping address is required');
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Your cart is empty');
  }

  // Validate stock and lock in prices at order time
  const orderItems = [];
  for (const item of cart.items) {
    const product = item.product;
    if (!product || !product.isActive) {
      res.status(400);
      throw new Error(`A product in your cart is no longer available`);
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for "${product.title}". Only ${product.stock} left.`);
    }
    orderItems.push({
      product: product._id,
      title: product.title,
      image: product.images?.[0],
      price: product.price,
      quantity: item.quantity
    });
  }

  const itemsPrice = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingPrice = itemsPrice > 500 ? 0 : 40;
  const taxPrice = Math.round(itemsPrice * 0.05 * 100) / 100;
  const totalPrice = Math.round((itemsPrice + shippingPrice + taxPrice) * 100) / 100;

  // Create order in Pending state first
  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    paymentStatus: 'Pending',
    orderStatus: 'Placed'
  });

  // Run the mock payment gateway flow
  const paymentResult = await runMockPaymentGateway(totalPrice);

  if (paymentResult.success) {
    order.paymentStatus = 'Paid';
    order.orderStatus = 'Confirmed';
    order.paymentResult = {
      transactionId: paymentResult.transactionId,
      gateway: paymentResult.gateway,
      paidAt: new Date()
    };
    order.statusHistory.push({ status: 'Confirmed', note: 'Payment received via MockPay' });

    // Decrement stock now that payment succeeded
    await Promise.all(
      orderItems.map((item) =>
        Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
      )
    );

    // Empty the cart
    cart.items = [];
    await cart.save();
  } else {
    order.paymentStatus = 'Failed';
    order.statusHistory.push({ status: 'Placed', note: 'Payment failed - please retry' });
  }

  await order.save();

  res.status(paymentResult.success ? 201 : 402).json({
    success: paymentResult.success,
    message: paymentResult.success
      ? 'Order placed and payment successful'
      : 'Payment failed. Your order was saved as pending - please retry payment.',
    data: order
  });
});

// @desc    Retry payment for a pending/failed order
// @route   POST /api/orders/:id/pay
// @access  Private
const retryPayment = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to modify this order');
  }
  if (order.paymentStatus === 'Paid') {
    res.status(400);
    throw new Error('This order has already been paid for');
  }

  const paymentResult = await runMockPaymentGateway(order.totalPrice);

  if (paymentResult.success) {
    order.paymentStatus = 'Paid';
    order.orderStatus = 'Confirmed';
    order.paymentResult = {
      transactionId: paymentResult.transactionId,
      gateway: paymentResult.gateway,
      paidAt: new Date()
    };
    order.statusHistory.push({ status: 'Confirmed', note: 'Payment received via MockPay (retry)' });

    await Promise.all(
      order.items.map((item) =>
        Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
      )
    );
  } else {
    order.paymentStatus = 'Failed';
    order.statusHistory.push({ status: order.orderStatus, note: 'Retry payment failed' });
  }

  await order.save();

  res.status(paymentResult.success ? 200 : 402).json({
    success: paymentResult.success,
    message: paymentResult.success ? 'Payment successful' : 'Payment failed again. Please try later.',
    data: order
  });
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: orders });
});

// @desc    Get single order by id (owner or admin only)
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const isOwner = order.user._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json({ success: true, data: order });
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.orderStatus = status;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Order.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: orders,
    pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum) || 1 }
  });
});

// @desc    Update order status (admin) - drives the live tracking timeline
// @route   PUT /api/orders/:id/status
// @body    { status, note }
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const validStatuses = ['Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error(`Status must be one of: ${validStatuses.join(', ')}`);
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.orderStatus = status;
  order.statusHistory.push({ status, note: note || `Status updated to ${status}` });
  if (status === 'Delivered') order.deliveredAt = new Date();

  await order.save();
  res.json({ success: true, data: order });
});

module.exports = {
  createOrder,
  retryPayment,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
};
