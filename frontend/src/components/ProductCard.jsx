import { Link } from 'react-router-dom';
import { Star, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white rounded-2xl border border-ink-100/70 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 p-3.5 flex flex-col">
      <Link to={`/products/${product.slug}`} className="flex-1">
        <div className="relative h-40 flex items-center justify-center mb-3 overflow-hidden rounded-xl bg-ink-50">
          <img
            src={product.images?.[0]}
            alt={product.title}
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {product.discountPercent > 0 && (
            <span className="absolute top-2 left-2 bg-accent-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-soft">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>
        <h3 className="text-sm text-ink-800 font-medium line-clamp-2 min-h-[2.5rem] group-hover:text-brand-700 transition-colors">
          {product.title}
        </h3>
        {product.ratingsCount > 0 && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="flex items-center gap-0.5 bg-emerald-500 text-white text-[11px] font-semibold px-1.5 py-0.5 rounded-md">
              {product.ratingsAverage} <Star size={9} fill="white" />
            </span>
            <span className="text-xs text-ink-400">({product.ratingsCount})</span>
          </div>
        )}
        <div className="mt-2 flex items-baseline gap-2 flex-wrap">
          <span className="text-base font-bold text-ink-900">₹{product.price.toLocaleString('en-IN')}</span>
          {product.mrp > product.price && (
            <>
              <span className="text-xs text-ink-400 line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
              <span className="text-xs text-emerald-600 font-semibold">{product.discountPercent}% off</span>
            </>
          )}
        </div>
      </Link>
      <button
        onClick={() => addToCart(product._id, 1)}
        disabled={product.stock === 0}
        className="mt-3 w-full inline-flex items-center justify-center gap-1.5 bg-ink-900 disabled:bg-ink-200 disabled:text-ink-400 text-white text-sm font-semibold py-2 rounded-xl transition-all duration-200 hover:bg-accent-500 active:scale-[0.98]"
      >
        {product.stock === 0 ? (
          'Out of Stock'
        ) : (
          <>
            <Plus size={15} /> Add to Cart
          </>
        )}
      </button>
    </div>
  );
}
