export function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[22px] border border-secondary-100/80 bg-white shadow-[0_2px_18px_-10px_rgba(15,23,42,0.18)]">
      <div className="skeleton aspect-square w-full" />
      <div className="space-y-2.5 border-t border-secondary-100/70 p-3.5">
        <div className="skeleton h-2.5 w-1/3 rounded-sm" />
        <div className="skeleton h-3 w-full rounded-sm" />
        <div className="skeleton h-3 w-4/5 rounded-sm" />
        <div className="skeleton h-6 w-1/2 rounded-md" />
        <div className="skeleton h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 10, className = '' }) {
  return (
    <div
      className={`grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:gap-6 2xl:grid-cols-5 ${className}`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
