import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { getProductsApi } from '../api/productService';

/**
 * Renders one "row" of the home page dedicated to a single category, e.g.
 * "Best of Mobiles" or "Fashion Picks For You". Used repeatedly on the
 * Home page so every nav bar category gets its own showcase section.
 */
export default function CategorySection({ title, category, sort = 'newest', limit = 6 }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getProductsApi({ category, sort, limit })
      .then(({ data }) => {
        if (active) setProducts(data);
      })
      .catch(() => {
        if (active) setProducts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [category, sort, limit]);

  if (!loading && products.length === 0) return null;

  return (
    <div className="card p-5 animate-fadeInUp">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-display font-bold text-ink-900">{title}</h2>
        <Link
          to={`/products?category=${encodeURIComponent(category)}`}
          className="flex items-center gap-1 text-brand-600 text-sm font-semibold hover:gap-1.5 transition-all"
        >
          View All <ArrowRight size={14} />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="skeleton h-56 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
