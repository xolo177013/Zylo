import { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';
import ProductCard from './ProductCard';
import { getProductsApi } from '../api/productService';

/**
 * "Deals of the Day" home page row: pulls a larger batch of products and
 * shows the ones with the biggest discount first. Gives the home page a
 * cross-category highlight section, similar to a real e-commerce home page.
 */
export default function DealsSection() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getProductsApi({ sort: 'newest', limit: 50 })
      .then(({ data }) => {
        if (!active) return;
        const sorted = [...data]
          .sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0))
          .slice(0, 10);
        setDeals(sorted);
      })
      .catch(() => active && setDeals([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  if (!loading && deals.length === 0) return null;

  return (
    <div className="card p-5 relative overflow-hidden animate-fadeInUp">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent-100 rounded-full blur-3xl opacity-60" />
      <div className="relative flex items-center justify-between mb-4">
        <h2 className="text-lg font-display font-bold text-ink-900 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-100 text-accent-600">
            <Flame size={17} />
          </span>
          Deals of the Day
        </h2>
        <span className="text-xs text-accent-600 font-semibold bg-accent-50 px-3 py-1 rounded-full">
          Best discounts, updated live
        </span>
      </div>

      {loading ? (
        <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-56 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {deals.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
