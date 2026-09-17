import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, LogOut, PackageSearch, LayoutDashboard, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CategoryNav from './CategoryNav';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems, setIsDrawerOpen } = useCart();
  const navigate = useNavigate();

  // Small "pop" animation on the cart badge whenever the item count changes.
  useEffect(() => {
    if (totalItems === 0) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 350);
    return () => clearTimeout(t);
  }, [totalItems]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/products?keyword=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-white/80 backdrop-blur-lg border-b border-ink-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white font-display font-bold text-lg shadow-soft transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
              z
              <Sparkles size={12} className="absolute -top-1.5 -right-1.5 text-accent-300" />
            </span>
            <span className="font-display font-extrabold text-xl tracking-tight text-ink-900">
              zylo
            </span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="flex items-center bg-ink-50 rounded-xl overflow-hidden border border-transparent focus-within:border-brand-300 focus-within:bg-white focus-within:shadow-glow transition-all duration-200">
              <Search size={17} className="ml-3.5 text-ink-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, brands and more..."
                className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-ink-400"
              />
              <button
                type="submit"
                className="px-4 self-stretch flex items-center justify-center text-sm font-semibold text-brand-600 hover:bg-brand-50 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50 transition-colors"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                    <User size={15} />
                  </span>
                  <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                </button>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-card border border-ink-100 py-2 z-20 animate-scaleIn origin-top-right">
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 transition-colors"
                      >
                        <User size={16} /> My Profile
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 transition-colors"
                      >
                        <PackageSearch size={16} /> My Orders
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 transition-colors"
                        >
                          <LayoutDashboard size={16} /> Admin Dashboard
                        </Link>
                      )}
                      <div className="my-1 border-t border-ink-100" />
                      <button
                        onClick={() => {
                          logout();
                          setProfileOpen(false);
                          navigate('/');
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-accent-600 hover:bg-accent-50 transition-colors"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-brand !px-5 !py-2">
                Login
              </Link>
            )}

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50 transition-colors"
            >
              <ShoppingBag size={19} />
              <span className="hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <span
                  className={`absolute -top-1 -right-1 bg-accent-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-soft ${
                    bump ? 'animate-pop' : ''
                  }`}
                >
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Category navigation row */}
      <CategoryNav />
    </header>
  );
}
