import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import BannerCarousel from '../components/BannerCarousel';
import ProductCard from '../components/ProductCard';
import CategorySection from '../components/CategorySection';
import DealsSection from '../components/DealsSection';
import { NAV_CATEGORIES } from '../components/CategoryNav';
import { getProductsApi, getCategoriesApi } from '../api/productService';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          getProductsApi({ sort: 'newest', limit: 20 }),
          getCategoriesApi()
        ]);
        setFeatured(productsRes.data);
        setCategories(categoriesRes.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Only show a category row on the home page if the backend actually has
  // products in that category - otherwise CategorySection just hides itself,
  // but this keeps the categories list (used for the circle shortcuts) tidy.
  const availableCategories = NAV_CATEGORIES.filter((c) =>
    categories.some((cat) => cat.toLowerCase() === c.name.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-5 space-y-6">
      <BannerCarousel />

      {/* Category quick links (circle shortcuts) */}
      {categories.length > 0 && (
        <div className="card p-5 flex flex-wrap gap-x-8 gap-y-5 justify-center animate-fadeInUp">
          {categories.map((cat, i) => (
            <Link
              key={cat}
              to={`/products?category=${encodeURIComponent(cat)}`}
              className="flex flex-col items-center gap-2 text-sm font-medium text-ink-600 hover:text-brand-600 transition-colors group"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50 flex items-center justify-center text-lg font-display font-bold text-brand-600 shadow-soft transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-card">
                {cat.charAt(0)}
              </div>
              {cat}
            </Link>
          ))}
        </div>
      )}

      {/* Deals of the Day - biggest discounts across every category */}
      <DealsSection />

      {/* Trending / featured products across all categories */}
      <div className="card p-5 animate-fadeInUp">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-bold text-ink-900">Trending Now</h2>
          <Link
            to="/products"
            className="flex items-center gap-1 text-brand-600 text-sm font-semibold hover:gap-1.5 transition-all"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="skeleton h-56 rounded-2xl" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <p className="text-ink-400 text-center py-10">
            No products yet. Run <code className="bg-ink-100 px-1.5 py-0.5 rounded">npm run seed</code> in the backend
            folder to add demo products.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* One dedicated row of 10 products per top-level category, matching the nav bar buttons */}
      {!loading &&
        availableCategories.map(({ name }) => (
          <CategorySection key={name} title={`Best of ${name}`} category={name} limit={10} />
        ))}
    </div>
  );
}
