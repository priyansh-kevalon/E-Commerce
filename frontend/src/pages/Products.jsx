import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Home, SlidersHorizontal, X } from 'lucide-react';
import ProductList from '../components/product/ProductList.jsx';
import ProductFilter from '../components/product/ProductFilter.jsx';
import { fetchCategories, fetchProducts } from '../services/productService.js';
import { PRODUCTS_PER_PAGE, SORT_OPTIONS } from '../utils/constants.js';

const DEFAULT_FILTERS = { category: '', minPrice: '', maxPrice: '', sort: 'newest' };

export default function Products() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const categoryFromUrl = searchParams.get('category') || '';
  const sortFromUrl = searchParams.get('sort') || '';
  const featuredFromUrl = searchParams.get('featured') === 'true';

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
    <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-4">
      <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-500">
        <Link to="/" className="inline-flex items-center gap-1 transition hover:text-brand-600">
          <Home size={13} /> Home
        </Link>
        <span>/</span>
        <span className="font-medium text-slate-700">Products</span>
        {filters.category && (
          <>
            <span>/</span>
            <span className="font-medium text-slate-700">{filters.category}</span>
          </>
        )}
        {search && (
          <>
            <span>/</span>
            <span className="font-medium text-slate-700">Search: {search}</span>
          </>
        )}
      </div>

      <div className="mt-3 grid gap-4 lg:grid-cols-[248px_1fr]">
        <div className="hidden lg:block">
          <div className="sticky top-32">{filterPanel}</div>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-sm border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-600 lg:hidden"
              >
                <SlidersHorizontal size={15} /> Filters
              </button>
              <h1 className="text-base font-bold text-slate-800">
                {search
                  ? `Results for "${search}"`
                  : filters.category || (featured ? "Today's Deals" : 'All Products')}
              </h1>
              <span className="hidden text-sm text-slate-400 sm:inline">
                ({total} item{total === 1 ? '' : 's'})
              </span>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <span className="hidden font-medium sm:inline">Sort by:</span>
              <select
                value={filters.sort || 'newest'}
                onChange={(event) => handleFilterChange({ sort: event.target.value })}
                className="rounded-sm border border-slate-300 bg-white px-2 py-1.5 text-sm font-medium text-slate-700 outline-none focus:border-brand-500"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {activeChips.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {activeChips.map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-brand-200 bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700"
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

          <div className="mt-3">
            <ProductList
              products={data.products}
              loading={loading}
              error={error}
              onRetry={() => setReloadKey((key) => key + 1)}
              skeletonCount={PRODUCTS_PER_PAGE}
              emptyText={search ? `No products match "${search}".` : 'No products found.'}
            />
          </div>

          {!loading && !error && pagination && pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-1 rounded-md border border-slate-200 bg-white py-3">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrevPage}
                className="inline-flex items-center gap-1 px-4 py-1.5 text-sm font-semibold text-brand-600 transition hover:bg-brand-50 disabled:text-slate-300 disabled:hover:bg-transparent"
              >
                <ChevronLeft size={15} /> Prev
              </button>

              {pageNumbers.map((number) => (
                <button
                  key={number}
                  type="button"
                  onClick={() => setPage(number)}
                  className={`h-8 w-8 rounded-sm text-sm font-bold transition ${
                    number === pagination.page
                      ? 'bg-brand-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {number}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={!pagination.hasNextPage}
                className="inline-flex items-center gap-1 px-4 py-1.5 text-sm font-semibold text-brand-600 transition hover:bg-brand-50 disabled:text-slate-300 disabled:hover:bg-transparent"
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
            className="absolute inset-0 bg-ink/50"
          />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm overflow-y-auto bg-slate-50 p-3 shadow-2xl">
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-sm font-bold text-slate-900">Filters</p>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setFiltersOpen(false)}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>
            {filterPanel}
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="mt-3 w-full rounded-sm bg-brand-600 py-3 text-sm font-bold text-white transition hover:bg-brand-700"
            >
              Show {total} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
