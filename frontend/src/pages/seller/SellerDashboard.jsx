import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Package,
  PackagePlus,
  ShoppingBag,
  Store,
  XCircle,
} from 'lucide-react';
import Loader from '../../components/common/Loader.jsx';
import StatCard from '../../components/admin/StatCard.jsx';
import { fetchSellerOverview } from '../../services/sellerService.js';
import { useAuth } from '../../hooks/useAuth.js';
import { formatCurrency, formatDate } from '../../utils/helpers.js';

export default function SellerDashboard() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      setOverview(await fetchSellerOverview());
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, [reloadKey]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const firstName = (user?.name || 'there').split(' ')[0];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 via-brand-700 to-brand-800 px-6 py-7 text-white shadow-luxe sm:px-8">
        <div className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-white/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-ink/10 blur-2xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-ink/60">
              Your store
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              Hii, {firstName} 👋
            </h2>
            <p className="mt-1 max-w-lg text-sm font-medium text-ink/70">
              List your products on Velmora and reach thousands of shoppers.
              Products go live after a quick admin review.
            </p>
          </div>
          <Link
            to="/seller/products?create=1"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-ink px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
          >
            <PackagePlus size={16} /> Add product
          </Link>
        </div>
      </section>

      {loading ? (
        <Loader label="Loading your store..." />
      ) : loadError ? (
        <div className="admin-card flex flex-col items-center gap-3 px-5 py-10 text-center">
          <p className="text-sm text-red-600">{loadError}</p>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={Package}
              label="Total products"
              value={overview.products}
              hint="Listed in your catalogue"
              tone="brand"
            />
            <StatCard
              icon={Clock3}
              label="Pending review"
              value={overview.pending}
              hint="Waiting for admin approval"
              tone="amber"
            />
            <StatCard
              icon={ShoppingBag}
              label="Orders"
              value={overview.orders}
              hint="Orders with your products"
              tone="sky"
            />
            <StatCard
              icon={IndianRupee}
              label="Revenue"
              value={formatCurrency(overview.revenue)}
              hint="From sold items (excl. cancelled)"
              tone="emerald"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            <div className="admin-card overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <Clock3 size={16} className="text-brand-600" />
                  <h3 className="font-display text-base font-extrabold tracking-tight text-slate-900">
                    Recent orders
                  </h3>
                </div>
                <Link to="/seller/orders" className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700">
                  View all <ArrowRight size={13} />
                </Link>
              </div>
              {overview.recentOrders.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-slate-400">
                  No orders on your products yet.
                </p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {overview.recentOrders.map((order) => (
                    <li key={order._id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          #{order._id.slice(-6).toUpperCase()}
                        </p>
                        <p className="truncate text-xs text-slate-400">
                          {order.user?.name || 'Guest'} · {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="text-sm font-bold text-slate-800">
                          {formatCurrency(order.totalAmount)}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold capitalize text-slate-600">
                          {order.orderStatus}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-4">
              <div className="admin-card p-5">
                <div className="flex items-center gap-2.5 text-brand-600">
                  <CheckCircle2 size={16} />
                  <h3 className="font-display text-sm font-extrabold tracking-tight text-slate-900">
                    Catalogue health
                  </h3>
                </div>
                <ul className="mt-4 space-y-3 text-sm">
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-500">
                      <CheckCircle2 size={14} className="text-emerald-500" /> Live now
                    </span>
                    <span className="font-bold text-slate-800">{overview.approved}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-500">
                      <Clock3 size={14} className="text-amber-500" /> Pending
                    </span>
                    <span className="font-bold text-slate-800">{overview.pending}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-500">
                      <XCircle size={14} className="text-rose-500" /> Rejected
                    </span>
                    <span className="font-bold text-slate-800">{overview.rejected}</span>
                  </li>
                </ul>
              </div>

              <div className="admin-card p-5">
                <div className="flex items-center gap-2.5 text-amber-600">
                  <Store size={16} />
                  <h3 className="font-display text-sm font-extrabold tracking-tight text-slate-900">
                    Tip
                  </h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  Use clear photos and a detailed description — listings with strong
                  descriptions sell up to 3x faster.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}