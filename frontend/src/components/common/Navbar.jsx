import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight,
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
  { to: '/products', label: 'All Products', icon: Home },
  { to: '/deals', label: "Today's Deals", icon: Tag },
  { to: '/new-arrivals', label: 'New Arrivals', icon: Sparkles },
  { to: '/best-sellers', label: 'Best Sellers', icon: TrendingUp },
];

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Shop', dropdown: true },
  { to: '/deals', label: 'Deals' },
  { to: '/contact', label: 'Contact' },
];

const PRODUCT_MENU_PATHS = ['/products', '/new-arrivals', '/best-sellers'];

const isItemActive = (item, pathname, search) => {
  if (item.to === '/') return pathname === '/';
  if (item.to === '/products') return PRODUCT_MENU_PATHS.includes(pathname);
  return pathname === item.to;
};

// Drawer rows are separate entries, so they match exactly (plus nested dashboard
// routes) rather than sharing the desktop dropdown's grouped match.
const isLinkActive = (to, pathname) =>
  pathname === to || pathname.startsWith(`${to}/`);

const drawerRowClass = (active) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
    active
      ? 'bg-brand-800 font-bold text-white shadow-sm'
      : 'font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-800 active:bg-brand-50 active:text-brand-800'
  }`;

const drawerIconClass = (active) =>
  active ? 'shrink-0 text-white' : 'shrink-0 text-slate-400';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems: cartCount } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin, isSeller, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const acctRef = useRef(null);
  const catRef = useRef(null);

  const firstName = user?.name?.split(' ')[0];

  useEffect(() => {
    let active = true;
    fetchCategories({ withCount: true, status: 'active' })
      .then((list) => {
        if (active) setCategories(list);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setCategoriesLoading(false);
      });
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
      if (catRef.current && !catRef.current.contains(event.target)) {
        setCatOpen(false);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setAcctOpen(false);
        setDrawerOpen(false);
        setCatOpen(false);
        setSearchOpen(false);
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
    setCatOpen(false);
    setDrawerOpen(false);
    setSearchOpen(false);
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
    setSearchOpen(false);
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
      className="flex h-9 w-full items-center overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-secondary-500"
    >
      <span className="flex shrink-0 pl-3.5 pr-1.5 text-slate-400">
        <Search size={16} />
      </span>
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search for products, brands and more"
        className="min-w-0 flex-1 bg-transparent text-[13px] text-slate-900 outline-none placeholder:text-slate-400"
      />
      <button
        type="submit"
        aria-label="Search"
        className="flex h-full shrink-0 items-center justify-center gap-1.5 rounded-r-full bg-secondary-700 px-3 text-[13px] font-semibold text-white transition hover:bg-secondary-800 active:brightness-90 sm:px-4"
      >
        <Search size={14} />
        <span className="hidden sm:inline">Search</span>
      </button>
    </form>
  );

  return (
    <header
      className={`relative sticky top-0 z-40 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-lg shadow-secondary-900/10' : 'shadow-sm'
      }`}
    >
      {/* Main nav row */}
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-1.5 px-3 sm:gap-2 sm:px-5 lg:h-[76px]">
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
              className="-ml-1 shrink-0 rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 active:scale-95 lg:hidden"
            >
              <Menu size={24} />
            </button>

            <Link
              to="/"
              className="group flex shrink-0 items-center gap-2.5"
              aria-label={`${APP_NAME} home`}
            >
              <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-400 via-brand-600 to-brand-800 text-lg font-extrabold text-white shadow-card ring-1 ring-brand-200 transition duration-300 group-hover:-rotate-3 group-hover:scale-105 group-hover:shadow-brand-glow sm:h-11 sm:w-11">
                <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.45),transparent_55%)]" />
                <Sparkles size={15} className="relative z-10 text-accent-300 drop-shadow-[0_0_6px_rgba(245,158,11,0.9)]" />
                V
              </span>
              <span className="hidden sm:block">
                <span className="block font-display text-xl font-extrabold leading-none tracking-tight text-slate-900 transition group-hover:text-brand-900 sm:text-[22px]">
                  {APP_NAME}
                </span>
              </span>
            </Link>
          </div>

          {/* Centered nav (desktop) */}
          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex xl:gap-1.5">
            {NAV_ITEMS.map((item, position) => {
              const isActive = isItemActive(item, location.pathname, location.search);

              if (item.dropdown) {
                return (
                  <div
                    key={item.label}
                    ref={catRef}
                    onMouseEnter={() => setCatOpen(true)}
                    onMouseLeave={() => setCatOpen(false)}
                    className="relative flex shrink-0 items-center"
                  >
                    {position > 0 && <span aria-hidden="true" className="w-2 shrink-0" />}
                    <div
                      className={`flex items-center rounded-lg text-sm font-semibold transition ${
                        isActive
                          ? 'bg-brand-800 font-bold text-white shadow-sm'
                          : 'text-slate-800 hover:bg-brand-50 hover:text-brand-800'
                      }`}
                    >
                      <Link to={item.to} className="shrink-0 px-3.5 py-2">
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setCatOpen((open) => !open);
                        }}
                        aria-label={`Toggle ${item.label} categories`}
                        aria-expanded={catOpen}
                        aria-haspopup="menu"
                        className="flex shrink-0 items-center self-stretch pr-2.5 pl-1 transition hover:opacity-80"
                      >
                        <span
                          className={`inline-block transition-transform ${catOpen ? 'rotate-180' : ''}`}
                        >
                          <ChevronDown size={14} />
                        </span>
                      </button>
                    </div>

                    {catOpen && (
                      <div className="absolute left-0 top-full z-50 w-64 pt-2">
                        <div
                          role="menu"
                          className="animate-fade-in rounded-2xl border border-secondary-100 bg-white p-2 shadow-luxe"
                        >
                        <Link
                          to="/products"
                          onClick={() => setCatOpen(false)}
                          className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-bold text-slate-800 transition hover:bg-secondary-50 hover:text-secondary-800"
                        >
                          All Products
                          <ChevronRight size={15} className="text-slate-400" />
                        </Link>
                        <div className="my-1 h-px bg-slate-100" />
                        {categoriesLoading ? (
                          <div className="space-y-1 py-1" aria-hidden="true">
                            {Array.from({ length: 4 }).map((_, index) => (
                              <div
                                key={`cat-skeleton-${index}`}
                                className="flex items-center justify-between gap-3 rounded-xl px-3 py-2"
                              >
                                <div className="skeleton h-4 w-3/4 rounded" />
                                <div className="skeleton h-4 w-7 rounded-full" />
                              </div>
                            ))}
                          </div>
                        ) : categories.length ? (
                          <div className="max-h-[45vh] overflow-y-auto">
                            {categories.map((category) => (
                              <Link
                                key={category._id}
                                to={`/products?category=${encodeURIComponent(category.name)}`}
                                onClick={() => setCatOpen(false)}
                                className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-secondary-50 hover:text-secondary-800"
                              >
                                <span className="truncate">{category.name}</span>
                                <span className="rounded-full bg-secondary-50 px-2 py-0.5 text-[11px] font-bold text-secondary-700">
                                  {category.productCount ?? 0}
                                </span>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <p className="px-3 py-2 text-xs text-slate-400">
                            Categories unavailable right now.
                          </p>
                        )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div key={item.label} className="flex shrink-0 items-center">
                  {position > 0 && <span aria-hidden="true" className="w-2 shrink-0" />}
                  <Link
                    to={item.to}
                    aria-current={isActive ? 'page' : undefined}
                    className={`shrink-0 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-brand-800 font-bold text-white shadow-sm'
                        : 'text-slate-800 hover:bg-brand-50 hover:text-brand-800'
                    }`}
                  >
                    {item.label}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Right: actions */}
          <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              aria-label="Toggle search"
              aria-expanded={searchOpen}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-brand-700 active:scale-95"
            >
              <Search size={18} />
            </button>

            <div className="relative" ref={acctRef}>
              <button
                type="button"
                onClick={() => setAcctOpen((open) => !open)}
                aria-expanded={acctOpen}
                className={`flex h-9 items-center gap-1.5 rounded-full border px-2.5 text-sm font-semibold transition active:scale-95 sm:h-10 sm:px-3.5 ${
                  acctOpen
                    ? 'border-brand-400 bg-brand-50 text-brand-700'
                    : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <User size={18} />
                <span className="hidden lg:inline">
                  {isAuthenticated ? `Hello, ${firstName || 'there'}` : 'Login'}
                </span>
                <ChevronDown size={14} className={`hidden transition-transform lg:block ${acctOpen ? 'rotate-180' : ''}`} />
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
              className="relative flex h-9 items-center gap-1.5 rounded-full px-2 text-slate-600 transition hover:bg-slate-100 hover:text-brand-700 active:scale-95 sm:h-10 sm:px-2.5"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span
                  key={wishlistCount}
                  className="absolute right-0.5 top-0.5 flex min-w-[18px] animate-badge items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold leading-[18px] text-white"
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              aria-label={`Cart with ${cartCount} items`}
              className="relative flex h-9 items-center gap-1.5 rounded-full px-2 text-slate-600 transition hover:bg-slate-100 hover:text-brand-700 active:scale-95 sm:h-10 sm:px-3"
            >
              <ShoppingCart size={21} />
              {cartCount > 0 && (
                <span
                  key={cartCount}
                  className="flex h-5 min-w-[20px] animate-badge items-center justify-center rounded-full bg-brand-600 px-1.5 text-[11px] font-extrabold leading-none text-white"
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-secondary-100 bg-white px-3 py-3 sm:px-5">
            <div className="ml-auto w-full max-w-[360px]">{searchBar}</div>
          </div>
        )}
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
              {PRODUCT_COLLECTIONS.map(({ icon: Icon, to, label }) => {
                const active = isLinkActive(to, location.pathname);

                return (
                  <Link
                    key={label}
                    to={to}
                    onClick={() => setDrawerOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={drawerRowClass(active)}
                  >
                    <Icon size={17} className={drawerIconClass(active)} />
                    {label}
                  </Link>
                );
              })}
            </nav>

            <p className="bg-mid px-5 py-2 text-sm font-bold text-white">Help &amp; Settings</p>
            <nav className="p-2">
              <Link
                to="/wishlist"
                onClick={() => setDrawerOpen(false)}
                aria-current={isLinkActive('/wishlist', location.pathname) ? 'page' : undefined}
                className={drawerRowClass(isLinkActive('/wishlist', location.pathname))}
              >
                <Heart size={17} className={drawerIconClass(isLinkActive('/wishlist', location.pathname))} /> Your Wishlist
              </Link>
              <Link
                to="/orders"
                onClick={() => setDrawerOpen(false)}
                aria-current={isLinkActive('/orders', location.pathname) ? 'page' : undefined}
                className={drawerRowClass(isLinkActive('/orders', location.pathname))}
              >
                <Package size={17} className={drawerIconClass(isLinkActive('/orders', location.pathname))} /> Your Orders
              </Link>
              {isSeller && (
                <Link
                  to="/seller"
                  onClick={() => setDrawerOpen(false)}
                  aria-current={isLinkActive('/seller', location.pathname) ? 'page' : undefined}
                  className={drawerRowClass(isLinkActive('/seller', location.pathname))}
                >
                  <Store size={17} className={drawerIconClass(isLinkActive('/seller', location.pathname))} /> Seller Center
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setDrawerOpen(false)}
                  aria-current={isLinkActive('/admin', location.pathname) ? 'page' : undefined}
                  className={drawerRowClass(isLinkActive('/admin', location.pathname))}
                >
                  <LayoutGrid size={17} className={drawerIconClass(isLinkActive('/admin', location.pathname))} /> Admin Dashboard
                </Link>
              )}
              <Link
                to="/contact"
                onClick={() => setDrawerOpen(false)}
                aria-current={isLinkActive('/contact', location.pathname) ? 'page' : undefined}
                className={drawerRowClass(isLinkActive('/contact', location.pathname))}
              >
                <Headphones size={17} className={drawerIconClass(isLinkActive('/contact', location.pathname))} /> Help Centre
              </Link>
              <Link
                to="/about"
                onClick={() => setDrawerOpen(false)}
                aria-current={isLinkActive('/about', location.pathname) ? 'page' : undefined}
                className={drawerRowClass(isLinkActive('/about', location.pathname))}
              >
                <Info size={17} className={drawerIconClass(isLinkActive('/about', location.pathname))} /> About Us
              </Link>
              <Link
                to="/orders"
                onClick={() => setDrawerOpen(false)}
                aria-current={isLinkActive('/orders', location.pathname) ? 'page' : undefined}
                className={drawerRowClass(isLinkActive('/orders', location.pathname))}
              >
                <RotateCcw size={17} className={drawerIconClass(isLinkActive('/orders', location.pathname))} /> Returns
              </Link>
            </nav>

            <div className="mt-auto border-t border-slate-200 p-4">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 active:bg-red-50"
                >
                  <LogOut size={16} /> Sign out
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setDrawerOpen(false)}
                    className="rounded-lg border border-slate-300 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100 active:bg-slate-100"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setDrawerOpen(false)}
                    className="rounded-lg bg-gradient-to-r from-brand-700 to-brand-800 py-2.5 text-center text-sm font-bold text-white transition hover:brightness-110 active:brightness-95"
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