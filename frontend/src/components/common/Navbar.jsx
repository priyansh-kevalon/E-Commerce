import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Boxes,
  ChevronDown,
  ChevronRight,
  Headphones,
  Heart,
  Home,
  LayoutGrid,
  LogOut,
  MapPin,
  Menu,
  Package,
  RotateCcw,
  Search,
  ShoppingCart,
  Tag,
  TrendingUp,
  Truck,
  User,
  X,
} from 'lucide-react';
import { APP_NAME } from '../../utils/constants.js';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { fetchCategories } from '../../services/productService.js';

const NAV_LINKS = [
  {
    to: '/products?featured=true',
    label: "Today's Deals",
    isActive: (params) => params.get('featured') === 'true',
  },
  {
    to: '/products?sort=newest',
    label: 'New Arrivals',
    isActive: (params) => params.get('sort') === 'newest',
  },
  {
    to: '/products?sort=popular',
    label: 'Best Sellers',
    isActive: (params) => params.get('sort') === 'popular',
  },
  {
    to: '/products',
    label: 'All Products',
    isActive: (params) =>
      !params.has('featured') &&
      !params.has('sort') &&
      !params.has('category') &&
      !params.has('search'),
  },
];

const UTILITY_LINKS = [
  { to: '/products?featured=true', label: 'Offers' },
  { to: '/orders', label: 'Track Order' },
  { to: '/wishlist', label: 'Wishlist' },
  { to: '/profile', label: 'Help' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems: cartCount } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const [deptsOpen, setDeptsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const acctRef = useRef(null);
  const deptsRef = useRef(null);
  const deptsTimer = useRef(null);

  const params = new URLSearchParams(location.search);
  const activeCategory = params.get('category');
  const firstName = user?.name?.split(' ')[0];

  useEffect(() => {
    let active = true;
    fetchCategories({ status: 'active' })
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
      if (deptsRef.current && !deptsRef.current.contains(event.target)) setDeptsOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setAcctOpen(false);
        setDeptsOpen(false);
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
    setDeptsOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawerOpen]);

  const openDepts = () => {
    clearTimeout(deptsTimer.current);
    setDeptsOpen(true);
  };

  const closeDepts = () => {
    clearTimeout(deptsTimer.current);
    deptsTimer.current = setTimeout(() => setDeptsOpen(false), 180);
  };

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
      className="flex h-10 w-full items-stretch overflow-hidden rounded-lg border border-slate-300 bg-white transition focus-within:border-brand-700 focus-within:ring-2 focus-within:ring-brand-100"
    >
      <span className="flex items-center pl-3 text-slate-400">
        <Search size={17} />
      </span>
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search products, brands and categories"
        className="min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
      />
      <button
        type="submit"
        aria-label="Search"
        className="flex w-14 shrink-0 items-center justify-center bg-brand-800 text-white transition hover:bg-brand-900 active:brightness-90"
      >
        <Search size={18} />
      </button>
    </form>
  );

  return (
    <header
      className={`sticky top-0 z-40 transition-shadow duration-300 ${
        scrolled ? 'shadow-lg shadow-slate-900/[0.08]' : 'shadow-sm'
      }`}
    >
      {/* Tier 1: utility strip (collapses on scroll) */}
      <div
        className={`overflow-hidden bg-ink text-slate-300 transition-all duration-300 ${
          scrolled ? 'max-h-0' : 'max-h-12'
        }`}
      >
        <div className="mx-auto flex h-9 max-w-[1600px] items-center justify-between gap-4 px-3 text-[12px] sm:px-5">
          <div className="flex min-w-0 items-center gap-1.5">
            <MapPin size={13} className="shrink-0 text-accent-400" />
            <span className="text-slate-400">Deliver to</span>
            <span className="truncate font-semibold text-white">{firstName || 'you'}</span>
            <span className="hidden text-slate-400 sm:inline">· Ahmedabad 380001</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-1.5 font-medium text-accent-300 md:inline-flex">
              <Truck size={13} /> Free delivery over Rs.999
            </span>
            {UTILITY_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="hidden text-slate-300 transition hover:text-white sm:inline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Tier 2: main bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-2 px-3 sm:gap-4 sm:px-5">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            className="-ml-1 rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 active:scale-95 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <Link to="/" className="group flex shrink-0 items-center gap-2.5" aria-label={`${APP_NAME} home`}>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-800 to-ink text-lg font-extrabold text-white shadow-card transition group-hover:scale-105 group-hover:shadow-glow">
              V
            </span>
            <span className="hidden sm:block">
              <span className="block font-display text-xl font-extrabold leading-none tracking-tight text-slate-900 transition group-hover:text-brand-800">
                {APP_NAME}
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-600">
                Everything Store
              </span>
            </span>
          </Link>

          <div
            ref={deptsRef}
            className="relative hidden lg:block"
            onMouseEnter={openDepts}
            onMouseLeave={closeDepts}
          >
            <button
              type="button"
              onClick={() => setDeptsOpen((open) => !open)}
              aria-expanded={deptsOpen}
              className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition active:scale-95 ${
                deptsOpen
                  ? 'border-brand-700 bg-brand-50 text-brand-800'
                  : 'border-slate-300 text-slate-700 hover:border-brand-700 hover:text-brand-800'
              }`}
            >
              <LayoutGrid size={16} /> All Departments
              <ChevronDown size={14} className={`transition-transform ${deptsOpen ? 'rotate-180' : ''}`} />
            </button>

            {deptsOpen && (
              <div className="absolute left-0 top-full z-50 mt-2 w-[360px] animate-fade-in rounded-xl border border-slate-200 bg-white p-2 shadow-luxe">
                <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Browse departments
                </p>
                <Link
                  to="/products"
                  onClick={() => setDeptsOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg bg-gradient-to-r from-brand-800 to-brand-700 px-3 py-2.5 text-sm font-bold text-white shadow-glow transition hover:brightness-110"
                >
                  <Boxes size={16} /> Shop all products
                  <ChevronRight size={15} className="ml-auto" />
                </Link>
                <div className="my-1.5 h-px bg-slate-100" />
                {categories.length > 0 ? (
                  <div className="grid grid-cols-2 gap-0.5 pb-1">
                    {categories.map((category) => (
                      <Link
                        key={category._id}
                        to={`/products?category=${encodeURIComponent(category.name)}`}
                        onClick={() => setDeptsOpen(false)}
                        className="group/row flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-brand-50 hover:text-brand-800"
                      >
                        <span className="truncate">{category.name}</span>
                        <span className="shrink-0 text-xs text-slate-400 group-hover/row:text-brand-500">
                          {category.productCount ?? 0}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="px-3 py-4 text-sm text-slate-400">Loading departments…</p>
                )}
              </div>
            )}
          </div>

          <div className="hidden min-w-0 flex-1 md:block">{searchBar}</div>

          <div className="ml-auto flex items-center gap-0.5 sm:gap-1.5">
            <div className="relative" ref={acctRef}>
              <button
                type="button"
                onClick={() => setAcctOpen((open) => !open)}
                aria-expanded={acctOpen}
                className={`flex items-center gap-2 rounded-lg px-2 py-2 transition active:scale-95 ${
                  acctOpen ? 'bg-slate-100' : 'hover:bg-slate-100'
                }`}
              >
                <User size={22} />
                <span className="hidden text-left leading-tight sm:block">
                  <span className="block text-[11px] text-slate-400">
                    Hello, {firstName || 'sign in'}
                  </span>
                  <span className="flex items-center gap-1 text-[13px] font-bold text-slate-800">
                    Account <ChevronDown size={13} className={`transition-transform ${acctOpen ? 'rotate-180' : ''}`} />
                  </span>
                </span>
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
              className="relative rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 active:scale-95"
            >
              <Heart size={22} />
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
              className="relative flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-800 to-brand-700 px-3 py-2 text-white shadow-glow transition hover:brightness-110 active:scale-95"
            >
              <span className="relative">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span
                    key={cartCount}
                    className="absolute -right-2.5 -top-2 flex min-w-[18px] animate-badge items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold leading-[18px] text-ink ring-2 ring-white"
                  >
                    {cartCount}
                  </span>
                )}
              </span>
              <span className="hidden text-sm font-semibold sm:inline">Cart</span>
            </Link>
          </div>
        </div>

        <div className="px-3 pb-3 md:hidden">{searchBar}</div>
      </div>

      {/* Tier 3: departments band */}
      <div className="hidden bg-mid text-slate-200 lg:block">
        <div className="mx-auto flex h-11 max-w-[1600px] items-center gap-1 px-3 text-[13px] sm:px-5">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex h-11 items-center gap-2 border-r border-white/10 pr-3 font-bold text-white transition hover:text-accent-300"
          >
            <Menu size={16} /> All Departments
          </button>
          {NAV_LINKS.map((link) => {
            const isActive = link.isActive(params);
            return (
              <Link
                key={link.label}
                to={link.to}
                aria-current={isActive ? 'page' : undefined}
                className={`rounded px-3 py-1.5 font-medium transition ${
                  isActive
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {categories.slice(0, 5).map((category) => {
            const isActive = activeCategory === category.name;
            return (
              <Link
                key={category._id}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                aria-current={isActive ? 'page' : undefined}
                className={`rounded px-3 py-1.5 transition ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {category.name}
              </Link>
            );
          })}
          <Link
            to="/products?featured=true"
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-accent-500 px-3 py-1.5 text-xs font-bold text-ink transition hover:bg-accent-400 active:scale-95"
          >
            <Tag size={14} /> Today&apos;s Deals
          </Link>
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
              <Link
                to="/products"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-brand-50 hover:text-brand-800"
              >
                <Home size={17} className="text-slate-400" /> All Products
              </Link>
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
                to="/products?featured=true"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-800"
              >
                <Tag size={17} className="text-slate-400" /> Today&apos;s Deals
              </Link>
              <Link
                to="/products?sort=popular"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-800"
              >
                <TrendingUp size={17} className="text-slate-400" /> Best Sellers
              </Link>
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
                to="/profile"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-800"
              >
                <Headphones size={17} className="text-slate-400" /> Help Centre
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