import { useCallback, useEffect, useState } from 'react';
import { Eye, RotateCcw, Search } from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import Modal from '../../components/admin/Modal.jsx';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge.jsx';
import { fetchAllOrders, updateOrderStatus } from '../../services/adminService.js';
import { ORDER_STATUSES, PAYMENT_STATUS_STYLES } from '../../utils/constants.js';
import { formatCurrency, formatDate, getProductImage } from '../../utils/helpers.js';

const LIMIT = 15;

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
      setNotice({ type: 'success', message: `Order marked as ${nextStatus}.` });
    } catch (err) {
      setNotice({ type: 'error', message: err.message });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Orders</h1>
        <p className="mt-1 text-sm text-slate-500">Track and progress customer orders.</p>
      </div>

      {notice.message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            notice.type === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {notice.message}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="w-full max-w-sm">
          <div className="relative">
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by order id, name or email..."
              aria-label="Search orders"
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
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
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        >
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
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
          <p className="px-5 py-10 text-center text-sm text-slate-400">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm md:min-w-full">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="hidden px-5 py-3 font-medium lg:table-cell">Date</th>
                  <th className="hidden px-5 py-3 font-medium md:table-cell">Items</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="hidden px-5 py-3 font-medium lg:table-cell">Payment</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-800">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-700">{order.user?.name || 'Deleted user'}</p>
                      <p className="text-xs text-slate-400">{order.user?.email || '-'}</p>
                    </td>
                    <td className="hidden px-5 py-3 text-slate-600 lg:table-cell">{formatDate(order.createdAt)}</td>
                    <td className="hidden px-5 py-3 text-slate-600 md:table-cell">{order.orderItems.length}</td>
                    <td className="px-5 py-3 font-medium text-slate-800">{formatCurrency(order.totalAmount)}</td>
                    <td className="hidden px-5 py-3 lg:table-cell">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PAYMENT_STATUS_STYLES[order.paymentStatus] || 'bg-slate-100 text-slate-500'}`}>
                        {order.paymentStatus}
                      </span>
                      <p className="mt-1 text-xs text-slate-400">{order.paymentMethod}</p>
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={order.orderStatus}
                        disabled={updatingId === order._id}
                        onChange={(event) => handleStatusChange(order, event.target.value)}
                        className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:opacity-50"
                      >
                        {ORDER_STATUSES.map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setSelected(order)}
                          aria-label="View order"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-brand-600"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
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
            <Button variant="outline" size="sm" disabled={!pagination.hasPrevPage} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={!pagination.hasNextPage} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}

      <Modal
        open={Boolean(selected)}
        title={selected ? `Order #${selected._id.slice(-8).toUpperCase()}` : ''}
        onClose={() => setSelected(null)}
        size="lg"
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <OrderStatusBadge status={selected.orderStatus} />
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PAYMENT_STATUS_STYLES[selected.paymentStatus] || 'bg-slate-100 text-slate-500'}`}>
                {selected.paymentStatus}
              </span>
              <span className="text-xs text-slate-400">Placed {formatDate(selected.createdAt)}</span>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-900">Items</h3>
              <ul className="divide-y divide-slate-100 rounded-sm border border-slate-100">
                {selected.orderItems.map((item, index) => (
                  <li key={`${item.product}-${index}`} className="flex items-center gap-3 px-3 py-3">
                    <img
                      src={item.image || getProductImage(null)}
                      alt={item.name}
                      className="h-11 w-11 rounded-lg bg-slate-100 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">
                        {formatCurrency(item.price)} x {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-900">Shipping address</h3>
                <div className="rounded-sm bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="font-medium text-slate-800">{selected.shippingAddress.fullName}</p>
                  <p>{selected.shippingAddress.phone}</p>
                  <p>{selected.shippingAddress.address}</p>
                  <p>
                    {selected.shippingAddress.city}, {selected.shippingAddress.state}{' '}
                    {selected.shippingAddress.postalCode}
                  </p>
                  <p>{selected.shippingAddress.country}</p>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-900">Summary</h3>
                <dl className="space-y-2 rounded-sm bg-slate-50 p-4 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <dt>Subtotal</dt>
                    <dd>{formatCurrency(selected.subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <dt>Shipping</dt>
                    <dd>{selected.shippingCost === 0 ? 'Free' : formatCurrency(selected.shippingCost)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold text-slate-900">
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
