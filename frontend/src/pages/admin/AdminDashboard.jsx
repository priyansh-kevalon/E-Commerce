import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Boxes,
  IndianRupee,
  Package,
  RotateCcw,
  ShoppingBag,
  Users,
} from 'lucide-react';
import StatCard from '../../components/admin/StatCard.jsx';
import Loader from '../../components/common/Loader.jsx';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge.jsx';
import { fetchDashboardStats } from '../../services/adminService.js';
import { formatCurrency, formatDate } from '../../utils/helpers.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchDashboardStats();
        if (active) setStats(data);
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
  }, [reloadKey]);

  if (loading) return <Loader label="Loading dashboard..." />;

  if (error) {
    return (
      <div className="flex flex-col items-start justify-between gap-3 rounded-md border border-red-200 bg-red-50 px-5 py-4 sm:flex-row sm:items-center">
        <p className="text-sm text-red-700">{error}</p>
        <button
          type="button"
          onClick={() => setReloadKey((key) => key + 1)}
          className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
        >
          <RotateCcw size={15} /> Try again
        </button>
      </div>
    );
  }

  const { totals, orderStatusBreakdown, recentOrders, topProducts, lowStockProducts, monthlySales } = stats;
  const maxRevenue = Math.max(...monthlySales.map((month) => month.revenue), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Store performance at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={IndianRupee} label="Total revenue" value={formatCurrency(totals.revenue)} hint="Excludes cancelled orders" tone="emerald" />
        <StatCard icon={ShoppingBag} label="Orders" value={totals.orders} hint={`${totals.pendingOrders} need attention`} tone="brand" />
        <StatCard icon={Package} label="Products" value={totals.products} hint={`${totals.categories} categories`} tone="sky" />
        <StatCard icon={Users} label="Customers" value={totals.customers} hint={`${totals.users} total users`} tone="amber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-md border border-slate-200 bg-white p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-900">Revenue (last 6 months)</h2>
          {monthlySales.length ? (
            <div className="mt-6 overflow-x-auto">
              <div className="flex h-48 min-w-[380px] items-end gap-3">
                {monthlySales.map((month) => (
                  <div key={month.label} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-[11px] font-medium text-slate-500">
                      {formatCurrency(month.revenue)}
                    </span>
                    <div
                      className="w-full rounded-t-lg bg-brand-500/80 transition hover:bg-brand-600"
                      style={{ height: `${Math.max(4, (month.revenue / maxRevenue) * 100)}%` }}
                      title={`${month.orders} orders`}
                    />
                    <span className="text-xs text-slate-500">{month.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-6 text-sm text-slate-400">No sales recorded yet.</p>
          )}
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-900">Orders by status</h2>
          <ul className="mt-4 space-y-3">
            {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
              <li key={status} className="flex items-center justify-between text-sm">
                <OrderStatusBadge status={status} />
                <span className="font-semibold text-slate-800">{orderStatusBreakdown[status] || 0}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-md border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">Recent orders</h2>
            <Link to="/admin/orders" className="text-xs font-medium text-brand-600 hover:text-brand-700">
              View all
            </Link>
          </div>
          {recentOrders.length ? (
            <ul className="divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <li key={order._id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {order.user?.name || 'Deleted user'} | {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-800">
                      {formatCurrency(order.totalAmount)}
                    </span>
                    <OrderStatusBadge status={order.orderStatus} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-6 text-sm text-slate-400">No orders yet.</p>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-md border border-slate-200 bg-white">
            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
              <Boxes size={16} className="text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-900">Best sellers</h2>
            </div>
            {topProducts.length ? (
              <ul className="divide-y divide-slate-100">
                {topProducts.map((product) => (
                  <li key={product._id} className="flex items-center justify-between px-5 py-3 text-sm">
                    <span className="truncate text-slate-700">{product.name}</span>
                    <span className="ml-3 shrink-0 font-medium text-slate-800">
                      {product.sold} sold
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-6 text-sm text-slate-400">No sales yet.</p>
            )}
          </div>

          <div className="rounded-md border border-slate-200 bg-white">
            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
              <AlertTriangle size={16} className="text-amber-500" />
              <h2 className="text-sm font-semibold text-slate-900">Low stock</h2>
            </div>
            {lowStockProducts.length ? (
              <ul className="divide-y divide-slate-100">
                {lowStockProducts.map((product) => (
                  <li key={product._id} className="flex items-center justify-between px-5 py-3 text-sm">
                    <span className="truncate text-slate-700">{product.name}</span>
                    <span className={`ml-3 shrink-0 font-medium ${product.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                      {product.stock === 0 ? 'Out of stock' : `${product.stock} left`}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-6 text-sm text-slate-400">All products are well stocked.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
