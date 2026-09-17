import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import * as cartApi from '../services/cartService.js';
import { getEffectivePrice } from '../utils/helpers.js';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_CHARGE } from '../utils/constants.js';

const CartContext = createContext(null);

const STORAGE_KEY = 'velmora_cart';

const readStoredCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeStoredCart = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage unavailable (private mode, quota) - the in-memory cart still works.
  }
};

export function CartProvider({ children }) {
  const { isAuthenticated, initializing } = useAuth();
  const [items, setItems] = useState([]);
  const [syncing, setSyncing] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refresh = useCallback(() => setReloadKey((key) => key + 1), []);

  // Load the guest cart from storage, or the server cart (merging any guest
  // items into it first) once the user is authenticated.
  useEffect(() => {
    if (initializing) return undefined;
    let active = true;

    const load = async () => {
      setError(null);

      if (!isAuthenticated) {
        setItems(readStoredCart());
        setSyncing(false);
        return;
      }

      setSyncing(true);
      try {
        const guestItems = readStoredCart();
        for (const item of guestItems) {
          if (item?.product?._id) {
            try {
              await cartApi.addCartItem(item.product._id, item.quantity);
            } catch {
              // Skip a line that can no longer be added (e.g. deleted product).
            }
          }
        }
        if (guestItems.length) writeStoredCart([]);

        const serverItems = await cartApi.fetchCart();
        if (active) setItems(serverItems);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setSyncing(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [isAuthenticated, initializing, reloadKey]);

  // Only guests persist to localStorage; server carts live in the database.
  useEffect(() => {
    if (!isAuthenticated && !syncing) {
      writeStoredCart(items);
    }
  }, [items, isAuthenticated, syncing]);

  const addItem = useCallback(
    async (product, quantity = 1) => {
      if (!product?._id) return;
      const maxStock = Number(product.stock) || 0;
      if (maxStock <= 0) return;

      if (isAuthenticated) {
        try {
          setItems(await cartApi.addCartItem(product._id, quantity));
        } catch (err) {
          setError(err.message);
        }
        return;
      }

      setItems((prev) => {
        const existing = prev.find((item) => item.product._id === product._id);
        if (existing) {
          return prev.map((item) =>
            item.product._id === product._id
              ? { ...item, quantity: Math.min(item.quantity + quantity, maxStock) }
              : item
          );
        }
        return [...prev, { product, quantity: Math.min(Math.max(1, quantity), maxStock) }];
      });
    },
    [isAuthenticated]
  );

  const removeItem = useCallback(
    async (productId) => {
      if (isAuthenticated) {
        try {
          setItems(await cartApi.removeCartItem(productId));
        } catch (err) {
          setError(err.message);
        }
        return;
      }
      setItems((prev) => prev.filter((item) => item.product._id !== productId));
    },
    [isAuthenticated]
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      const next = Math.max(0, Number(quantity) || 0);

      if (isAuthenticated) {
        try {
          setItems(await cartApi.updateCartItem(productId, next));
        } catch (err) {
          setError(err.message);
        }
        return;
      }

      setItems((prev) =>
        prev.map((item) => {
          if (item.product._id !== productId) return item;
          const maxStock = Number(item.product.stock) || 1;
          return { ...item, quantity: Math.max(1, Math.min(next || 1, maxStock)) };
        })
      );
    },
    [isAuthenticated]
  );

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        setItems(await cartApi.clearCartRequest());
      } catch (err) {
        setError(err.message);
      }
      return;
    }
    setItems([]);
  }, [isAuthenticated]);

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + getEffectivePrice(item.product) * item.quantity, 0),
    [items]
  );

  const shippingCost = useMemo(() => {
    if (!items.length) return 0;
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  }, [items.length, subtotal]);

  const total = subtotal + shippingCost;

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      refresh,
      totalItems,
      subtotal,
      shippingCost,
      total,
      syncing,
      error,
    }),
    [
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      refresh,
      totalItems,
      subtotal,
      shippingCost,
      total,
      syncing,
      error,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
