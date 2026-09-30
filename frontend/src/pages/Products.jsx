import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  BadgePercent,
  ChevronLeft,
  ChevronRight,
  Home,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Tag,
  TrendingUp,
  Truck,
  X,
} from 'lucide-react';
import ProductList from '../components/product/ProductList.jsx';
import ProductFilter from '../components/product/ProductFilter.jsx';
import { fetchCategories, fetchProducts } from '../services/productService.js';
import { PRODUCTS_PER_PAGE } from '../utils/constants.js';

const DEFAULT_FILTERS = { category: '', minPrice: '', maxPrice: '', sort: 'newest' };

const PRESETS = {
  deals: {
    title: "Today's Deals",
    kicker: 'Limited time offers',
    tagline:
      'Hand-picked offers at prices that disappear fast. Grab them before the clock runs out.',
    featured: true,
    sort: '',
    gradient: 'from-deal via-amber-600 to-orange-500',
    Icon: Tag,
  },
  'new-arrivals': {
    title: 'New Arrivals',
    kicker: 'Fresh on the shelf',
    tagline: 'The latest drops just landed in our catalogue. Be the first to own them.',
    featured: false,
    sort: 'newest',
    gradient: 'from-brand-700 via-brand-600 to-cyan-500',
    Icon: Sparkles,
  },
  'best-sellers': {
    title: 'Best Sellers',
    kicker: 'Loved by thousands',
    tagline: 'The products shoppers keep coming back for — most ordered, most reviewed, most loved.',
    featured: false,
    sort: 'popular',
    gradient: 'from-ink via-brand-900 to-brand-700',
    Icon: TrendingUp,
  },
};

