import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import {
  formatCurrency,
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

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-secondary-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-secondary-200 hover:shadow-card">
      {discount >= 20 && minimal && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-ink shadow-sm">
          {discount}% off
        </span>
      )}

      <div className="relative aspect-square overflow-hidden bg-soft-card-image">
        <Link to={`/products/${product._id}`} className="block h-full w-full">
          <img
            src={getProductImage(product)}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-110"
          />
        </Link>

        {minimal ? null : (
          <button
            type="button"
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={() => toggleWishlist(product)}
            className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm ring-1 ring-secondary-200 transition duration-300 hover:scale-110 ${
              inWishlist ? 'text-red-500' : 'text-slate-400 hover:text-red-500'
            }`}
          >
            <Heart size={16} className={inWishlist ? 'fill-red-500' : ''} />
          </button>
        )}
      </div>

      {minimal ? (
        <div className="flex flex-1 flex-col gap-1 border-t border-secondary-100 p-2.5">
          <Link
            to={`/products/${product._id}`}
            className="line-clamp-1 text-xs font-semibold leading-snug text-slate-800 transition hover:text-brand-700"
          >
            {product.name}
          </Link>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-slate-900">
              {formatCurrency(effectivePrice)}
            </span>
            {discount > 0 && (
              <span className="text-[11px] text-slate-400 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
        </div>
      ) : (
      <div className="flex flex-1 flex-col gap-1.5 border-t border-secondary-100 p-3.5">
        <Link
          to={`/products/${product._id}`}
          className="line-clamp-2 min-h-[2.5rem] text-[13px] font-semibold leading-snug text-slate-800 transition hover:text-brand-700"
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-0.5 rounded-md bg-rating px-1.5 py-0.5 text-[11px] font-bold text-white">
            {rating > 0 ? rating.toFixed(1) : 'New'}
            {rating > 0 && <Star size={9} className="fill-white" />}
          </span>
          {product.numReviews > 0 && (
            <span className="text-[11px] text-slate-400">
              ({Number(product.numReviews).toLocaleString('en-IN')})
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          <span className="text-base font-bold text-slate-900">
            {formatCurrency(effectivePrice)}
          </span>
          {discount > 0 && (
            <>
              <span className="text-xs text-slate-400 line-through">
                {formatCurrency(product.price)}
              </span>
              <span className="text-xs font-bold text-rating">{discount}% off</span>
            </>
          )}
        </div>

        <p className="text-[11px] font-medium text-slate-500">
          {stock.available > 0 ? 'Free delivery' : 'Currently unavailable'}
        </p>

        <button
          type="button"
          disabled={stock.available <= 0 || adding}
          onClick={handleAddToCart}
          className="btn-shine mt-auto inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-brand-700 to-brand-900 px-3 py-2 text-[13px] font-bold text-white shadow-glow transition duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:bg-none disabled:text-slate-400 disabled:shadow-none"
        >
          {feedback?.type === 'success' ? <Check size={15} /> : <ShoppingCart size={15} />}
          {stock.available <= 0 ? 'Notify me' : adding ? 'Adding...' : 'Add to cart'}
        </button>

        {feedback && (
          <p
            role="status"
            className={`text-center text-[11px] ${
              feedback.type === 'error' ? 'text-red-600' : 'text-rating'
            }`}
          >
            {feedback.message}
          </p>
        )}
      </div>
      )}
    </div>
  );
}
