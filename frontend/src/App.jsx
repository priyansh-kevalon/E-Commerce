import { useEffect, useState } from 'react';
import AppRoutes from './routes/AppRoutes.jsx';
import AppLoader from './components/common/AppLoader.jsx';
import ScrollToTop from './components/common/ScrollToTop.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { useAuth } from './hooks/useAuth.js';

const MIN_SPLASH_MS = 1500;

function BootLoader() {
  const { initializing } = useAuth();
  const [playedMin, setPlayedMin] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setPlayedMin(true);
      return undefined;
    }
    const timer = window.setTimeout(() => setPlayedMin(true), MIN_SPLASH_MS);
    return () => window.clearTimeout(timer);
  }, []);

  // Keep the splash up only while the auth session is being restored and a
  // short branded minimum has elapsed, then let AppLoader fade out.
  return <AppLoader visible={initializing || !playedMin} duration={MIN_SPLASH_MS} />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BootLoader />
            <AppRoutes />
            <ScrollToTop />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;