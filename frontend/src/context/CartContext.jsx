import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getCartApi, addToCartApi, updateCartItemApi, removeCartItemApi, clearCartApi } from '../api/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [] });
      return;
    }
    try {
      setLoading(true);
      const { data } = await getCartApi();
      setCart(data);
    } catch (err) {
      // Silently ignore - user may not be logged in yet
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      if (!isAuthenticated) {
        toast.error('Please log in to add items to your cart');
        return;
      }
      try {
        const { data } = await addToCartApi(productId, quantity);
        setCart(data);
        setIsDrawerOpen(true);
        toast.success('Added to cart');
      } catch (err) {
        toast.error(err.message || 'Could not add item to cart');
      }
    },
    [isAuthenticated]
  );

  const updateQuantity = useCallback(async (itemId, quantity) => {
    try {
      const { data } = await updateCartItemApi(itemId, quantity);
      setCart(data);
    } catch (err) {
      toast.error(err.message || 'Could not update quantity');
    }
  }, []);

  const removeItem = useCallback(async (itemId) => {
    try {
      const { data } = await removeCartItemApi(itemId);
      setCart(data);
      toast.success('Item removed');
    } catch (err) {
      toast.error(err.message || 'Could not remove item');
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      await clearCartApi();
      setCart({ items: [] });
    } catch (err) {
      toast.error(err.message || 'Could not clear cart');
    }
  }, []);

  const value = {
    cart,
    items: cart.items || [],
    totalItems: cart.totalItems || 0,
    subtotal: cart.subtotal || 0,
    loading,
    isDrawerOpen,
    setIsDrawerOpen,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};
