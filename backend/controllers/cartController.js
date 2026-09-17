const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to fetch or create a cart for a user, populated with product details
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    select: 'title images price stock isActive'
  });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'title images price stock isActive'
    });
  }
  return cart;
};

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  res.json({ success: true, data: cart });
});

// @desc    Add item to cart (or increment quantity if it exists)
// @route   POST /api/cart/items
// @body    { productId, quantity }
// @access  Private
const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error('productId is required');
  }
  if (quantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1');
  }

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    res.status(404);
    throw new Error('Product not found');
  }
  if (product.stock < quantity) {
    res.status(400);
    throw new Error(`Only ${product.stock} unit(s) left in stock`);
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const existingItem = cart.items.find((item) => item.product.toString() === productId);

  if (existingItem) {
    const newQty = existingItem.quantity + Number(quantity);
    if (newQty > product.stock) {
      res.status(400);
      throw new Error(`Cannot add more than available stock (${product.stock})`);
    }
    existingItem.quantity = newQty;
    existingItem.priceAtAddTime = product.price;
  } else {
    cart.items.push({ product: productId, quantity, priceAtAddTime: product.price });
  }

  await cart.save();
  const populated = await getOrCreateCart(req.user._id);
  res.status(200).json({ success: true, data: populated });
});

// @desc    Update quantity of a specific cart item
// @route   PUT /api/cart/items/:itemId
// @body    { quantity }
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { itemId } = req.params;

  if (!quantity || quantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1. To remove, use the DELETE endpoint.');
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const item = cart.items.id(itemId);
  if (!item) {
    res.status(404);
    throw new Error('Cart item not found');
  }

  const product = await Product.findById(item.product);
  if (!product || quantity > product.stock) {
    res.status(400);
    throw new Error(`Only ${product ? product.stock : 0} unit(s) left in stock`);
  }

  item.quantity = quantity;
  item.priceAtAddTime = product.price;

  await cart.save();
  const populated = await getOrCreateCart(req.user._id);
  res.json({ success: true, data: populated });
});

// @desc    Remove an item from the cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private
const removeCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const item = cart.items.id(itemId);
  if (!item) {
    res.status(404);
    throw new Error('Cart item not found');
  }

  item.deleteOne();
  await cart.save();

  const populated = await getOrCreateCart(req.user._id);
  res.json({ success: true, data: populated });
});

// @desc    Clear the entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.json({ success: true, message: 'Cart cleared' });
});

module.exports = { getCart, addItemToCart, updateCartItem, removeCartItem, clearCart, getOrCreateCart };
