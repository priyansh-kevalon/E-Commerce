import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BadgeCheck,
  ChevronLeft,
  Heart,
  Minus,
  Plus,
  RefreshCcw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Tag,
  Truck,
  Zap,
} from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import ProductReviews from './ProductReviews.jsx';
import SmartImage from '../common/SmartImage.jsx';
import {
  formatCurrency,
  formatDate,
  getCategoryName,
  getDiscountPercent,
  getEffectivePrice,
  getProductImage,
  getStockInfo,
} from '../../utils/helpers.js';

const STOCK_STYLES = {
  success: 'text-rating',
  warning: 'text-amber-600',
  danger: 'text-deal',
};

const TABS = [
  { id: 'description', label: 'Description' },
  { id: 'specs', label: 'Specifications' },
  { id: 'shipping', label: 'Shipping & Returns' },
];

const OFFERS = [
  { title: 'Bank Offer', text: '10% instant discount on select Credit Cards' },
  { title: 'No Cost EMI', text: 'Available on orders above Rs.2,999' },
  { title: 'Special Price', text: 'Get extra savings with the listed deal price' },
];

export default function ProductDetails({ product }) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [addState, setAddState] = useState('idle');
  const [addError, setAddError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  const images = product.images?.length > 0 ? product.images : [getProductImage(product)];
  const [activeImage, setActiveImage] = useState(images[0]);

  useEffect(() => {
    setActiveImage(images[0]);
    setQuantity(1);
    setActiveTab('description');
    setAddState('idle');
    setAddError(null);
  }, [product._id]);

  const stock = getStockInfo(product.stock);
  const discount = getDiscountPercent(product);
  const effectivePrice = getEffectivePrice(product);
  const inWishlist = isWishlisted(product._id);
  const maxQuantity = Math.max(1, stock.available);
  const rating = Number(product.rating) || 0;

  const deliveryBy = formatDate(new Date(Date.now() + 4 * 24 * 60 * 60 * 1000));

  const changeQuantity = (delta) => {
    setQuantity((current) => Math.max(1, Math.min(current + delta, maxQuantity)));
  };

  const handleAddToCart = async (thenGoToCart = false) => {
    setAddState('adding');
    setAddError(null);
    try {
      await addItem(product, quantity);
      setAddState('added');
      setTimeout(() => setAddState('idle'), 2000);
      if (thenGoToCart) navigate('/cart');
    } catch (err) {
      setAddState('idle');
      setAddError(err.message || 'Could not add this item to your cart.');
    }
  };

  return (
    <div className={stock.available > 0 ? 'pb-24 lg:pb-0' : undefined}>
      <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-5">
        <nav className="flex min-w-0 items-center gap-1.5 overflow-hidden rounded-md border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-500">
          <Link to="/products" className="inline-flex shrink-0 items-center gap-1 transition hover:text-brand-600">
            <ChevronLeft size={13} /> Products
          </Link>
          <span>/</span>
          <span className="shrink-0 font-medium text-slate-700">{getCategoryName(product)}</span>
          <span>/</span>
          <span className="truncate font-medium text-slate-700">{product.name}</span>
        </nav>

        <div className="mt-4 grid gap-6 rounded-md border border-slate-200 bg-white p-4 sm:p-6 lg:grid-cols-[80px_minmax(0,1fr)_340px]">
          <div className="hidden gap-3 lg:flex lg:flex-col">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveImage(image)}
                onMouseEnter={() => setActiveImage(image)}
                aria-label={`View image ${index + 1}`}
                className={`flex h-16 w-16 items-center justify-center overflow-hidden rounded-md border bg-white p-1 transition ${
                  activeImage === image ? 'border-brand-600' : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                <SmartImage images={[image]} alt="" className="h-full w-full object-contain" />
              </button>
            ))}
          </div>

          <div>
            <div className="relative flex items-center justify-center rounded-md border border-slate-100 bg-white p-4">
              <SmartImage
                images={[activeImage]}
                alt={product.name}
                className="max-h-[420px] w-full object-contain"
              />
              <button
                type="button"
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                onClick={() => toggleWishlist(product)}
                className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 transition hover:scale-105 ${
                  inWishlist ? 'text-red-500' : 'text-slate-400 hover:text-red-500'
                }`}
              >
                <Heart size={18} className={inWishlist ? 'fill-red-500' : ''} />
              </button>
            </div>

            <div className="mt-4 flex gap-2 lg:hidden">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  aria-label={`View image ${index + 1}`}
                  className={`flex h-14 w-14 items-center justify-center overflow-hidden rounded-md border bg-white p-1 ${
                    activeImage === image ? 'border-brand-600' : 'border-slate-200'
                  }`}
                >
                  <SmartImage images={[image]} alt="" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => handleAddToCart(false)}
                disabled={stock.available <= 0 || addState === 'adding'}
                className="btn-shine flex flex-1 items-center justify-center gap-2 rounded-md bg-gradient-to-r from-accent-500 to-accent-600 px-6 py-3.5 text-sm font-bold text-ink shadow-glow-accent transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:bg-none disabled:text-slate-400 disabled:shadow-none"
              >
                <ShoppingCart size={18} />
                {stock.available <= 0
                  ? 'Out of stock'
                  : addState === 'adding'
                    ? 'Adding...'
                    : addState === 'added'
                      ? 'Added to cart'
                      : 'Add to Cart'}
              </button>
              <button
                type="button"
                onClick={() => handleAddToCart(true)}
                disabled={stock.available <= 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-brand-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                <Zap size={18} /> Buy Now
              </button>
            </div>

            {addError && <p className="mt-2 text-xs text-red-600">{addError}</p>}
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-sm font-medium text-slate-500">{product.brand || getCategoryName(product)}</p>
            <h1 className="mt-1 text-lg font-medium leading-snug text-slate-900">{product.name}</h1>

            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-0.5 rounded-sm bg-rating px-1.5 py-0.5 text-xs font-bold text-white">
                {rating > 0 ? rating.toFixed(1) : 'New'}
                {rating > 0 && <Star size={10} className="fill-white" />}
              </span>
              {product.numReviews > 0 && (
                <span className="text-sm text-slate-500">
                  {Number(product.numReviews).toLocaleString('en-IN')} ratings &amp; reviews
                </span>
              )}
            </div>

            <div className="mt-4 border-b border-slate-200 pb-4">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">
                  {formatCurrency(effectivePrice)}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-base text-slate-400 line-through">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="text-base font-bold text-rating">{discount}% off</span>
                  </>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-500">Inclusive of all taxes</p>
            </div>

            <div className="mt-4">
              <p className="text-sm font-bold text-slate-800">Available offers</p>
              <ul className="mt-2 space-y-2">
                {OFFERS.map((offer) => (
                  <li key={offer.title} className="flex items-start gap-2 text-[13px] text-slate-600">
                    <Tag size={15} className="mt-0.5 shrink-0 text-rating" />
                    <span>
                      <span className="font-semibold text-slate-800">{offer.title}:</span> {offer.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <dl className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-[13px]">
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 font-semibold text-slate-700">Delivery</dt>
                <dd className="flex items-center gap-1.5 text-slate-600">
                  <Truck size={14} className="text-slate-400" /> By {deliveryBy}
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 font-semibold text-slate-700">Stock</dt>
                <dd className={`font-semibold ${STOCK_STYLES[stock.tone]}`}>{stock.label}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 font-semibold text-slate-700">Warranty</dt>
                <dd className="text-slate-600">1 year manufacturer warranty</dd>
              </div>
            </dl>

            <div className="mt-4 flex items-center gap-3 border-t border-slate-200 pt-4">
              <span className="text-sm font-semibold text-slate-700">Quantity</span>
              <div className="inline-flex items-center rounded-sm border border-slate-300">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => changeQuantity(-1)}
                  disabled={quantity <= 1 || stock.available <= 0}
                  className="px-2.5 py-1.5 text-slate-600 transition hover:bg-slate-100 disabled:opacity-40"
                >
                  <Minus size={14} />
                </button>
                <span className="w-9 text-center text-sm font-bold text-slate-800">{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => changeQuantity(1)}
                  disabled={quantity >= maxQuantity || stock.available <= 0}
                  className="px-2.5 py-1.5 text-slate-600 transition hover:bg-slate-100 disabled:opacity-40"
                >
                  <Plus size={14} />
                </button>
              </div>
              {stock.available > 0 && quantity >= maxQuantity && (
                <span className="text-[11px] text-amber-600">Max available</span>
              )}
            </div>

            <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-[12px] text-slate-500">
              <p className="flex items-center gap-2">
                <BadgeCheck size={15} className="text-brand-600" /> Sold by Velmora Retail
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-brand-600" /> Secure transaction
              </p>
              <p className="flex items-center gap-2">
                <RefreshCcw size={15} className="text-brand-600" /> 7-day easy returns
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-md border border-slate-200 bg-white">
          <div className="flex gap-1 border-b border-slate-200 px-2 sm:px-4">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-3.5 text-sm font-semibold uppercase tracking-wide transition ${
                  activeTab === tab.id ? 'text-brand-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute inset-x-2 bottom-0 h-0.5 bg-brand-600" />
                )}
              </button>
            ))}
          </div>

          <div className="p-5">
            {activeTab === 'description' && (
              <p className="max-w-3xl leading-relaxed text-slate-600">{product.description}</p>
            )}

            {activeTab === 'specs' && (
              <dl className="grid max-w-2xl gap-x-10 gap-y-1 text-sm sm:grid-cols-2">
                {[
                  ['Category', getCategoryName(product)],
                  ['Brand', product.brand || '—'],
                  ['Available stock', Number(product.stock) || 0],
                  ['Rating', `${rating.toFixed(1)} / 5`],
                  ['Product ID', product._id],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 border-b border-slate-100 py-3">
                    <dt className="text-slate-500">{label}</dt>
                    <dd className="text-right font-medium text-slate-800">{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {activeTab === 'shipping' && (
              <ul className="max-w-2xl space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <Truck size={17} className="mt-0.5 shrink-0 text-brand-600" />
                  Orders over Rs.999 ship free. A flat Rs.49 applies below that.
                </li>
                <li className="flex items-start gap-2.5">
                  <RefreshCcw size={17} className="mt-0.5 shrink-0 text-brand-600" />
                  Not happy? Return within 7 days in original condition for a full refund.
                </li>
                <li className="flex items-start gap-2.5">
                  <ShieldCheck size={17} className="mt-0.5 shrink-0 text-brand-600" />
                  Every order is protected with secure, encrypted checkout.
                </li>
              </ul>
            )}
          </div>
        </div>

        <div className="mt-5">
          <ProductReviews product={product} />
        </div>
      </div>

      {stock.available > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white px-4 py-2.5 shadow-luxe lg:hidden">
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <div className="min-w-0">
              <p className="truncate text-xs text-slate-500">{product.name}</p>
              <p className="text-lg font-bold text-slate-900">
                {formatCurrency(effectivePrice * quantity)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleAddToCart(false)}
              disabled={addState === 'adding'}
              className="btn-shine ml-auto inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-accent-500 to-accent-600 px-6 py-3 text-sm font-bold text-ink shadow-glow-accent transition hover:brightness-105 disabled:bg-slate-300 disabled:bg-none disabled:shadow-none"
            >
              <ShoppingCart size={17} />
              {addState === 'adding' ? 'Adding...' : addState === 'added' ? 'Added' : 'Add to Cart'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
