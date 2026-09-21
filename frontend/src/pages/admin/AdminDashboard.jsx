import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BadgeCheck,
  Ban,
  Boxes,
  ChevronRight,
  Clock,
  Cog,
  IndianRupee,
  Package,
  PackageCheck,
  PackagePlus,
  RotateCcw,
  ShoppingBag,
  TrendingUp,
  Truck,
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

const STATUS_ICON = {
  Pending: Clock,
  Confirmed: BadgeCheck,
  Processing: Cog,
  Shipped: Truck,
  Delivered: PackageCheck,
  Cancelled: Ban,
};

const STATUS_ICON_TONE = {
  Pending: 'bg-slate-100 text-slate-600',
  Confirmed: 'bg-amber-100 text-amber-700',
  Processing: 'bg-teal-100 text-teal-700',
  Shipped: 'bg-cyan-100 text-cyan-700',
  Delivered: 'bg-emerald-100 text-emerald-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const LOW_STOCK_THRESHOLD = 5;

const RANK_STYLES = [
  'from-amber-400 to-amber-600 text-amber-950',
  'from-slate-300 to-slate-400 text-slate-700',
  'from-orange-400 to-orange-600 text-orange-950',
];

const CHART_HEIGHT = 252;
const CHART_PAD = { top: 22, right: 18, bottom: 32, left: 52 };

const formatAxis = (value) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(value >= 500000 ? 0 : 1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
  return `₹${Math.round(value)}`;
};

const smoothPath = (points) => {
  if (points.length < 2) return '';
  const [p0] = points;
  let d = `M ${p0[0]} ${p0[1]}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const cp1x = x0 + (x1 - x0) / 2;
    const cp2x = x0 + (x1 - x0) / 2;
    d += ` C ${cp1x} ${y0}, ${cp2x} ${y1}, ${x1} ${y1}`;
  }
  return d;
};

function RevenueAreaChart({ data, currency }) {
  const gradientId = `rev-grad-${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2)}`;
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const areaRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const update = () => setWidth(el.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!data.length || !width) return undefined;
    const line = lineRef.current;
    const area = areaRef.current;
    if (!line) return undefined;
    const length = line.getTotalLength();
    line.style.transition = 'none';
    line.style.strokeDasharray = `${length}`;
    line.style.strokeDashoffset = `${length}`;
    if (area) area.style.opacity = '0';
    const frame = requestAnimationFrame(() => {
      line.style.transition = 'stroke-dashoffset 950ms cubic-bezier(0.4, 0, 0.2, 1)';
      line.style.strokeDashoffset = '0';
      requestAnimationFrame(() => {
        if (area) area.style.transition = 'opacity 700ms ease 350ms';
        if (area) area.style.opacity = '1';
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [data, width]);

  const geometry = useMemo(() => {
    if (!width || data.length < 1) return null;
    const chartW = Math.max(0, width - CHART_PAD.left - CHART_PAD.right);
    const chartH = CHART_HEIGHT - CHART_PAD.top - CHART_PAD.bottom;
    const peak = Math.max(...data.map((m) => m.revenue), 1) * 1.18;
    const yOf = (revenue) => CHART_PAD.top + chartH - (revenue / peak) * chartH;

    let linePoints;
    let points;
    if (data.length === 1) {
      const y = yOf(data[0].revenue);
      linePoints = [
        [CHART_PAD.left, y],
        [CHART_PAD.left + chartW, y],
      ];
      points = [[CHART_PAD.left + chartW / 2, y]];
    } else {
      const step = chartW / (data.length - 1);
      points = data.map((month, i) => [CHART_PAD.left + i * step, yOf(month.revenue)]);
      linePoints = points;
    }

    const line = smoothPath(linePoints);
    const area = `${line} L ${linePoints[linePoints.length - 1][0]} ${CHART_PAD.top + chartH} L ${linePoints[0][0]} ${CHART_PAD.top + chartH} Z`;
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
      y: CHART_PAD.top + chartH - f * chartH,
      value: f * peak,
    }));
    return { chartW, chartH, linePoints, points, line, area, ticks, peak };
  }, [data, width]);

  if (!geometry) {
    return <div ref={containerRef} className="h-60 w-full" />;
  }

  const { points, line, area, ticks } = geometry;
  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const nearest = points.reduce((best, p, i) =>
      Math.abs(p[0] - x) < Math.abs(best[0][0] - x) ? [p, i] : best,
      [points[0], 0]
    )[1];
    setActive(nearest);
  };

  const tipLeft = active >= 0 ? points[active][0] : 0;

  return (
    <div ref={containerRef} className="relative h-60 w-full select-none sm:h-[252px]">
      <svg
        width={width}
        height={CHART_HEIGHT}
        viewBox={`0 0 ${width} ${CHART_HEIGHT}`}
        onMouseMove={handleMove}
        onMouseLeave={() => setActive(-1)}
        className="block w-full"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#6366f1" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id={`${gradientId}-stroke`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>

        {ticks.map((tick) => (
          <g key={tick.y}>
            <line
              x1={CHART_PAD.left}
              x2={width - CHART_PAD.right}
              y1={tick.y}
              y2={tick.y}
              stroke="#f1f5f9"
              strokeWidth={1}
              strokeDasharray="4 5"
            />
            <text
              x={CHART_PAD.left - 9}
              y={tick.y + 3.5}
              textAnchor="end"
              className="fill-slate-400"
              style={{ fontSize: 10, fontWeight: 600 }}
            >
              {formatAxis(tick.value)}
            </text>
          </g>
        ))}

        <path
          ref={areaRef}
          d={area}
          fill={`url(#${gradientId})`}
          style={{ opacity: 0 }}
        />

        <path
          ref={lineRef}
          d={line}
          fill="none"
          stroke={`url(#${gradientId}-stroke)`}
          strokeWidth={3}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {active >= 0 && (
          <g>
            <line
              x1={points[active][0]}
              x2={points[active][0]}
              y1={CHART_PAD.top - 6}
              y2={CHART_HEIGHT - CHART_PAD.bottom}
              stroke="#94a3b8"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <circle
              cx={points[active][0]}
              cy={points[active][1]}
              r={7.5}
              fill="#ffffff"
              stroke="#4f46e5"
              strokeWidth={3}
              className="drop-shadow"
            />
            <circle
              cx={points[active][0]}
              cy={points[active][1]}
              r={2.5}
              fill="#4f46e5"
            />
          </g>
        )}

        {points.map((p, i) => (
          <text
            key={`${i}-${p[0]}`}
            x={p[0]}
            y={CHART_HEIGHT - 8}
            textAnchor="middle"
            className={i === active ? 'fill-brand-700' : 'fill-slate-500'}
            style={{ fontSize: 11, fontWeight: i === active ? 700 : 500, transition: 'fill 150ms ease' }}
          >
            {data[i].label}
          </text>
        ))}
      </svg>

      {active >= 0 && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-luxe"
          style={{
            left: Math.min(Math.max(tipLeft, 84), width - 84),
            top: Math.max(CHART_PAD.top - 8, 4),
          }}
        >
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-brand-700">
            <span className="h-2 w-2 rounded-full bg-brand-600" />
            {data[active].label} · {data[active].orders} order{data[active].orders === 1 ? '' : 's'}
          </div>
          <p className="mt-0.5 font-display text-lg font-extrabold tracking-tight text-slate-900">
            {currency(data[active].revenue)}
          </p>
        </div>
      )}
    </div>
  );
}

