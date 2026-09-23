import { PackageOpen, RotateCcw, SearchX } from 'lucide-react';
import ProductCard from './ProductCard.jsx';
import Reveal from '../common/Reveal.jsx';
import { ProductGridSkeleton } from '../common/Skeleton.jsx';

export default function ProductList({
  products = [],
  loading = false,
  error = null,
  onRetry = null,
  emptyText = 'No products found.',
  skeletonCount = 10,
  gridClassName = 'grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:gap-6 2xl:grid-cols-5',
}) {
  if (loading) {
    return <ProductGridSkeleton count={skeletonCount} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-red-200 bg-white p-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
          <RotateCcw size={22} />
        </span>
        <p className="mt-4 text-sm font-medium text-red-700">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 rounded-sm border border-red-300 bg-white px-5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <RotateCcw size={15} /> Try again
          </button>
        )}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-slate-200 bg-white px-6 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <PackageOpen size={26} />
        </span>
        <p className="mt-4 text-sm font-semibold text-slate-700">{emptyText}</p>
        <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-400">
          <SearchX size={13} /> Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className={gridClassName}>
      {products.map((product, index) => (
        <Reveal key={product._id} delay={(index % 10) * 50}>
          <ProductCard product={product} />
        </Reveal>
      ))}
    </div>
  );
}
