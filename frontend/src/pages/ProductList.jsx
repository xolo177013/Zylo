import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getProductsApi, getCategoriesApi } from '../api/productService';

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const page = Number(searchParams.get('page') || 1);

  useEffect(() => {
    getCategoriesApi().then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data, pagination: pag } = await getProductsApi({
          keyword: keyword || undefined,
          category: category || undefined,
          sort,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          page,
          limit: 12
        });
        setProducts(data);
        setPagination(pag);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [keyword, category, sort, minPrice, maxPrice, page]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set('page', '1');
    setSearchParams(next);
  };

  const goToPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(p));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row gap-5">
      {/* Filters sidebar */}
      <aside className="w-full md:w-64 card p-5 h-fit space-y-6 animate-fadeInUp">
        <h3 className="font-display font-bold text-ink-900 flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-brand-600" /> Filters
        </h3>

        <div>
          <h4 className="text-sm font-semibold text-ink-700 mb-2">Category</h4>
          <div className="space-y-1">
            <button
              onClick={() => updateParam('category', '')}
              className={`block text-sm w-full text-left px-3 py-1.5 rounded-lg transition-colors ${
                !category ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-ink-600 hover:bg-ink-50'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => updateParam('category', cat)}
                className={`block text-sm w-full text-left px-3 py-1.5 rounded-lg transition-colors ${
                  category === cat ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-ink-600 hover:bg-ink-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-700 mb-2">Price Range (₹)</h4>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              defaultValue={minPrice}
              onBlur={(e) => updateParam('minPrice', e.target.value)}
              className="input-field w-1/2 !py-2"
            />
            <input
              type="number"
              placeholder="Max"
              defaultValue={maxPrice}
              onBlur={(e) => updateParam('maxPrice', e.target.value)}
              className="input-field w-1/2 !py-2"
            />
          </div>
        </div>
      </aside>

      {/* Product grid */}
      <div className="flex-1 space-y-4">
        <div className="card p-3.5 flex items-center justify-between animate-fadeInUp">
          <p className="text-sm text-ink-500">
            {pagination.total} result{pagination.total !== 1 ? 's' : ''}
            {keyword && <> for "<span className="font-semibold text-ink-800">{keyword}</span>"</>}
          </p>
          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="border border-ink-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-brand-400 transition-colors"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="skeleton h-56 rounded-2xl" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="card text-center text-ink-400 py-16">No products match your filters.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 pt-2">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  p === pagination.page
                    ? 'bg-brand-600 text-white shadow-soft'
                    : 'bg-white text-ink-600 border border-ink-200 hover:border-brand-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
