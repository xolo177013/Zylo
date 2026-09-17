import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { getCategoriesApi } from '../api/productService';

export default function CategoryDropdown() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCategoriesApi()
      .then(({ data }) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const goToCategory = (category) => {
    setOpen(false);
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-ink-700 hover:text-brand-600 transition-colors"
      >
        Categories <ChevronDown size={16} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 mt-1 w-56 bg-white border border-ink-100 rounded-2xl shadow-card z-50 py-2 animate-scaleIn origin-top-left">
          {categories.length === 0 && (
            <div className="px-4 py-2 text-sm text-ink-400">No categories yet</div>
          )}
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => goToCategory(cat)}
              className="block w-full text-left px-4 py-2 text-sm text-ink-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
