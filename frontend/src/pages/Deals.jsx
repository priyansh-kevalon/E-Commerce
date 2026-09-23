import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDownAZ,
  ArrowDownWideNarrow,
  ArrowRight,
  ArrowUpWideNarrow,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Home,
  Sparkles,
  Star,
  Tag,
  Timer,
} from 'lucide-react';
import ProductList from '../components/product/ProductList.jsx';
import { fetchCategories, fetchProducts } from '../services/productService.js';
import { PRODUCTS_PER_PAGE, SORT_OPTIONS } from '../utils/constants.js';

const DEFAULT_FILTERS = { category: '', sort: 'popular' };

const SORT_META = {
  newest: { label: 'Newest first', Icon: Clock },
  price_asc: { label: 'Price: low to high', Icon: ArrowUpWideNarrow },
  price_desc: { label: 'Price: high to low', Icon: ArrowDownWideNarrow },
  rating: { label: 'Top rated', Icon: Star },
  popular: { label: 'Most popular', Icon: Flame },
  name_asc: { label: 'Name: A to Z', Icon: ArrowDownAZ },
};

const getTimeLeft = () => {
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  const diff = Math.max(0, endOfDay.getTime() - Date.now());
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { h, m, s };
};

const pad = (value) => String(value).padStart(2, '0');

export default function Deals() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState({ products: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [sortOpen, setSortOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);
  const sortRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

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
      category: filters.category || undefined,
      featured: true,
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
  }, [filters, page, reloadKey]);

  useEffect(() => {
    if (!sortOpen) return undefined;
    const onClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) setSortOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setSortOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [sortOpen]);

  const handleFilterChange = (partial) => {
    setFilters((prev) => ({ ...prev, ...partial }));
    setPage(1);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
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

  const total = pagination?.total ?? 0;
  const activeSortValue = filters.sort || 'popular';
  const ActiveMeta = SORT_META[activeSortValue] || SORT_META.popular;

  const timerUnits = [
    { value: timeLeft.h, label: 'Hours' },
    { value: timeLeft.m, label: 'Mins' },
    { value: timeLeft.s, label: 'Secs' },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-3 py-5 sm:px-5">
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
        <span className="font-semibold text-brand-600">Today's Deals</span>
      </nav>

      {/* Hero */}
      <section className="relative mt-4 overflow-hidden rounded-[26px] border border-secondary-100 bg-soft-hero p-6 sm:p-9 lg:p-11">
        <div className="dotted pointer-events-none absolute inset-0 opacity-40" />
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-secondary-200/45 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-brand-100/40 blur-3xl" />

        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-secondary-800 shadow-sm ring-1 ring-secondary-200">
              <Sparkles size={13} className="text-brand-600" /> Limited-time offers
            </span>
            <h1 className="mt-4 text-balance font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-4xl lg:text-[44px]">
              Save big on{' '}
              <span className="bg-gradient-to-r from-brand-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
                handpicked
              </span>{' '}
              picks
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              Fresh deals every day, at prices that don't last.
            </p>

            {/* Countdown */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-600">
                <Timer size={15} className="text-brand-600" /> Ends in
              </span>
              <div className="flex items-center gap-2">
                {timerUnits.map((unit, index) => (
                  <div key={unit.label} className="flex items-center gap-2">
                    <div className="flex h-[58px] w-[54px] flex-col items-center justify-center rounded-2xl border border-secondary-200 bg-white shadow-sm">
                      <span className="font-display text-2xl font-extrabold tabular-nums text-slate-900">
                        {pad(unit.value)}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-secondary-700">
                        {unit.label}
                      </span>
                    </div>
                    {index < timerUnits.length - 1 && (
                      <span className="font-display text-xl font-extrabold text-secondary-400">:</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="shrink-0 lg:pr-2">
            <Link
              to="/Products"
              className="btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-700 to-secondary-700 px-7 py-3 text-sm font-extrabold text-white shadow-glow transition duration-300 hover:-translate-y-0.5 hover:brightness-110"
            >
              Shop the sale <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Category pills */}
      <div className="no-scrollbar mt-4 flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={handleReset}
          className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-bold transition ${
            !filters.category
              ? 'border-brand-700 bg-brand-700 text-white shadow-sm'
              : 'border-slate-200 bg-white text-slate-600 hover:border-brand-400 hover:text-brand-700'
          }`}
        >
          All deals
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
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-secondary-100 text-brand-700 ring-1 ring-secondary-200">
            <Tag size={16} />
          </span>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">
              {filters.category ? `${filters.category} deals` : "Today's live deals"}
            </h2>
            <span className="inline-flex items-center rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-700 ring-1 ring-brand-200">
              <Flame size={11} className="mr-1" /> {total} active
            </span>
          </div>
        </div>

        <div className="relative z-30 flex items-center gap-2 text-sm text-slate-600">
          <span className="hidden font-medium sm:inline">Sort by:</span>
          <div ref={sortRef} className="relative">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={sortOpen}
              onClick={() => setSortOpen((open) => !open)}
              className={`inline-flex items-center gap-2 rounded-full border bg-white px-3.5 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition ${
                sortOpen
                  ? 'border-brand-500 ring-2 ring-brand-100'
                  : 'border-slate-200 hover:border-brand-400 hover:text-brand-700'
              }`}
            >
              <ActiveMeta.Icon size={15} className="text-brand-500" />
              {ActiveMeta.label}
              <ChevronDown
                size={15}
                className={`text-slate-400 transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {sortOpen && (
              <div
                role="listbox"
                aria-label="Sort products"
                className="absolute right-0 top-full mt-2 w-64 animate-fade-up rounded-2xl border border-secondary-100 bg-white p-2 shadow-luxe"
              >
                <p className="px-2.5 pb-1.5 pt-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Sort deals
                </p>
                <div className="space-y-0.5">
                  {SORT_OPTIONS.map((option) => {
                    const meta = SORT_META[option.value];
                    const selected = activeSortValue === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => {
                          handleFilterChange({ sort: option.value });
                          setSortOpen(false);
                        }}
                        className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm transition ${
                          selected
                            ? 'bg-secondary-50 font-semibold text-secondary-800'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                            selected ? 'bg-secondary-100 text-secondary-700' : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          <meta.Icon size={15} />
                        </span>
                        <span className="flex-1 font-medium">{option.label}</span>
                        {selected && <Check size={15} className="shrink-0 text-brand-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-4">
        <ProductList
          products={data.products}
          loading={loading}
          error={error}
          onRetry={() => setReloadKey((key) => key + 1)}
          skeletonCount={PRODUCTS_PER_PAGE}
          emptyText="No active deals right now. Check back soon."
          gridClassName="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        />
      </div>

      {/* Pagination */}
      {!loading && !error && pagination && pagination.totalPages > 1 && (
        <div className="mt-7 flex items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!pagination.hasPrevPage}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-brand-600 shadow-sm transition hover:border-brand-400 hover:bg-brand-50 disabled:border-slate-200 disabled:text-slate-300 disabled:shadow-none disabled:hover:bg-white"
          >
            <ChevronLeft size={15} /> Prev
          </button>

          {pageNumbers.map((number) => (
            <button
              key={number}
              type="button"
              onClick={() => setPage(number)}
              className={`h-9 w-9 rounded-full text-sm font-bold transition ${
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
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-brand-600 shadow-sm transition hover:border-brand-400 hover:bg-brand-50 disabled:border-slate-200 disabled:text-slate-300 disabled:shadow-none disabled:hover:bg-white"
          >
            Next <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}