import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import CheckoutForm from '../components/checkout/CheckoutForm.jsx';
import Loader from '../components/common/Loader.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { createOrder } from '../services/orderService.js';
import { formatCurrency, getEffectivePrice, getProductImage } from '../utils/helpers.js';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, totalItems, subtotal, shippingCost, total, clearCart, syncing } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handlePlaceOrder = async (payload) => {
    setSubmitting(true);
    setError('');
    try {
      const order = await createOrder(payload);
      try {
        await clearCart();
      } catch (clearError) {
        // The order was placed successfully; a failed cart clear must not block
        // the confirmation screen.
        console.error('Could not clear the cart after placing the order:', clearError);
      }
      navigate(`/orders/${order._id}`, { state: { justPlaced: true }, replace: true });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (syncing) {
    return <Loader label="Preparing checkout..." />;
  }

  if (!items.length) {
    return (
      <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-center px-4 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <ShoppingBag size={32} />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-slate-800">Your cart is empty</h1>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Add a few products before proceeding to checkout.
        </p>
        <Link
          to="/products"
          className="mt-6 rounded-sm bg-brand-600 px-7 py-3 text-sm font-bold text-white transition hover:bg-brand-700"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-5">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <CheckoutForm
          defaultValues={{ fullName: user?.name || '', country: 'India', paymentMethod: 'COD' }}
          onSubmit={handlePlaceOrder}
          submitting={submitting}
          serverError={error}
          total={total}
        />

        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-md border border-slate-200 bg-white">
            <h2 className="border-b border-slate-200 px-4 py-3 text-sm font-bold uppercase tracking-wide text-slate-500">
              Order Summary
            </h2>

            <ul className="max-h-72 space-y-3 overflow-y-auto px-4 py-4">
              {items.map((item) => (
                <li key={item.product._id} className="flex gap-3">
                  <img
                    src={getProductImage(item.product)}
                    alt={item.product.name}
                    className="h-14 w-14 shrink-0 rounded-sm bg-slate-100 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium text-slate-800">{item.product.name}</p>
                    <p className="text-xs text-slate-500">
                      {item.quantity} x {formatCurrency(getEffectivePrice(item.product))}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    {formatCurrency(getEffectivePrice(item.product) * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="space-y-3 border-t border-slate-200 px-4 py-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Subtotal</dt>
                <dd className="font-semibold text-slate-800">{formatCurrency(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Delivery</dt>
                <dd className="font-semibold text-slate-800">
                  {shippingCost === 0 ? <span className="text-rating">Free</span> : formatCurrency(shippingCost)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-dashed border-slate-200 pt-3 text-base">
                <dt className="font-bold text-slate-900">Total</dt>
                <dd className="font-extrabold text-slate-900">{formatCurrency(total)}</dd>
              </div>
            </dl>

            <div className="border-t border-slate-200 px-4 py-3">
              <Link to="/cart" className="text-xs font-semibold text-brand-600 hover:underline">
                Edit cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
