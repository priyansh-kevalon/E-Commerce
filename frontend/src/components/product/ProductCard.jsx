import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BadgePercent, Check, Heart, ShoppingCart, Star, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import {
  formatCurrency,
  getCategoryName,
  getDiscountPercent,
  getEffectivePrice,
  getProductImage,
  getStockInfo,
} from '../../utils/helpers.js';

export default function ProductCard({ product, minimal = false }) {
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [adding, setAdding] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const stock = getStockInfo(product.stock);
  const discount = getDiscountPercent(product);
  const effectivePrice = getEffectivePrice(product);
  const inWishlist = isWishlisted(product._id);
  const rating = Number(product.rating) || 0;
  const category = getCategoryName(product);
  const savings = discount > 0 ? Math.round((Number(product.price) || 0) - effectivePrice) : 0;

  useEffect(() => {
    if (feedback?.type !== 'success') return undefined;
    const timer = setTimeout(() => setFeedback(null), 2000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const handleAddToCart = async () => {
    setAdding(true);
    setFeedback(null);
    try {
      await addItem(product, 1);
      setFeedback({ type: 'success', message: 'Added to cart' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Could not add this item.' });
    } finally {
      setAdding(false);
    }
  };

  const imagePlate = (
    <div className="relative aspect-square overflow-hidden bg-soft-card-image">
      <div className="dotted pointer-events-none absolute inset-0 opacity-25" />
      <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-brand-200/50 blur-3xl transition duration-700 group-hover:bg-brand-300/60" />
      <div className="pointer-events-none absolute -bottom-14 -left-10 h-36 w-36 rounded-full bg-secondary-200/40 blur-3xl" />

      {discount > 0 && (
        <span
          className="absolute left-0 top-4 z-20 inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 via-accent-500 to-accent-600 py-1.5 pl-3 pr-4 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-lg [clip-path:polygon(0_0,100%_0,calc(100%-10px)_50%,100%_100%,0_100%)]"
        >
          <BadgePercent size={12} className="text-white" />
          {discount}% off
        </span>
      )}

      {!minimal && (
        <button
          type="button"
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={() => toggleWishlist(product)}
          className={`absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md ring-1 backdrop-blur-sm transition duration-300 hover:scale-110 active:scale-95 ${
            inWishlist
              ? 'text-red-500 ring-red-200'
              : 'text-slate-400 ring-secondary-200 hover:text-red-500'
          }`}
        >
          <Heart size={16} className={inWishlist ? 'fill-red-500' : ''} />
        </button>
      )}

      <Link
        to={`/products/${product._id}`}
        className="relative z-10 flex h-full w-full items-center justify-center p-4"
      >
        <img
          src={getProductImage(product)}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-contain drop-shadow-[0_14px_16px_rgba(14,165,233,0.22)] transition duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_20px_26px_rgba(14,165,233,0.32)]"
        />
      </Link>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-white/70 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
    </div>
  );

  if (minimal) {
    return (
      <div className="group relative flex flex-col overflow-hidden rounded-[20px] border border-secondary-100/80 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-brand-600 via-accent-500 to-amber-400 transition-transform duration-500 group-hover:scale-x-100" />
        {imagePlate}
        <div className="flex flex-1 flex-col gap-1 border-t border-secondary-100/70 p-2.5 pt-2">
          <Link
            to={`/products/${product._id}`}
            className="line-clamp-1 text-xs font-bold leading-snug text-slate-800 transition hover:text-brand-700"
          >
            {product.name}
          </Link>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-[15px] font-extrabold text-slate-900">
              {formatCurrency(effectivePrice)}
            </span>
            {discount > 0 && (
              <span className="text-[11px] text-slate-400 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-secondary-100/80 bg-white shadow-[0_2px_18px_-10px_rgba(15,23,42,0.18)] transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-200/70 hover:shadow-luxe">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-brand-600 via-accent-500 to-amber-400 transition-transform duration-500 group-hover:scale-x-100" />

      {imagePlate}

      <div className="relative flex flex-1 flex-col gap-1.5 border-t border-secondary-100/70 px-3.5 pb-3.5 pt-2.5">
        {category !== 'Uncategorized' && (
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-600/80">
            {category}
          </p>
        )}

        <Link
          to={`/products/${product._id}`}
          className="line-clamp-2 min-h-[2.35rem] text-[13px] font-bold leading-snug text-slate-800 transition hover:text-brand-700"
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-1.5">
          {rating > 0 ? (
            <>
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200/70">
                <Star size={10} className="fill-amber-400 text-amber-400" />
                {rating.toFixed(1)}
              </span>
              {product.numReviews > 0 && (
                <span className="text-[11px] text-slate-400">
                  ({Number(product.numReviews).toLocaleString('en-IN')})
                </span>
              )}
            </>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-brand-600 ring-1 ring-brand-200/60">
              New
            </span>
          )}
        </div>

        <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="font-display text-[17px] font-extrabold tracking-tight text-slate-900">
            {formatCurrency(effectivePrice)}
          </span>
          {discount > 0 && (
            <span className="text-[11px] text-slate-400 line-through">
              {formatCurrency(product.price)}
            </span>
          )}
          {savings > 0 && (
            <span className="text-[10px] font-bold text-emerald-600">Save {formatCurrency(savings)}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {stock.available > 5 ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
              <Truck size={12} className="text-brand-600" /> Free delivery
            </span>
          ) : stock.available > 0 ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
              {stock.label}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              Out of stock
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={stock.available <= 0 || adding}
          onClick={handleAddToCart}
          className="btn-shine mt-auto inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-700 to-brand-900 px-3 py-2.5 text-[13px] font-bold text-white shadow-glow transition duration-300 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:bg-none disabled:text-slate-400 disabled:shadow-none"
        >
          {feedback?.type === 'success' ? <Check size={15} /> : <ShoppingCart size={15} />}
          {stock.available <= 0 ? 'Sold out' : adding ? 'Adding...' : 'Add to cart'}
        </button>

        {feedback && (
          <p
            role="status"
            className={`text-center text-[11px] ${
              feedback.type === 'error' ? 'text-red-600' : 'text-emerald-600'
            }`}
          >
            {feedback.message}
          </p>
        )}
      </div>
    </div>
  );
}