function ProgressBar({ percent, gradient = 'from-brand-600 to-brand-400', className = '' }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setProgress(Math.min(100, Math.max(0, percent))));
    return () => cancelAnimationFrame(frame);
  }, [percent]);

  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-slate-100 ${className}`}>
      <div
        className={`h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out ${gradient}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

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
            <RevenueAreaChart data={monthlySales} currency={formatCurrency} />
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
                const Icon = STATUS_ICON[status] || Package;
                return (
                  <li key={status} className="group">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="inline-flex min-w-0 items-center gap-2 font-semibold text-slate-700">
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition group-hover:scale-110 ${
                            STATUS_ICON_TONE[status] || 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Icon size={13} />
                        </span>
                        <span className="truncate">{status}</span>
                      </span>
                      <span className="shrink-0 font-bold text-slate-900">
                        {count}
                        <span className="ml-1.5 text-xs font-medium text-slate-400">{percent}%</span>
                      </span>
                    </div>
                    <div className="mt-2 ml-8">
                      <ProgressBar percent={percent} gradient={STATUS_BAR[status] || 'from-slate-400 to-slate-300'} />
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
                <li key={order._id} className="group flex items-center justify-between gap-4 px-6 py-3.5 transition hover:bg-slate-50/80">
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
                    <ChevronRight
                      size={15}
                      className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600"
                    />
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
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="truncate text-sm font-medium text-slate-800">{product.name}</p>
                          <span className="shrink-0 text-xs font-bold text-slate-500">{product.sold} sold</span>
                        </div>
                        <div className="mt-1.5">
                          <ProgressBar percent={soldBar} className="h-1" gradient="from-brand-600 to-sky-400" />
                        </div>
                        <p className="mt-1 text-[11px] font-medium text-brand-700">
                          {formatCurrency(product.revenue)} revenue
                        </p>
                      </div>
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
                {lowStockProducts.map((product) => {
                  const stockPct = Math.min(100, (product.stock / LOW_STOCK_THRESHOLD) * 100);
                  return (
                    <li key={product._id} className="flex items-center justify-between gap-3 px-6 py-3.5">
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white shadow-sm ${
                            product.stock === 0
                              ? 'bg-gradient-to-br from-red-500 to-rose-600'
                              : 'bg-gradient-to-br from-amber-400 to-orange-500'
                          }`}
                        >
                          {product.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-800">{product.name}</p>
                          <p className="truncate text-xs text-slate-400">{product.category?.name || 'Uncategorized'}</p>
                          <div className="mt-1.5 h-1 w-16 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                product.stock === 0
                                  ? 'bg-red-500'
                                  : product.stock <= 2
                                    ? 'bg-amber-500'
                                    : 'bg-amber-400'
                              }`}
                              style={{ width: `${Math.max(10, stockPct)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            product.stock === 0
                              ? 'bg-red-50 text-red-600 ring-1 ring-inset ring-red-200'
                              : 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200'
                          }`}
                        >
                          {product.stock === 0 ? 'Out of stock' : `${product.stock} left`}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400">
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                    </li>
                  );
                })}
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