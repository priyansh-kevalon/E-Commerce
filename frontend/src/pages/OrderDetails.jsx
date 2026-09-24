import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  MapPin,
  Package,
  RotateCcw,
  Truck,
} from 'lucide-react';
import Button from '../components/common/Button.jsx';
import Loader from '../components/common/Loader.jsx';
import { OrderStatusBadge, PaymentStatusBadge } from '../components/orders/OrderStatusBadge.jsx';
import OrderTimeline from '../components/orders/OrderTimeline.jsx';
import { cancelOrder, fetchOrderById } from '../services/orderService.js';
import { formatCurrency, formatDate } from '../utils/helpers.js';
import SmartImage from '../components/common/SmartImage.jsx';
import { CANCELLABLE_ORDER_STATUSES } from '../utils/constants.js';

const PAYMENT_LABELS = {
  COD: 'Cash on Delivery',
  Card: 'Credit / Debit Card',
  UPI: 'UPI',
};

export default function OrderDetails() {
  const { id } = useParams();
  const location = useLocation();
  const justPlaced = Boolean(location.state?.justPlaced);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchOrderById(id);
        if (active) setOrder(data);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [id, reloadKey]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order? This cannot be undone.')) return;

    setCancelling(true);
    setError('');
    try {
      const updated = await cancelOrder(order._id);
      setOrder(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <Loader label="Loading order..." />;
  }

  if (error && !order) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
        <AlertTriangle size={28} className="text-amber-500" />
        <h1 className="mt-4 text-xl font-bold text-slate-800">Order unavailable</h1>
        <p className="mt-2 text-sm text-slate-500">{error}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="inline-flex items-center gap-2 rounded-sm bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
          >
            <RotateCcw size={15} /> Try again
          </button>
          <Link
            to="/orders"
            className="rounded-sm border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to my orders
          </Link>
        </div>
      </div>
    );
  }

  const canCancel = CANCELLABLE_ORDER_STATUSES.includes(order.orderStatus);

  return (
    <div className="mx-auto max-w-4xl px-3 py-4 sm:px-4">
      {justPlaced && (
        <div className="mb-3 flex items-start gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-5 py-4">
          <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-600" />
          <div>
            <p className="text-sm font-bold text-emerald-800">Thank you! Your order has been placed.</p>
            <p className="mt-0.5 text-sm text-emerald-700">
              We have emailed your confirmation and will notify you when it ships.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p className="mt-2 text-sm text-slate-500">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.orderStatus} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>

      <div className="mt-4">
        <OrderTimeline status={order.orderStatus} />
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <Package size={16} /> Items ({order.orderItems.length})
            </h2>
          </div>

          <ul className="divide-y divide-slate-100">
            {order.orderItems.map((item, index) => (
              <li key={`${item.product}-${index}`} className="flex items-center gap-4 px-4 py-4">
                <SmartImage
                  images={item.image ? [item.image] : []}
                  alt={item.name}
                  className="h-16 w-16 shrink-0 rounded-sm bg-slate-100 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/products/${item.product}`}
                    className="line-clamp-2 text-sm font-semibold text-slate-800 transition hover:text-brand-600"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {item.quantity} x {formatCurrency(item.price)}
                  </p>
                </div>
                <p className="text-sm font-bold text-slate-900">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <Truck size={16} /> Shipping to
            </h2>
            <div className="mt-3 flex gap-2 text-sm text-slate-600">
              <MapPin size={16} className="mt-0.5 shrink-0 text-slate-400" />
              <address className="not-italic leading-relaxed">
                <span className="block font-semibold text-slate-800">{order.shippingAddress.fullName}</span>
                <span className="block">{order.shippingAddress.address}</span>
                <span className="block">
                  {order.shippingAddress.city}
                  {order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ''}{' '}
                  {order.shippingAddress.postalCode}
                </span>
                <span className="block">{order.shippingAddress.country}</span>
                <span className="mt-1 block">{order.shippingAddress.phone}</span>
              </address>
            </div>
          </div>

          <div className="rounded-md border border-slate-200 bg-white p-4">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <CreditCard size={16} /> Payment
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
            </p>

            <dl className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Subtotal</dt>
                <dd className="font-semibold text-slate-800">{formatCurrency(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Shipping</dt>
                <dd className="font-semibold text-slate-800">
                  {order.shippingCost === 0 ? 'Free' : formatCurrency(order.shippingCost)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-base">
                <dt className="font-bold text-slate-900">Total</dt>
                <dd className="font-extrabold text-slate-900">{formatCurrency(order.totalAmount)}</dd>
              </div>
            </dl>
          </div>

          {canCancel && (
            <Button variant="danger" onClick={handleCancel} disabled={cancelling} className="w-full">
              {cancelling ? 'Cancelling...' : 'Cancel order'}
            </Button>
          )}
        </div>
      </div>

      <Link
        to="/orders"
        className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:underline"
      >
        &larr; Back to my orders
      </Link>
    </div>
  );
}
