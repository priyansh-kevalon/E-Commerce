import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, PackageOpen } from 'lucide-react';
import ProductCard from '../product/ProductCard.jsx';
import { ProductCardSkeleton } from '../common/Skeleton.jsx';

const SCROLL_STEP = 620;

export function ProductScroller({ loading = false, skeletonCount = 6, products = [], emptyText = 'No products yet.' }) {
  const trackRef = useRef(null);

  const scrollBy = (delta) => trackRef.current?.scrollBy({ left: delta, behavior: 'smooth' });

  return (
    <div className="relative">
      <div ref={trackRef} className="no-scrollbar flex gap-3 overflow-x-auto scroll-smooth px-3 py-3 sm:px-4">
        {loading
          ? Array.from({ length: skeletonCount }).map((_, index) => (
              <div key={index} className="w-[176px] shrink-0 sm:w-[200px]">
                <ProductCardSkeleton />
              </div>
            ))
          : products.length
            ? products.map((product) => (
                <div key={product._id} className="w-[176px] shrink-0 sm:w-[200px]">
                  <ProductCard product={product} />
                </div>
              ))
            : (
                <div className="flex w-full flex-col items-center justify-center gap-2 py-10 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <PackageOpen size={22} />
                  </span>
                  <p className="text-sm font-medium text-slate-500">{emptyText}</p>
                </div>
              )}
      </div>

      {products.length > 2 && (
        <>
          <button
            type="button"
            aria-label="Scroll products left"
            onClick={() => scrollBy(-SCROLL_STEP)}
            className="absolute left-0 top-1/2 hidden h-11 w-9 -translate-y-1/2 items-center justify-center rounded-r-xl border border-slate-200 bg-white text-slate-600 shadow-lg transition hover:text-brand-700 lg:flex"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="Scroll products right"
            onClick={() => scrollBy(SCROLL_STEP)}
            className="absolute right-0 top-1/2 hidden h-11 w-9 -translate-y-1/2 items-center justify-center rounded-l-xl border border-slate-200 bg-white text-slate-600 shadow-lg transition hover:text-brand-700 lg:flex"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
    </div>
  );
}

export default function ProductCarousel({
  title,
  viewAllTo,
  products = [],
  loading = false,
  emptyText = 'No products yet.',
  variant = 'scroller',
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-3">
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-800">
          <span className="h-4 w-1 rounded-full bg-gradient-to-b from-brand-700 to-accent-500" />
          {title}
        </h2>
        {viewAllTo && (
          <Link
            to={viewAllTo}
            className="group inline-flex items-center gap-1 text-[13px] font-bold tracking-wide text-brand-700 transition hover:text-brand-800"
          >
            VIEW ALL
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>

      {variant === 'grid' ? (
        <ProductGrid loading={loading} products={products} emptyText={emptyText} />
      ) : (
        <ProductScroller loading={loading} products={products} emptyText={emptyText} />
      )}
    </section>
  );
}

export function ProductGrid({
  loading = false,
  skeletonCount = 5,
  products = [],
  emptyText = 'No products yet.',
}) {
  const gridClass =
    'grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 sm:gap-5 sm:p-5 lg:grid-cols-4 xl:grid-cols-5';

  if (loading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div key={index} className="w-full">
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-2 py-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <PackageOpen size={22} />
        </span>
        <p className="text-sm font-medium text-slate-500">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className={gridClass}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}