export function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <div className="skeleton aspect-square w-full" />
      <div className="space-y-2.5 border-t border-slate-100 p-3">
        <div className="skeleton h-3 w-full rounded-sm" />
        <div className="skeleton h-3 w-4/5 rounded-sm" />
        <div className="skeleton h-3 w-1/3 rounded-sm" />
        <div className="skeleton h-4 w-2/5 rounded-sm" />
        <div className="skeleton h-9 w-full rounded-sm" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 10, className = '' }) {
  return (
    <div
      className={`grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 ${className}`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
