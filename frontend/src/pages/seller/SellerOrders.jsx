import { useCallback, useEffect, useState } from 'react';
import { IndianRupee, PackageOpen, RotateCcw, ShoppingBag } from 'lucide-react';
import Loader from '../../components/common/Loader.jsx';
import { fetchSellerOrders } from '../../services/sellerService.js';
import { formatCurrency, formatDate } from '../../utils/helpers.js';

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await fetchSellerOrders();
      setOrders(data.orders);
      setTotalRevenue(data.totalRevenue);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, [reloadKey]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">Orders</h1>
          <p className="mt-1 text-sm text-slate-500">
            {orders.length
              ? `${orders.length} order${orders.length === 1 ? '' : 's'} with your products`
              : 'Orders placed by shoppers will appear here.'}
          </p>
        </div>

        {orders.length > 0 && (
          <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700">
            <IndianRupee size={16} />
            {formatCurrency(totalRevenue)} earned
          </div>
        )}
      </div>

      <div className="admin-card overflow-hidden">
        {loading ? (
          <Loader label="Loading orders..." />
        ) : loadError ? (
          <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
            <p className="text-sm text-red-600">{loadError}</p>
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <RotateCcw size={15} /> Try again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-5 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <PackageOpen size={22} />
            </span>
            <p className="text-sm text-slate-400">No orders yet. Share your listing to get started.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {orders.map((order) => (
              <li key={order._id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={15} className="shrink-0 text-brand-600" />
                    <p className="font-semibold text-slate-800">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </p>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-400">
                    {order.user?.name || 'Guest'} · {order.user?.email || ''} ·{' '}
                    {formatDate(order.createdAt)}
                  </p>
                  <p className="mt-1 truncate text-xs text-slate-500">
                    {order.shippingAddress?.city}, {order.shippingAddress?.country}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-sm font-bold text-slate-800">
                    {formatCurrency(order.totalAmount)}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ring-1 ring-inset ${
                      order.orderStatus === 'Cancelled'
                        ? 'bg-rose-50 text-rose-600 ring-rose-200'
                        : order.orderStatus === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                        : 'bg-slate-100 text-slate-600 ring-slate-200'
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}