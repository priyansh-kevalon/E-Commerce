import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import * as wishlistApi from '../services/wishlistService.js';

const WishlistContext = createContext(null);

const STORAGE_KEY = 'velmora_wishlist';

const readStoredWishlist = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeStoredWishlist = (products) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch {
    // Storage unavailable - the in-memory wishlist still works.
  }
};

export function WishlistProvider({ children }) {
  const { isAuthenticated, initializing } = useAuth();
  const [products, setProducts] = useState([]);
  const [syncing, setSyncing] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refresh = useCallback(() => setReloadKey((key) => key + 1), []);

  // Load the guest wishlist, or the server wishlist (merging guest picks first)
  // once the user is authenticated.
  useEffect(() => {
    if (initializing) return undefined;
    let active = true;

    const load = async () => {
      setError(null);

      if (!isAuthenticated) {
        setProducts(readStoredWishlist());
        setSyncing(false);
        return;
      }

      setSyncing(true);
      try {
        const guestProducts = readStoredWishlist();
        for (const product of guestProducts) {
          if (product?._id) {
            try {
              await wishlistApi.addWishlistItem(product._id);
            } catch {
              // Ignore products that no longer exist.
            }
          }
        }
        if (guestProducts.length) writeStoredWishlist([]);

        const serverProducts = await wishlistApi.fetchWishlist();
        if (active) setProducts(serverProducts);
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

  // Only guests persist to localStorage; server wishlists live in the database.
  useEffect(() => {
    if (!isAuthenticated && !syncing) {
      writeStoredWishlist(products);
    }
  }, [products, isAuthenticated, syncing]);

  const isWishlisted = useCallback(
    (productId) => products.some((product) => product._id === productId),
    [products]
  );

  const toggleWishlist = useCallback(
    async (product) => {
      if (!product?._id) return;
      const alreadySaved = products.some((item) => item._id === product._id);

      if (isAuthenticated) {
        try {
          setProducts(
            alreadySaved
              ? await wishlistApi.removeWishlistItem(product._id)
              : await wishlistApi.addWishlistItem(product._id)
          );
        } catch (err) {
          setError(err.message);
        }
        return;
      }

      setProducts((prev) =>
        prev.some((item) => item._id === product._id)
          ? prev.filter((item) => item._id !== product._id)
          : [...prev, product]
      );
    },
    [isAuthenticated, products]
  );

  const removeFromWishlist = useCallback(
    async (productId) => {
      if (isAuthenticated) {
        try {
          setProducts(await wishlistApi.removeWishlistItem(productId));
        } catch (err) {
          setError(err.message);
        }
        return;
      }
      setProducts((prev) => prev.filter((product) => product._id !== productId));
    },
    [isAuthenticated]
  );

  const clearWishlist = useCallback(async () => {
    if (isAuthenticated) {
      try {
        for (const product of products) {
          await wishlistApi.removeWishlistItem(product._id);
        }
        setProducts([]);
      } catch (err) {
        setError(err.message);
      }
      return;
    }
    setProducts([]);
  }, [isAuthenticated, products]);

  const totalItems = useMemo(() => products.length, [products]);

  const value = useMemo(
    () => ({
      products,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist,
      refresh,
      totalItems,
      syncing,
      error,
    }),
    [
      products,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist,
      refresh,
      totalItems,
      syncing,
      error,
    ]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;
