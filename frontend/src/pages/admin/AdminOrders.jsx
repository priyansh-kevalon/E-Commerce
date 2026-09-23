import { useCallback, useEffect, useState } from 'react';
import {
  CalendarDays,
  CreditCard,
  Eye,
  MapPin,
  Package,
  RotateCcw,
  Search,
  ShoppingBag,
  Wallet,
} from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import Modal from '../../components/admin/Modal.jsx';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge.jsx';
import { fetchAllOrders, updateOrderStatus } from '../../services/adminService.js';
import { ORDER_STATUSES, ORDER_STATUS_STYLES, PAYMENT_STATUS_STYLES } from '../../utils/constants.js';
import { formatCurrency, formatDate, getProductImage } from '../../utils/helpers.js';

const LIMIT = 15;

const AVATAR_GRADIENTS = [
  'from-brand-500 to-brand-700',
  'from-sky-500 to-sky-700',
  'from-violet-500 to-violet-700',
  'from-rose-500 to-rose-700',
  'from-emerald-500 to-emerald-700',
];

const PAYMENT_ICONS = {
  COD: Wallet,
  Card: CreditCard,
  UPI: CreditCard,
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 0 });
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [notice, setNotice] = useState({ type: '', message: '' });
  const [reloadKey, setReloadKey] = useState(0);
  const [updatingId, setUpdatingId] = useState(null);
  const [selected, setSelected] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await fetchAllOrders({
        status: status || undefined,
        search: query || undefined,
        page,
        limit: LIMIT,
      });
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, [status, query, page, reloadKey]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setQuery(search.trim());
  };

  const handleStatusChange = async (order, nextStatus) => {
    setUpdatingId(order._id);
    try {
      const updated = await updateOrderStatus(order._id, nextStatus);
      setOrders((prev) => prev.map((item) => (item._id === updated._id ? { ...item, ...updated } : item)));
      if (selected?._id === order._id) setSelected((prev) => ({ ...prev, ...updated }));
      setNotice({ type: 'success', message: `Order marked as ${nextStatus}.` });
    } catch (err) {
      setNotice({ type: 'error', message: err.message });
    } finally {
      setUpdatingId(null);
    }
  };

  const initialsOf = (name = 'A') =>
    name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

  const PaymentIcon = selected?.paymentMethod
    ? (PAYMENT_ICONS[selected.paymentMethod] || CreditCard)
    : CreditCard;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">Orders</h1>
        <p className="mt-1 text-sm text-slate-500">
          {pagination.total ? `${pagination.total} order${pagination.total === 1 ? '' : 's'} in total` : 'Track and progress customer orders.'}
        </p>
      </div>

      {notice.message && (
        <div
          className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm shadow-sm ${
            notice.type === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border border-red-200 bg-red-50 text-red-700'
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${notice.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
          {notice.message}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="w-full max-w-sm">
          <div className="relative">
            <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search order id, name or email..."
              aria-label="Search orders"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            />
          </div>
        </form>

        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          aria-label="Filter by order status"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        >
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
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
              <ShoppingBag size={22} />
            </span>
            <p className="text-sm text-slate-400">No orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table min-w-[860px]">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>TOTAL</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th className="text-right">View</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order._id}>
                    <td>
                      <p className="font-bold text-slate-800">#{order._id.slice(-8).toUpperCase()}</p>
                      <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-400">
                        <CalendarDays size={11} /> {formatDate(order.createdAt)}
                      </p>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold text-white shadow-sm ${
                            AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length]
                          }`}
                        >
                          {initialsOf(order.user?.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-700">
                            {order.user?.name || 'Deleted user'}
                          </p>
                          <p className="truncate text-xs text-slate-400">{order.user?.email || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="font-bold text-slate-800">{formatCurrency(order.totalAmount)}</p>
                      <p className="text-xs text-slate-400">{order.orderItems.length} item{order.orderItems.length === 1 ? '' : 's'}</p>
                    </td>
                    <td>
                      <span
                        className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-bold ${
                          PAYMENT_STATUS_STYLES[order.paymentStatus] || 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                      <p className="mt-1 text-xs text-slate-400">{order.paymentMethod}</p>
                    </td>
                    <td>
                      <select
                        value={order.orderStatus}
                        disabled={updatingId === order._id}
                        onChange={(event) => handleStatusChange(order, event.target.value)}
                        className={`rounded-lg border-0 px-2.5 py-1.5 text-xs font-semibold outline-none transition focus:ring-2 focus:ring-brand-200 disabled:opacity-50 ${
                          ORDER_STATUS_STYLES[order.orderStatus] || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {ORDER_STATUSES.map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => setSelected(order)}
                        aria-label="View order"
                        className="admin-btn-icon"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} orders)
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrevPage}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNextPage}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Modal
        open={Boolean(selected)}
        title={selected ? `Order #${selected._id.slice(-8).toUpperCase()}` : ''}
        subtitle="Order details"
        icon={<ShoppingBag size={19} />}
        onClose={() => setSelected(null)}
        size="lg"
      >
        {selected && (
          <div className="space-y-6">
            <div className="admin-hero relative overflow-hidden rounded-xl px-5 py-4 text-white">
              <div className="hero-grid pointer-events-none absolute inset-0 opacity-30" />
              <div className="relative flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-200">
                    Placed {formatDate(selected.createdAt)}
                  </p>
                  <p className="mt-1 font-display text-xl font-extrabold">
                    {formatCurrency(selected.totalAmount)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold ring-1 ring-inset ring-white/20 backdrop-blur">
                    {selected.orderItems.length} items
                  </span>
                  <OrderStatusBadge status={selected.orderStatus} />
                </div>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2">
                <Package size={16} className="text-brand-600" />
                <h3 className="font-display text-sm font-extrabold uppercase tracking-wide text-slate-900">
                  Items
                </h3>
              </div>
              <ul className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-white">
                {selected.orderItems.map((item, index) => (
                  <li key={`${item.product}-${index}`} className="flex items-center gap-3.5 px-4 py-3.5">
                    <img
                      src={item.image || getProductImage(null)}
                      alt={item.name}
                      className="h-12 w-12 rounded-xl bg-slate-50 object-cover ring-1 ring-slate-200"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">
                        {formatCurrency(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-slate-800">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="mb-2.5 flex items-center gap-2">
                  <MapPin size={15} className="text-brand-600" />
                  <h3 className="font-display text-sm font-extrabold text-slate-900">Shipping address</h3>
                </div>
                <div className="text-sm text-slate-600">
                  <p className="font-semibold text-slate-800">{selected.shippingAddress.fullName}</p>
                  <p>{selected.shippingAddress.phone}</p>
                  <p className="mt-1">{selected.shippingAddress.address}</p>
                  <p>
                    {selected.shippingAddress.city}, {selected.shippingAddress.state}{' '}
                    {selected.shippingAddress.postalCode}
                  </p>
                  <p>{selected.shippingAddress.country}</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="mb-2.5 flex items-center gap-2">
                  <PaymentIcon size={15} className="text-brand-600" />
                  <h3 className="font-display text-sm font-extrabold text-slate-900">Payment summary</h3>
                </div>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between items-center text-slate-600">
                    <dt>Payment</dt>
                    <dd>
                      <span className="font-semibold text-slate-800">{selected.paymentMethod}</span>
                      <span
                        className={`ml-2 rounded-lg px-2 py-0.5 text-[11px] font-bold ${
                          PAYMENT_STATUS_STYLES[selected.paymentStatus] || 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {selected.paymentStatus}
                      </span>
                    </dd>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <dt>Subtotal</dt>
                    <dd>{formatCurrency(selected.subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <dt>Shipping</dt>
                    <dd>{selected.shippingCost === 0 ? 'Free' : formatCurrency(selected.shippingCost)}</dd>
                  </div>
                  <div className="flex justify-between rounded-lg bg-white px-3 py-2 font-bold text-slate-900 ring-1 ring-slate-200">
                    <dt>Total</dt>
                    <dd>{formatCurrency(selected.totalAmount)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}