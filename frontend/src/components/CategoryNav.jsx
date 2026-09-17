import { Link, useLocation } from 'react-router-dom';
import {
  Smartphone,
  Laptop,
  Shirt,
  Home as HomeIcon,
  Refrigerator,
  Sparkles,
  Blocks,
  Dumbbell,
  Sofa,
  BookOpen,
  LayoutGrid
} from 'lucide-react';

// Static top-level category list. These values must match the `category`
// field stored on each product in the database (see backend/seed/seed.js)
// so that clicking a nav button reliably shows matching products.
export const NAV_CATEGORIES = [
  { name: 'Mobiles', icon: Smartphone },
  { name: 'Electronics', icon: Laptop },
  { name: 'Fashion', icon: Shirt },
  { name: 'Home', icon: HomeIcon },
  { name: 'Appliances', icon: Refrigerator },
  { name: 'Beauty', icon: Sparkles },
  { name: 'Toys', icon: Blocks },
  { name: 'Sports', icon: Dumbbell },
  { name: 'Furniture', icon: Sofa },
  { name: 'Books', icon: BookOpen }
];

export default function CategoryNav() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const activeCategory = params.get('category');

  return (
    <nav className="bg-white border-b border-ink-100">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin py-2.5">
          <Link
            to="/products"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-200 ${
              !activeCategory
                ? 'bg-brand-600 text-white shadow-soft'
                : 'text-ink-600 hover:text-brand-600 hover:bg-brand-50'
            }`}
          >
            <LayoutGrid size={15} />
            All
          </Link>
          {NAV_CATEGORIES.map(({ name, icon: Icon }) => {
            const isActive = activeCategory?.toLowerCase() === name.toLowerCase();
            return (
              <Link
                key={name}
                to={`/products?category=${encodeURIComponent(name)}`}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-soft'
                    : 'text-ink-600 hover:text-brand-600 hover:bg-brand-50'
                }`}
              >
                <Icon size={15} />
                {name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