export default function Products({ preset = null }) {
  const presetConfig = PRESETS[preset] || null;
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const categoryFromUrl = searchParams.get('category') || '';
  const sortFromUrl = presetConfig ? presetConfig.sort : searchParams.get('sort') || '';
  const featuredFromUrl = presetConfig ? presetConfig.featured : searchParams.get('featured') === 'true';

  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    category: categoryFromUrl,
    sort: sortFromUrl || DEFAULT_FILTERS.sort,
  });
  const [featured, setFeatured] = useState(featuredFromUrl);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState({ products: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: categoryFromUrl,
      sort: sortFromUrl || DEFAULT_FILTERS.sort,
    }));
    setFeatured(featuredFromUrl);
    setPage(1);
  }, [categoryFromUrl, sortFromUrl, featuredFromUrl]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    let active = true;
    fetchCategories({ status: 'active' })
      .then((result) => {
        if (active) setCategories(result);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetchProducts({
      search: search || undefined,
      category: filters.category || undefined,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
      featured: featured || undefined,
      sort: filters.sort,
      page,
      limit: PRODUCTS_PER_PAGE,
    })
      .then((result) => {
        if (!active) return;
        setData(result);
        setError(null);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [search, filters, featured, page, reloadKey]);

  useEffect(() => {
    if (!filtersOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [filtersOpen]);

  const handleFilterChange = (partial) => {
    setFilters((prev) => ({ ...prev, ...partial }));
    setPage(1);
  };

  const handleReset = () => {
    setFilters({ ...DEFAULT_FILTERS });
    setFeatured(false);
    setPage(1);
  };

  const pagination = data.pagination;

  const pageNumbers = useMemo(() => {
    if (!pagination) return [];
    const total = pagination.totalPages;
    const current = pagination.page;
    const pages = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  }, [pagination]);

  const activeChips = [];
  if (search) activeChips.push({ label: `Search: "${search}"`, clear: null });
  if (featured) {
    activeChips.push({ label: "Today's Deals", clear: () => setFeatured(false) });
  }
  if (filters.category) {
    activeChips.push({
      label: filters.category,
      clear: () => handleFilterChange({ category: '' }),
    });
  }
  if (filters.minPrice || filters.maxPrice) {
    const min = filters.minPrice ? `Rs.${filters.minPrice}` : 'Any';
    const max = filters.maxPrice ? `Rs.${filters.maxPrice}` : 'Any';
    activeChips.push({
      label: `Price: ${min} - ${max}`,
      clear: () => handleFilterChange({ minPrice: '', maxPrice: '' }),
    });
  }

  const filterPanel = (
    <ProductFilter
      categories={categories}
      filters={filters}
      onChange={handleFilterChange}
      onReset={handleReset}
      resultCount={pagination?.total}
    />
  );

  const total = pagination?.total ?? 0;

  return (
    <div className="mx-auto max-w-[1600px] px-3 py-5 sm:px-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-slate-400">
        <Link
          to="/"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-brand-300 hover:text-brand-600"
          aria-label="Go to homepage"
        >
          <Home size={13} />
        </Link>
        <ChevronRight size={13} className="text-slate-300" />
        <span className="font-semibold text-brand-600">
          {presetConfig ? presetConfig.title : 'Shop'}
        </span>
        {filters.category && (
          <>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="max-w-[140px] truncate font-medium text-slate-500">{filters.category}</span>
          </>
        )}
        {search && (
          <>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="max-w-[220px] truncate font-medium text-slate-500">"{search}"</span>
          </>
        )}
      </nav>

      {/* Shop hero banner */}
<div className={`relative mt-4 overflow-hidden rounded-[26px] border border-secondary-100 bg-soft-hero p-7 sm:p-11 lg:p-14`}>
          <div className="dotted pointer-events-none absolute inset-0 opacity-40" />
          <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-secondary-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-brand-100/40 blur-3xl" />

          <div className="relative grid gap-9 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-secondary-800 shadow-sm ring-1 ring-secondary-200">
                {presetConfig ? <presetConfig.Icon size={14} /> : <Sparkles size={14} />}
                {presetConfig ? presetConfig.kicker : 'The Velmora Boutique'}
              </span>
              <h1 className="mt-5 text-balance font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[54px]">
                {search
                  ? `Results for "${search}"`
                  : presetConfig
                    ? presetConfig.title
                    : filters.category || (featured ? "Today's Deals" : 'Shop the Collection')}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                {presetConfig
                  ? presetConfig.tagline
                  : search
                    ? `Showing the best matches we found for "${search}".`
                    : 'Handpicked products from verified sellers — delivered fast, backed by easy returns.'}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-2.5 text-sm font-semibold text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <Truck size={16} className="text-brand-700" /> Free delivery over ₹999
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-brand-700" /> 7-day easy returns
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BadgePercent size={16} className="text-brand-700" /> Up to 40% off top picks
                </span>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="relative aspect-[4/3] w-full max-w-xl overflow-hidden rounded-[26px] shadow-luxe ring-1 ring-secondary-100">
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"
                  alt="Shopping"
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ink/20 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-slate-800 shadow-card ring-1 ring-secondary-100 backdrop-blur">
                  <ShoppingBag size={16} className="text-brand-700" /> Shop the collection
                </span>
              </div>
            </div>
          </div>
        </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
        {/* Filter sidebar - sticks and scrolls independently while products scroll */}
        <aside className="hidden lg:sticky lg:top-[92px] lg:block lg:max-h-[calc(100vh-108px)] lg:overflow-y-auto lg:overscroll-contain lg:pr-1">
          {filterPanel}
        </aside>

        <div className="min-w-0 lg:max-h-[calc(100vh-108px)] lg:overflow-y-auto lg:overscroll-contain lg:pr-1">
          {/* Category quick pills */}
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-2">
            <button
              type="button"
              onClick={handleReset}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-bold transition ${
                !filters.category && !featured
                  ? 'border-brand-700 bg-brand-700 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-brand-400 hover:text-brand-700'
              }`}
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                type="button"
                onClick={() => handleFilterChange({ category: category.name })}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-bold transition ${
                  filters.category === category.name
                    ? 'border-brand-700 bg-brand-700 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-brand-400 hover:text-brand-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Toolbar */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-3.5 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-600 lg:hidden"
              >
                <SlidersHorizontal size={15} /> Filters
              </button>
              <h2 className="min-w-0 line-clamp-1 text-sm font-extrabold text-slate-900">
                {search
                  ? `Results for "${search}"`
                  : presetConfig
                    ? presetConfig.title
                    : filters.category || (featured ? "Today's Deals" : 'All Products')}
              </h2>
              <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700 ring-1 ring-brand-200">
                {total} item{total === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          {/* Active filter chips */}
          {activeChips.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {activeChips.map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700"
                >
                  {chip.label}
                  {chip.clear && (
                    <button type="button" aria-label={`Clear ${chip.label}`} onClick={chip.clear}>
                      <X size={12} className="transition hover:text-brand-900" />
                    </button>
                  )}
                </span>
              ))}
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold text-brand-600 transition hover:underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Compact grid: smaller cards with proportionate spacing */}
          <div className="mt-4">
            <ProductList
              products={data.products}
              loading={loading}
              error={error}
              onRetry={() => setReloadKey((key) => key + 1)}
              skeletonCount={PRODUCTS_PER_PAGE}
              emptyText={search ? `No products match "${search}".` : 'No products found.'}
              gridClassName="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5 lg:grid-cols-4 lg:gap-4 xl:gap-4 2xl:grid-cols-5 2xl:gap-5"
            />
          </div>

          {/* Pagination */}
          {!loading && !error && pagination && pagination.totalPages > 1 && (
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrevPage}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-brand-600 shadow-sm transition hover:border-brand-400 hover:bg-brand-50 disabled:border-slate-200 disabled:text-slate-300 disabled:shadow-none disabled:hover:bg-white sm:px-4"
              >
                <ChevronLeft size={15} /> Prev
              </button>

              {pageNumbers.map((number) => (
                <button
                  key={number}
                  type="button"
                  onClick={() => setPage(number)}
                  className={`h-8 w-8 rounded-full text-xs font-bold transition sm:h-9 sm:w-9 sm:text-sm ${
                    number === pagination.page
                      ? 'bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-glow'
                      : 'border border-slate-200 bg-white text-slate-600 shadow-sm hover:border-brand-400 hover:text-brand-700'
                  }`}
                >
                  {number}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={!pagination.hasNextPage}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-brand-600 shadow-sm transition hover:border-brand-400 hover:bg-brand-50 disabled:border-slate-200 disabled:text-slate-300 disabled:shadow-none disabled:hover:bg-white sm:px-4"
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm animate-drawer flex-col bg-slate-50 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5">
              <p className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <SlidersHorizontal size={16} className="text-brand-600" /> Filters
              </p>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setFiltersOpen(false)}
                className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">{filterPanel}</div>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="btn-shine m-3 rounded-full bg-gradient-to-r from-brand-700 to-brand-900 py-3 text-sm font-bold text-white shadow-glow transition hover:brightness-110"
            >
              Show {total} result{total === 1 ? '' : 's'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
