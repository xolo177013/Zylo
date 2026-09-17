const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Get products with keyword search, category filter, price sort, pagination
// @route   GET /api/products
// @query   keyword, category, minPrice, maxPrice, sort, page, limit
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const {
    keyword,
    category,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 12
  } = req.query;

  const query = { isActive: true };

  if (keyword) {
    query.$text = { $search: keyword };
  }

  if (category) {
    query.category = { $regex: new RegExp(`^${category}$`, 'i') };
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const sortMap = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { ratingsAverage: -1 },
    newest: { createdAt: -1 }
  };
  const sortOption = sortMap[sort] || { createdAt: -1 };

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(query).sort(sortOption).skip(skip).limit(limitNum),
    Product.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: products,
    pagination: {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      limit: limitNum
    }
  });
});

// @desc    Get a list of distinct categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category', { isActive: true });
  res.json({ success: true, data: categories });
});

// @desc    Get single product by slug or id
// @route   GET /api/products/:idOrSlug
// @access  Public
const getProductByIdOrSlug = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);

  const product = isObjectId
    ? await Product.findById(idOrSlug).populate('reviews.user', 'name')
    : await Product.findOne({ slug: idOrSlug }).populate('reviews.user', 'name');

  if (!product || !product.isActive) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, data: product });
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { title, description, brand, category, price, mrp, stock, images, specifications } =
    req.body;

  if (!title || !description || !category || price == null || mrp == null || !images?.length) {
    res.status(400);
    throw new Error('Missing required product fields: title, description, category, price, mrp, images');
  }

  const product = await Product.create({
    title,
    description,
    brand,
    category,
    price,
    mrp,
    stock,
    images,
    specifications
  });

  res.status(201).json({ success: true, data: product });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const updatableFields = [
    'title',
    'description',
    'brand',
    'category',
    'subCategory',
    'price',
    'mrp',
    'stock',
    'images',
    'specifications',
    'isFeatured',
    'isActive'
  ];

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) product[field] = req.body[field];
  });

  const updated = await product.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete (soft-delete) a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product.isActive = false;
  await product.save();

  res.json({ success: true, message: 'Product deactivated successfully' });
});

// @desc    Add a review to a product
// @route   POST /api/products/:id/reviews
// @access  Private
const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  if (!rating || rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5');
  }

  product.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  });

  product.recalculateRatings();
  await product.save();

  res.status(201).json({ success: true, message: 'Review added', data: product });
});

module.exports = {
  getProducts,
  getCategories,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview
};
