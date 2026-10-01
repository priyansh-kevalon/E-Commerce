import { Star, MessageSquare } from 'lucide-react';

function Stars({ value = 0, size = 15 }) {
  const rounded = Math.round(Number(value) || 0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= rounded ? 'fill-star text-star' : 'text-slate-300'}
        />
      ))}
    </div>
  );
}

export default function ProductReviews({ product }) {
  const rating = Number(product?.rating) || 0;
  const total = Number(product?.numReviews) || 0;

  // There is no review-submission endpoint yet, so any review text, reviewer
  // name, "verified purchase" badge or rating summary shown here would be
  // fabricated. Show only what the catalogue actually stores, and be explicit
  // when a product has no reviews rather than inventing them.
  if (!total) {
    return (
      <div className="rounded-md border border-slate-200 bg-white p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <MessageSquare size={22} />
        </span>
        <h3 className="mt-3 text-base font-bold text-slate-800">No reviews yet</h3>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500">
          This product has not been reviewed yet. Once reviews are enabled they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Customer reviews</h3>
      <div className="mt-4 flex items-end gap-4">
        <span className="text-4xl font-extrabold tracking-tight text-slate-900">
          {rating.toFixed(1)}
        </span>
        <div className="pb-1">
          <Stars value={rating} size={17} />
          <p className="mt-1 text-xs text-slate-500">Based on {total} reviews</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-500">
        Written review text will appear here once the review feature is enabled.
      </p>
    </div>
  );
}
