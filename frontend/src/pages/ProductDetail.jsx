import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, ShoppingBag, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProductApi, addReviewApi } from '../api/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { idOrSlug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const loadProduct = async () => {
    setLoading(true);
    try {
      const { data } = await getProductApi(idOrSlug);
      setProduct(data);
    } catch (err) {
      toast.error(err.message || 'Product not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idOrSlug]);

  const handleAddToCart = () => addToCart(product._id, quantity);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to leave a review');
      return;
    }
    setSubmittingReview(true);
    try {
      await addReviewApi(product._id, reviewForm);
      toast.success('Review submitted');
      setReviewForm({ rating: 5, comment: '' });
      loadProduct();
    } catch (err) {
      toast.error(err.message || 'Could not submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="skeleton h-96 rounded-2xl" />
      </div>
    );
  }
  if (!product) return <p className="text-center py-16 text-ink-400">Product not found.</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="card p-6 grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeInUp">
        {/* Image */}
        <div className="flex items-center justify-center bg-ink-50 rounded-2xl p-6 h-80">
          <img src={product.images?.[0]} alt={product.title} className="max-h-full max-w-full object-contain" />
        </div>

        {/* Details */}
        <div>
          <h1 className="text-xl font-display font-bold text-ink-900">{product.title}</h1>
          <p className="text-sm text-ink-400 mt-1">Brand: {product.brand}</p>

          {product.ratingsCount > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <span className="flex items-center gap-1 bg-emerald-500 text-white text-xs font-semibold px-2 py-0.5 rounded-md">
                {product.ratingsAverage} <Star size={12} fill="white" />
              </span>
              <span className="text-sm text-ink-400">{product.ratingsCount} ratings</span>
            </div>
          )}

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-ink-900">₹{product.price.toLocaleString('en-IN')}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-base text-ink-400 line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
                <span className="text-base text-emerald-600 font-semibold">{product.discountPercent}% off</span>
              </>
            )}
          </div>

          <p className="text-sm mt-3 text-ink-600 leading-relaxed">{product.description}</p>

          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-ink-800 mb-2">Specifications</h3>
              <table className="text-sm w-full">
                <tbody>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <tr key={key} className="border-b border-ink-100">
                      <td className="py-1.5 pr-4 text-ink-400 w-1/3">{key}</td>
                      <td className="py-1.5 text-ink-800">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="mt-4 text-sm flex items-center gap-1.5">
            {product.stock > 0 ? (
              <>
                <ShieldCheck size={15} className="text-emerald-600" />
                <span className="text-emerald-600 font-semibold">In Stock ({product.stock} available)</span>
              </>
            ) : (
              <span className="text-accent-600 font-semibold">Out of Stock</span>
            )}
          </p>

          <div className="flex items-center gap-3 mt-4">
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border border-ink-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-400 transition-colors"
              disabled={product.stock === 0}
            >
              {Array.from({ length: Math.min(product.stock, 10) || 1 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  Qty: {n}
                </option>
              ))}
            </select>
            <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn-accent flex-1 !py-2.5">
              <ShoppingBag size={16} /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="card p-6 animate-fadeInUp">
        <h2 className="text-lg font-display font-bold text-ink-900 mb-4">Customer Reviews</h2>

        {product.reviews.length === 0 ? (
          <p className="text-ink-400 text-sm mb-4">No reviews yet. Be the first to review this product.</p>
        ) : (
          <div className="space-y-4 mb-6">
            {product.reviews.map((review) => (
              <div key={review._id} className="border-b border-ink-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 bg-emerald-500 text-white text-xs font-semibold px-2 py-0.5 rounded-md">
                    {review.rating} <Star size={10} fill="white" />
                  </span>
                  <span className="text-sm font-semibold text-ink-800">{review.name}</span>
                </div>
                {review.comment && <p className="text-sm text-ink-600 mt-1">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleReviewSubmit} className="space-y-3 max-w-md">
          <h3 className="font-semibold text-ink-800">Write a review</h3>
          <select
            value={reviewForm.rating}
            onChange={(e) => setReviewForm((f) => ({ ...f, rating: Number(e.target.value) }))}
            className="input-field"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} Star{r > 1 ? 's' : ''}
              </option>
            ))}
          </select>
          <textarea
            value={reviewForm.comment}
            onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
            placeholder="Share your experience with this product..."
            className="input-field"
            rows={3}
          />
          <button type="submit" disabled={submittingReview} className="btn-brand">
            {submittingReview ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}
