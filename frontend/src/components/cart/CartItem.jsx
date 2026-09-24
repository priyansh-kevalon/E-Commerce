import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { formatCurrency, getEffectivePrice, getStockInfo } from '../../utils/helpers.js';
import SmartImage from '../common/SmartImage.jsx';

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [actionError, setActionError] = useState(null);
  const { product, quantity } = item;

  const stock = getStockInfo(product.stock);
  const unitPrice = getEffectivePrice(product);

  const moveToWishlist = async () => {
    setActionError(null);
    try {
      if (!isWishlisted(product._id)) {
        await toggleWishlist(product);
      }
      await removeItem(product._id);
    } catch (err) {
      setActionError(err.message || 'Could not move this item to your wishlist.');
    }
  };

  return (
    <div className="flex gap-4 p-4">
      <Link to={`/products/${product._id}`} className="shrink-0">
        <SmartImage
          images={product.images}
          alt={product.name}
          className="h-20 w-20 rounded-sm bg-slate-100 object-cover sm:h-24 sm:w-24"
        />
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={`/products/${product._id}`}
              className="line-clamp-2 text-sm font-semibold text-slate-800 transition hover:text-brand-600"
            >
              {product.name}
            </Link>
            <p className="mt-0.5 text-xs text-slate-500">
              {stock.available > 0 ? stock.label : 'Out of stock'}
            </p>
          </div>
          <button
            type="button"
            aria-label="Remove item"
            onClick={() => removeItem(product._id)}
            className="rounded-sm p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
          <div className="inline-flex items-center rounded-sm border border-slate-300">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => updateQuantity(product._id, quantity - 1)}
              disabled={quantity <= 1}
              className="px-2.5 py-1.5 text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
            >
              <Minus size={14} />
            </button>
            <span className="w-9 border-x border-slate-300 text-center text-sm font-semibold text-slate-800">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => updateQuantity(product._id, quantity + 1)}
              disabled={quantity >= stock.available}
              className="px-2.5 py-1.5 text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="text-right">
            <p className="text-sm font-bold text-slate-900">{formatCurrency(unitPrice * quantity)}</p>
            <p className="text-xs text-slate-400">{formatCurrency(unitPrice)} each</p>
          </div>
        </div>

        <button
          type="button"
          onClick={moveToWishlist}
          className="mt-3 w-fit text-xs font-semibold text-brand-600 transition hover:underline"
        >
          Move to wishlist
        </button>

        {actionError && <p className="mt-1 text-xs text-red-600">{actionError}</p>}
      </div>
    </div>
  );
}
