const mongoose = require('mongoose');
const slugify = require('slugify');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 1000 }
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: 200
    },
    slug: {
      type: String,
      unique: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true
    },
    brand: {
      type: String,
      trim: true,
      default: 'Generic'
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true
    },
    subCategory: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    mrp: {
      type: Number,
      required: [true, 'MRP is required'],
      min: [0, 'MRP cannot be negative']
    },
    discountPercent: {
      type: Number,
      default: 0
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    images: [
      {
        type: String,
        required: true
      }
    ],
    specifications: {
      type: Map,
      of: String,
      default: {}
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    ratingsCount: {
      type: Number,
      default: 0
    },
    reviews: [reviewSchema],
    isFeatured: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Text index for keyword search
productSchema.index({ title: 'text', description: 'text', brand: 'text', category: 'text' });

// Auto-generate slug and discount percent before saving
productSchema.pre('save', function preSave(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = `${slugify(this.title, { lower: true, strict: true })}-${Date.now().toString(36)}`;
  }
  if (this.mrp > 0) {
    this.discountPercent = Math.round(((this.mrp - this.price) / this.mrp) * 100);
  }
  next();
});

// Recalculate rating aggregates
productSchema.methods.recalculateRatings = function recalculateRatings() {
  if (this.reviews.length === 0) {
    this.ratingsAverage = 0;
    this.ratingsCount = 0;
    return;
  }
  const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
  this.ratingsAverage = Math.round((total / this.reviews.length) * 10) / 10;
  this.ratingsCount = this.reviews.length;
};

module.exports = mongoose.model('Product', productSchema);
