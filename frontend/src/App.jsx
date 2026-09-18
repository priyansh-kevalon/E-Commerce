import { useEffect, useState } from 'react';
import AppRoutes from './routes/AppRoutes.jsx';
import AppLoader from './components/common/AppLoader.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';

const LOADER_DURATION = 3000;

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const delay = reduced ? 500 : LOADER_DURATION;
    const timer = window.setTimeout(() => setLoading(false), delay);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <AppLoader visible={loading} duration={LOADER_DURATION} />
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppRoutes />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App;