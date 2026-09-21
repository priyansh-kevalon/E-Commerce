import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Headphones,
  Heart,
  Home,
  Info,
  LayoutGrid,
  LogOut,
  Menu,
  Package,
  RotateCcw,
  Search,
  ShoppingCart,
  Sparkles,
  Store,
  Tag,
  TrendingUp,
  User,
  X,
} from 'lucide-react';
import { APP_NAME } from '../../utils/constants.js';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { fetchCategories } from '../../services/productService.js';

const PRODUCT_COLLECTIONS = [
  { to: '/products', label: 'All Products' },
  { to: '/deals', label: "Today's Deals" },
  { to: '/new-arrivals', label: 'New Arrivals' },
  { to: '/best-sellers', label: 'Best Sellers' },
];

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
];

const PRODUCT_MENU_PATHS = ['/products', '/deals', '/new-arrivals', '/best-sellers'];

const isItemActive = (item, pathname) =>
  item.to === '/'
    ? pathname === '/'
    : item.to === '/products'
      ? PRODUCT_MENU_PATHS.includes(pathname)
      : pathname === item.to;

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems: cartCount } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin, isSeller, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const acctRef = useRef(null);

  const firstName = user?.name?.split(' ')[0];

  useEffect(() => {
    let active = true;
    fetchCategories({ withCount: true, status: 'active' })
      .then((list) => {
        if (active) setCategories(list);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (event) => {
      if (acctRef.current && !acctRef.current.contains(event.target)) setAcctOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setAcctOpen(false);
        setDrawerOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    setAcctOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawerOpen]);

  const runSearch = (event) => {
    event.preventDefault();
    const term = search.trim();
    const next = new URLSearchParams();
    if (term) next.set('search', term);
    navigate(`/products${next.toString() ? `?${next.toString()}` : ''}`);
    setSearch('');
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
    setAcctOpen(false);
    navigate('/');
  };

  const searchBar = (
    <form
      onSubmit={runSearch}
      className="flex h-11 w-full items-center overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-600"
    >
      <span className="flex shrink-0 pl-4 pr-2 text-slate-400">
        <Search size={18} />
      </span>
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search for products, brands and more"
        className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500"
      />
      <button
        type="submit"
        aria-label="Search"
        className="flex h-full shrink-0 items-center justify-center gap-1.5 rounded-r-full bg-brand-700 px-4 text-sm font-semibold text-white transition hover:bg-brand-800 active:brightness-90 sm:px-5"
      >
        <Search size={16} />
        <span className="hidden sm:inline">Search</span>
      </button>
    </form>
  );

  return (
    <header
      className={`sticky top-0 z-40 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-lg shadow-slate-900/[0.08]' : 'shadow-sm'
      }`}
    >
      {/* Row 1: brand + search + actions */}
      <div className="border-b border-slate-100">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-2 px-3 sm:h-[72px] sm:gap-4 sm:px-5">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            className="-ml-1 shrink-0 rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 active:scale-95 lg:hidden"
          >
            <Menu size={24} />
          </button>

          <Link to="/" className="group flex shrink-0 items-center gap-2.5" aria-label={`${APP_NAME} home`}>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-800 to-ink text-lg font-extrabold text-white shadow-card transition group-hover:scale-105 group-hover:shadow-glow sm:h-11 sm:w-11">
              V
            </span>
            <span className="hidden sm:block">
              <span className="block font-display text-xl font-extrabold leading-none tracking-tight text-slate-900 transition group-hover:text-brand-800 sm:text-[22px]">
                {APP_NAME}
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-600">
                Everything Store <span className="text-slate-300">·</span>{' '}
                <span className="text-amber-500">Explore Plus</span>
              </span>
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 justify-center md:flex">
            <div className="w-full max-w-[620px]">{searchBar}</div>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <Link
              to="/register"
              className="hidden h-10 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-brand-700 xl:flex"
            >
              <Store size={18} /> Become a Seller
            </Link>

            <div className="relative" ref={acctRef}>
              <button
                type="button"
                onClick={() => setAcctOpen((open) => !open)}
                aria-expanded={acctOpen}
                className={`flex h-10 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold transition active:scale-95 ${
                  acctOpen
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-slate-300 text-slate-700 hover:border-brand-500 hover:text-brand-700'
                }`}
              >
                <User size={18} />
                <span className="hidden sm:inline">
                  {isAuthenticated ? `Hello, ${firstName || 'there'}` : 'Login'}
                </span>
                <ChevronDown size={14} className={`hidden transition-transform sm:block ${acctOpen ? 'rotate-180' : ''}`} />
              </button>

              {acctOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-60 animate-fade-in rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-luxe">
                  {isAuthenticated ? (
                    <>
                      <p className="px-3 pb-2 pt-1 text-xs text-slate-500">
                        Signed in as <span className="font-semibold text-slate-800">{user?.name}</span>
                      </p>
                      <Link
                        to="/profile"
                        onClick={() => setAcctOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100"
                      >
                        <User size={16} /> Your account
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setAcctOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100"
                      >
                        <Package size={16} /> Your orders
                      </Link>
                      {isSeller && (
                        <Link
                          to="/seller"
                          onClick={() => setAcctOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100"
                        >
                          <Store size={16} /> Seller center
                        </Link>
                      )}
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setAcctOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100"
                        >
                          <LayoutGrid size={16} /> Admin dashboard
                        </Link>
                      )}
                      <div className="my-1 h-px bg-slate-100" />
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut size={16} /> Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setAcctOpen(false)}
                        className="block rounded-lg bg-gradient-to-r from-brand-700 to-brand-800 px-3 py-2 text-center text-sm font-bold text-white shadow-glow transition hover:brightness-110"
                      >
                        Sign in
                      </Link>
                      <p className="mt-2 px-1 text-center text-xs text-slate-500">
                        New customer?{' '}
                        <Link
                          to="/register"
                          onClick={() => setAcctOpen(false)}
                          className="font-semibold text-brand-700 hover:underline"
                        >
                          Create an account
                        </Link>
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative flex h-10 items-center gap-1.5 rounded-full px-3 text-slate-700 transition hover:bg-slate-100 hover:text-brand-700 active:scale-95"
            >
              <Heart size={19} />
              <span className="hidden text-sm font-semibold lg:inline">Wishlist</span>
              {wishlistCount > 0 && (
                <span
                  key={wishlistCount}
                  className="absolute right-0.5 top-0.5 flex min-w-[18px] animate-badge items-center justify-center rounded-full bg-brand-800 px-1 text-[10px] font-bold leading-[18px] text-white"
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              aria-label={`Cart with ${cartCount} items`}
              className="relative flex h-10 items-center gap-1.5 rounded-full px-3.5 text-slate-800 transition hover:bg-slate-100 hover:text-brand-700 active:scale-95"
            >
              <ShoppingCart size={20} />
              <span className="hidden text-sm font-semibold sm:inline">Cart</span>
              {cartCount > 0 && (
                <span
                  key={cartCount}
                  className="flex h-5 min-w-[20px] animate-badge items-center justify-center rounded-full bg-brand-700 px-1.5 text-[11px] font-extrabold leading-none text-white"
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="px-3 pb-3 md:hidden">{searchBar}</div>
      </div>

      {/* Row 2: nav links */}
      <div className="border-b border-slate-100 bg-white">
        <div className="no-scrollbar mx-auto flex h-[52px] max-w-[1600px] items-center justify-center gap-0.5 overflow-x-auto px-3 sm:px-5">
          {NAV_ITEMS.map((item) => {
            const isActive = isItemActive(item, location.pathname);
            return (
              <Link
                key={item.label}
                to={item.to}
                aria-current={isActive ? 'page' : undefined}
                className={`shrink-0 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-brand-700'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:absolute lg:inset-x-0 lg:top-full">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 animate-fade-in bg-ink/70 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 flex h-full w-[88%] max-w-sm animate-drawer flex-col overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-ink px-5 py-4 text-white">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-700">
                  <User size={17} />
                </span>
                <span className="text-sm font-bold">Hello {firstName || 'there'}</span>
              </div>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg p-1.5 transition hover:bg-white/10 active:scale-95"
              >
                <X size={20} />
              </button>
            </div>

            <p className="bg-mid px-5 py-2 text-sm font-bold text-white">Shop by department</p>
            <nav className="p-2">
              {PRODUCT_COLLECTIONS.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setDrawerOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition hover:bg-brand-50 hover:text-brand-800 ${
                    item.label === 'All Products'
                      ? 'font-semibold text-slate-800'
                      : 'font-medium text-slate-700'
                  }`}
                >
                  {item.label === 'All Products' && <Home size={17} className="text-slate-400" />}
                  {item.label === "Today's Deals" && <Tag size={17} className="text-slate-400" />}
                  {item.label === 'New Arrivals' && <Sparkles size={17} className="text-slate-400" />}
                  {item.label === 'Best Sellers' && <TrendingUp size={17} className="text-slate-400" />}
                  {item.label}
                </Link>
              ))}
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/products?category=${encodeURIComponent(category.name)}`}
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-brand-50 hover:text-brand-800"
                >
                  {category.name}
                  <span className="text-xs text-slate-400">{category.productCount ?? 0}</span>
                </Link>
              ))}
            </nav>

            <p className="bg-mid px-5 py-2 text-sm font-bold text-white">Help &amp; Settings</p>
            <nav className="p-2">
              <Link
                to="/wishlist"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-800"
              >
                <Heart size={17} className="text-slate-400" /> Your Wishlist
              </Link>
              <Link
                to="/orders"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-800"
              >
                <Package size={17} className="text-slate-400" /> Your Orders
              </Link>
              {isSeller && (
                <Link
                  to="/seller"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-800"
                >
                  <Store size={17} className="text-slate-400" /> Seller Center
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-800"
                >
                  <LayoutGrid size={17} className="text-slate-400" /> Admin Dashboard
                </Link>
              )}
              <Link
                to="/contact"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-800"
              >
                <Headphones size={17} className="text-slate-400" /> Help Centre
              </Link>
              <Link
                to="/about"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-800"
              >
                <Info size={17} className="text-slate-400" /> About Us
              </Link>
              <Link
                to="/orders"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-800"
              >
                <RotateCcw size={17} className="text-slate-400" /> Returns
              </Link>
            </nav>

            <div className="mt-auto border-t border-slate-200 p-4">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={16} /> Sign out
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setDrawerOpen(false)}
                    className="rounded-lg border border-slate-300 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setDrawerOpen(false)}
                    className="rounded-lg bg-gradient-to-r from-brand-700 to-brand-800 py-2.5 text-center text-sm font-bold text-white transition hover:brightness-110"
                  >
                    Register
                  </Link>
                </div>
              )}
              <p className="mt-3 text-center text-[11px] text-slate-400">
                &copy; {new Date().getFullYear()} {APP_NAME}
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}