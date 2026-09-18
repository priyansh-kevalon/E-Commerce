import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  Boxes,
  IndianRupee,
  Package,
  PackagePlus,
  RotateCcw,
  ShoppingBag,
  TrendingUp,
  Users,
} from 'lucide-react';
import StatCard from '../../components/admin/StatCard.jsx';
import Loader from '../../components/common/Loader.jsx';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge.jsx';
import { fetchDashboardStats } from '../../services/adminService.js';
import { formatCurrency, formatDate } from '../../utils/helpers.js';
import { useAuth } from '../../hooks/useAuth.js';
import { ORDER_STATUS_STYLES } from '../../utils/constants.js';

const STATUS_BAR = {
  Pending: 'from-slate-500 to-slate-400',
  Confirmed: 'from-amber-500 to-amber-400',
  Processing: 'from-teal-500 to-teal-400',
  Shipped: 'from-cyan-500 to-cyan-400',
  Delivered: 'from-emerald-500 to-emerald-400',
  Cancelled: 'from-red-500 to-red-400',
};

const RANK_STYLES = [
  'from-amber-400 to-amber-600 text-amber-950',
  'from-slate-300 to-slate-400 text-slate-700',
  'from-orange-400 to-orange-600 text-orange-950',
];

export default function AdminDashboard() {
  const { user } = useAuth();
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
      <div className="admin-card flex flex-col items-start justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center">
        <p className="text-sm text-red-700">{error}</p>
        <button
          type="button"
          onClick={() => setReloadKey((key) => key + 1)}
          className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <RotateCcw size={15} /> Try again
        </button>
      </div>
    );
  }

  const { totals, orderStatusBreakdown, recentOrders, topProducts, lowStockProducts, monthlySales } = stats;
  const maxRevenue = Math.max(...monthlySales.map((month) => month.revenue), 1);
  const firstName = (user?.name || 'there').split(' ')[0];

  const statusTotal = Object.values(orderStatusBreakdown).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-6">
      {/* Welcome hero */}
      <section className="admin-hero relative overflow-hidden rounded-2xl px-6 py-8 text-white shadow-luxe sm:px-8">
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-100 ring-1 ring-inset ring-white/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {formatDate(new Date())}
            </p>
            <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              Hii, {firstName} 👋
            </h2>
            <p className="mt-1.5 max-w-xl text-sm text-slate-300">
              {totals.pendingOrders > 0
                ? `${totals.pendingOrders} order${totals.pendingOrders === 1 ? '' : 's'} need your attention today.`
                : 'Everything looks good — here is what is happening in your store.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <PackagePlus size={16} className="text-brand-600" /> Add product
            </Link>
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-inset ring-white/20 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
            >
              View orders <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Key metrics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={IndianRupee}
          label="Total revenue"
          value={formatCurrency(totals.revenue)}
          hint="Excludes cancelled orders"
          tone="emerald"
        />
        <StatCard
          icon={ShoppingBag}
          label="Orders"
          value={totals.orders}
          hint={`${totals.pendingOrders} need attention`}
          tone="brand"
        />
        <StatCard
          icon={Package}
          label="Products"
          value={totals.products}
          hint={`${totals.categories} categories`}
          tone="sky"
        />
        <StatCard
          icon={Users}
          label="Customers"
          value={totals.customers}
          hint={`${totals.users} total users`}
          tone="amber"
        />
      </section>

      {/* Revenue + order status */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="admin-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-base font-extrabold tracking-tight text-slate-900">
                Revenue overview
              </h2>
              <p className="text-xs text-slate-500">Gross sales across the last 6 months</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
              <TrendingUp size={13} /> Live
            </span>
          </div>

          {monthlySales.length ? (
            <div className="mt-8 flex h-56 items-end gap-2 sm:gap-4">
              {monthlySales.map((month) => {
                const height = Math.max(6, Math.round((month.revenue / maxRevenue) * 100));
                return (
                  <div key={month.label} className="group relative flex h-full flex-1 flex-col items-center justify-end">
                    <div
                      className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-semibold text-white opacity-0 shadow-lg transition duration-200 group-hover:opacity-100"
                      style={{ bottom: `calc(${height}% + 10px)` }}
                    >
                      {formatCurrency(month.revenue)}
                      <span className="font-normal text-slate-400"> · {month.orders} orders</span>
                      <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                    </div>
                    <div
                      className={`w-full max-w-[3rem] rounded-t-lg bg-gradient-to-t transition-all duration-500 group-hover:brightness-110 ${
                        height >= 70
                          ? 'from-brand-700 to-brand-400'
                          : height >= 40
                            ? 'from-brand-600 to-brand-300'
                            : 'from-brand-500 to-sky-300'
                      }`}
                      style={{ height: `${height}%` }}
                    />
                    <span className="mt-2.5 text-xs font-medium text-slate-500">{month.label}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-8 text-sm text-slate-400">No sales recorded yet.</p>
          )}
        </div>

        <div className="admin-card p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-base font-extrabold tracking-tight text-slate-900">
              Orders by status
            </h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
              {statusTotal} total
            </span>
          </div>

          {statusTotal > 0 ? (
            <ul className="mt-5 space-y-4">
              {Object.keys(ORDER_STATUS_STYLES).map((status) => {
                const count = orderStatusBreakdown[status] || 0;
                const percent = Math.round((count / statusTotal) * 100);
                return (
                  <li key={status}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{status}</span>
                      <span className="font-bold text-slate-900">{count}</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${
                          STATUS_BAR[status] || 'from-slate-400 to-slate-300'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-6 text-sm text-slate-400">No orders recorded yet.</p>
          )}
        </div>
      </section>

      {/* Recent orders + right rail */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="admin-card overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h2 className="font-display text-base font-extrabold tracking-tight text-slate-900">Recent orders</h2>
              <p className="text-xs text-slate-500">Latest activity across your store</p>
            </div>
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700 transition hover:bg-brand-100"
            >
              View all <ArrowRight size={13} />
            </Link>
          </div>

          {recentOrders.length ? (
            <ul className="divide-y divide-slate-100">
              {recentOrders.map((order, index) => (
                <li key={order._id} className="flex items-center justify-between gap-4 px-6 py-3.5 transition hover:bg-slate-50/80">
                  <div className="flex min-w-0 items-center gap-3.5">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white shadow-sm ${
                        ['from-brand-500 to-brand-700', 'from-sky-500 to-sky-700', 'from-violet-500 to-violet-700', 'from-rose-500 to-rose-700'][index % 4]
                      } bg-gradient-to-br`}
                    >
                      #{(order.user?.name || '?').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {order.user?.name || 'Deleted user'} · {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-bold text-slate-800">{formatCurrency(order.totalAmount)}</span>
                    <OrderStatusBadge status={order.orderStatus} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-6 py-10 text-sm text-slate-400">No orders yet.</p>
          )}
        </div>

        <div className="space-y-6">
          <div className="admin-card overflow-hidden">
            <div className="flex items-center gap-2.5 border-b border-slate-100 px-6 py-4">
              <Award size={17} className="text-brand-600" />
              <h2 className="font-display text-base font-extrabold tracking-tight text-slate-900">Best sellers</h2>
            </div>
            {topProducts.length ? (
              <ul className="divide-y divide-slate-100">
                {topProducts.map((product, index) => {
                  const maxSold = Math.max(...topProducts.map((p) => p.sold), 1);
                  const soldBar = Math.round((product.sold / maxSold) * 100);
                  return (
                    <li key={product._id} className="flex items-center gap-3.5 px-6 py-3.5">
                      {index < 3 ? (
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-xs font-extrabold shadow-sm ${
                            RANK_STYLES[index]
                          }`}
                        >
                          {index + 1}
                        </span>
                      ) : (
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                          {index + 1}
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-800">{product.name}</p>
                        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400 transition-all duration-700"
                            style={{ width: `${soldBar}%` }}
                          />
                        </div>
                      </div>
                      <span className="shrink-0 text-xs font-bold text-slate-500">{product.sold} sold</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="px-6 py-8 text-sm text-slate-400">No sales yet.</p>
            )}
          </div>

          <div className="admin-card overflow-hidden">
            <div className="flex items-center gap-2.5 border-b border-slate-100 px-6 py-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <AlertTriangle size={15} />
              </span>
              <h2 className="font-display text-base font-extrabold tracking-tight text-slate-900">Low stock alerts</h2>
            </div>
            {lowStockProducts.length ? (
              <ul className="divide-y divide-slate-100">
                {lowStockProducts.map((product) => (
                  <li key={product._id} className="flex items-center justify-between gap-3 px-6 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">{product.name}</p>
                      <p className="text-xs text-slate-400">{product.category?.name || 'Uncategorized'}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                        product.stock === 0
                          ? 'bg-red-50 text-red-600 ring-1 ring-inset ring-red-200'
                          : 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200'
                      }`}
                    >
                      {product.stock === 0 ? 'Out of stock' : `${product.stock} left`}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center gap-2 px-6 py-8 text-center">
                <Boxes size={22} className="text-slate-300" />
                <p className="text-sm text-slate-400">All products are well stocked.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}