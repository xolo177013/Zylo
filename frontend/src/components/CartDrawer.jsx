import { Link } from 'react-router-dom';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { items, subtotal, isDrawerOpen, setIsDrawerOpen, updateQuantity, removeItem } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-[2px] animate-fadeIn"
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer panel */}
      <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-[fadeInUp_0.35s_cubic-bezier(0.16,1,0.3,1)_both]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100">
          <h2 className="text-lg font-display font-bold text-ink-900 flex items-center gap-2">
            <ShoppingBag size={19} className="text-brand-600" /> My Cart ({items.length})
          </h2>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-1.5 rounded-full hover:bg-ink-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-4">
          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-2">
              <ShoppingBag size={40} className="text-ink-200" />
              <p className="text-ink-400">Your cart is empty.</p>
            </div>
          )}
          {items.map((item) => (
            <div key={item._id} className="flex gap-3 border-b border-ink-100 pb-4">
              <div className="w-16 h-16 shrink-0 rounded-xl bg-ink-50 flex items-center justify-center overflow-hidden">
                <img
                  src={item.product?.images?.[0]}
                  alt={item.product?.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-ink-800 line-clamp-2 font-medium">{item.product?.title}</p>
                <p className="text-sm font-bold text-ink-900 mt-1">₹{item.priceAtAddTime.toLocaleString('en-IN')}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="border border-ink-200 rounded-lg p-1 disabled:opacity-30 hover:border-brand-300 transition-colors"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="text-sm w-4 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="border border-ink-200 rounded-lg p-1 hover:border-brand-300 transition-colors"
                  >
                    <Plus size={13} />
                  </button>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="ml-auto text-ink-400 hover:text-accent-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-ink-100 space-y-3">
            <div className="flex justify-between text-sm text-ink-500">
              <span>Subtotal</span>
              <span className="font-bold text-ink-900">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <Link
              to="/checkout"
              onClick={() => setIsDrawerOpen(false)}
              className="btn-accent w-full !py-2.5"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
