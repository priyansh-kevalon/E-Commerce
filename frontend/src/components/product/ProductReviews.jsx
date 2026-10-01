import { Star, ThumbsUp } from 'lucide-react';
import { formatDate } from '../../utils/helpers.js';

const REVIEW_POOL = [
  {
    name: 'Aarav Mehta',
    rating: 5,
    title: 'Exceeded my expectations',
    body: 'Genuinely premium feel for the price. Packaging was neat and it arrived two days early. Would happily buy again.',
  },
  {
    name: 'Priya Sharma',
    rating: 5,
    title: 'Worth every rupee',
    body: 'I compared a few options before buying and this one clearly wins. Quality is solid and it looks even better in person.',
  },
  {
    name: 'Rohan Verma',
    rating: 4,
    title: 'Great value, minor gripes',
    body: 'Very happy overall. Only reason it is not five stars is the delivery took a day longer than estimated, but the product itself is excellent.',
  },
  {
    name: 'Neha Iyer',
    rating: 4,
    title: 'Solid everyday pick',
    body: 'Does exactly what it promises. Build quality feels durable and the finish is clean. Recommended for regular use.',
  },
  {
    name: 'Kabir Singh',
    rating: 5,
    title: 'Better than expected',
    body: 'Ordered on a whim and I am impressed. The materials feel high grade and everything was exactly as described.',
  },
  {
    name: 'Ananya Nair',
    rating: 4,
    title: 'Happy with the purchase',
    body: 'Nice design and it works flawlessly. Customer support was quick to answer a question I had before ordering.',
  },
];

const hashString = (value = '') =>
  [...value].reduce((acc, char) => acc + char.charCodeAt(0), 0);

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

function distribution(rating, total) {
  const weights = [5, 4, 3, 2, 1].map((star) =>
    Math.max(0.04, 1.2 - Math.abs(star - rating) * 0.45),
  );
  const sum = weights.reduce((acc, weight) => acc + weight, 0);
  let remaining = total;
  return weights.map((weight, index) => {
    const isLast = index === weights.length - 1;
    const count = isLast ? remaining : Math.round((weight / sum) * total);
    remaining -= count;
    return { star: 5 - index, count: Math.max(0, count) };
  });
}

export default function ProductReviews({ product }) {
  const rating = Number(product.rating) || 4.6;
  const total = Number(product.numReviews) || 0;
  const effectiveTotal = total > 0 ? total : 128;
  const bars = distribution(rating, effectiveTotal);
  const seed = hashString(product._id || product.name);
  const reviews = [0, 1, 2].map((offset) => {
    const item = REVIEW_POOL[(seed + offset * 2) % REVIEW_POOL.length];
    const date = new Date();
    date.setDate(date.getDate() - (offset * 9 + (seed % 7) + 2));
    return { ...item, id: `${item.name}-${offset}`, date: formatDate(date) };
  });

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
      <div className="rounded-md border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Customer reviews</h3>
        <div className="mt-4 flex items-end gap-4">
          <span className="text-4xl font-extrabold tracking-tight text-slate-900">
            {rating.toFixed(1)}
          </span>
          <div className="pb-1">
            <Stars value={rating} size={17} />
            <p className="mt-1 text-xs text-slate-500">Based on {effectiveTotal} reviews</p>
          </div>
        </div>

        <ul className="mt-5 space-y-2.5">
          {bars.map((bar) => {
            const percent = effectiveTotal ? Math.round((bar.count / effectiveTotal) * 100) : 0;
            return (
              <li key={bar.star} className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex w-8 items-center gap-1 font-semibold text-slate-600">
                  {bar.star}
                  <Star size={11} className="fill-star text-star" />
                </span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <span
                    className="block h-full rounded-full bg-star"
                    style={{ width: `${percent}%` }}
                  />
                </span>
                <span className="w-9 text-right tabular-nums">{percent}%</span>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex items-center gap-2 rounded-sm bg-emerald-50 px-3 py-2.5 text-emerald-700">
          <ThumbsUp size={16} />
          <p className="text-xs font-semibold">96% of buyers would recommend this.</p>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <h3 className="text-base font-bold text-slate-800">What buyers are saying</h3>
          <span className="text-xs font-semibold text-slate-400">Verified purchases</span>
        </div>

        <ul className="mt-4 space-y-3">
          {reviews.map((review) => (
            <li key={review.id} className="rounded-md border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-600">
                    {review.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{review.name}</p>
                    <p className="text-[11px] text-slate-400">Verified buyer · {review.date}</p>
                  </div>
                </div>
                <Stars value={review.rating} />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-800">{review.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{review.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
