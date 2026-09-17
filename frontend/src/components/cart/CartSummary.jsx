import { Link } from 'react-router-dom';
import { CheckCircle2, Truck } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers.js';
import { FREE_SHIPPING_THRESHOLD } from '../../utils/constants.js';

export default function CartSummary({ itemCount, subtotal, shippingCost, total, showCheckout = true }) {
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div className="rounded-md border border-slate-200 bg-white">
      <h2 className="border-b border-slate-200 px-4 py-3 text-sm font-bold uppercase tracking-wide text-slate-500">
        Price Details
      </h2>

      <dl className="space-y-3 px-4 py-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-500">
            Price ({itemCount} item{itemCount === 1 ? '' : 's'})
          </dt>
          <dd className="font-semibold text-slate-800">{formatCurrency(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Delivery</dt>
          <dd className="font-semibold text-slate-800">
            {shippingCost === 0 ? (
              <span className="text-rating">Free</span>
            ) : (
              formatCurrency(shippingCost)
            )}
          </dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-dashed border-slate-200 pt-4 text-base">
          <dt className="font-bold text-slate-900">Total Amount</dt>
          <dd className="text-xl font-extrabold text-slate-900">{formatCurrency(total)}</dd>
        </div>
      </dl>

      <div className="px-4 pb-4">
        {remainingForFreeShipping > 0 ? (
          <div className="rounded-sm bg-brand-50 p-3">
            <p className="flex items-center gap-2 text-xs font-semibold text-brand-700">
              <Truck size={14} /> Add {formatCurrency(remainingForFreeShipping)} more for free delivery.
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-brand-100">
              <div
                className="h-full rounded-full bg-brand-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <p className="flex items-center gap-2 rounded-sm bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-700">
            <CheckCircle2 size={15} /> You have unlocked free delivery.
          </p>
        )}

        {showCheckout && (
          <Link
            to="/checkout"
            className="btn-shine mt-4 block w-full rounded-md bg-gradient-to-r from-accent-500 to-accent-600 px-4 py-3 text-center text-sm font-bold text-ink shadow-glow-accent transition hover:brightness-105"
          >
            Proceed to Checkout
          </Link>
        )}

        <Link
          to="/products"
          className="mt-2 block w-full rounded-sm border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-600"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
