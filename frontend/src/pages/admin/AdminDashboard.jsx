import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BadgeCheck,
  BadgePercent,
  Ban,
  Bell,
  Boxes,
  ChevronRight,
  ClipboardList,
  Clock,
  Cog,
  CreditCard,
  Eye,
  IndianRupee,
  Layers,
  Package,
  PackageCheck,
  PackagePlus,
  PackageX,
  RefreshCw,
  RotateCcw,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  Truck,
  UserPlus,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
import StatCard from '../../components/admin/StatCard.jsx';
import Loader from '../../components/common/Loader.jsx';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge.jsx';
import { fetchDashboardStats } from '../../services/adminService.js';
import {
  formatCurrency,
  formatDate,
  getProductImage,
  PLACEHOLDER_IMAGE,
} from '../../utils/helpers.js';
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

const AVATAR_GRADIENTS = [
  'from-brand-500 to-brand-700',
  'from-sky-500 to-sky-700',
  'from-violet-500 to-violet-700',
  'from-rose-500 to-rose-700',
  'from-emerald-500 to-emerald-700',
];

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

const formatGrowth = (value) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;

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
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#0ea5e9" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id={`${gradientId}-stroke`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#f97316" />
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

        <path ref={areaRef} d={area} fill={`url(#${gradientId})`} style={{ opacity: 0 }} />

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
              stroke="#0284c7"
              strokeWidth={3}
              className="drop-shadow"
            />
            <circle cx={points[active][0]} cy={points[active][1]} r={2.5} fill="#0284c7" />
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

function TrendChip({ value, slim = false }) {
  const up = value >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-extrabold ${
        up ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
      } ${slim ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'}`}
    >
      <Icon size={slim ? 12 : 13} /> {formatGrowth(value)}
    </span>
  );
}

function KpiTile({ icon: Icon, iconClass, label, value, sub, trend }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/70 p-5">
      <div className="flex items-center justify-between gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={18} />
        </span>
        {trend !== undefined && <TrendChip value={trend} />}
      </div>
      <p className="mt-4 font-display text-2xl font-extrabold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-0.5 text-xs font-semibold text-slate-500">{label}</p>
      {sub && <p className="mt-0.5 text-[11px] font-medium text-slate-400">{sub}</p>}
    </div>
  );
}

function EmptyNote({ icon: Icon, text }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-8 text-center">
      <Icon size={22} className="text-slate-300" />
      <p className="text-sm text-slate-400">{text}</p>
    </div>
  );
}

function SectionHead({ icon: Icon, iconClass = 'text-brand-600', title, sub, badge }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <Icon size={17} className={`shrink-0 ${iconClass}`} />
        <div className="min-w-0">
          <h2 className="font-display text-base font-extrabold tracking-tight text-slate-900">
            {title}
          </h2>
          {sub && <p className="truncate text-xs text-slate-500">{sub}</p>}
        </div>
      </div>
      {badge}
    </div>
  );
}

function AlertRow({ icon: Icon, tone, label, sub, value, to }) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between gap-3 px-5 py-3 transition hover:bg-slate-50/80"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tone}`}>
          <Icon size={16} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">{label}</p>
          <p className="truncate text-xs text-slate-400">{sub}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
            value > 0 ? 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {value}
        </span>
        <ChevronRight
          size={15}
          className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600"
        />
      </div>
    </Link>
  );
}

function MiniStat({ icon: Icon, tone, label, value, sub }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4">
      <div className="flex items-center gap-2.5">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tone}`}
        >
          <Icon size={15} />
        </span>
        <p className="font-display text-lg font-extrabold tracking-tight text-slate-900">{value}</p>
      </div>
      <p className="mt-1.5 text-xs font-semibold text-slate-600">{label}</p>
      {sub && <p className="text-[11px] font-medium text-slate-400">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [periodKey, setPeriodKey] = useState('month');

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

  const {
    totals,
    orderStatusBreakdown,
    recentOrders,
    topProducts,
    lowStockProducts,
    monthlySales,
    salesByPeriod = [],
    salesByCategory = [],
    customerAnalytics = { total: 0, new30d: 0, returning: 0, repeatRate: 0 },
    paymentOverview = { onlineCount: 0, onlineRevenue: 0, codCount: 0, codRevenue: 0, failedCount: 0, refunded: 0 },
    returnsRefunds = { requests: 0, approved: 0, refundPending: 0, rejected: 0, refunded: 0, derived: true },
    alerts = { newOrders24h: 0, newCustomers24h: 0, returnRequests30d: 0, paymentFailures7d: 0 },
  } = stats;

  const firstName = (user?.name || 'there').split(' ')[0];

  const statusTotal = Object.values(orderStatusBreakdown).reduce((sum, count) => sum + count, 0);

  const activePeriod =
    salesByPeriod.find((period) => period.key === periodKey) || salesByPeriod[0];

  const maxCategoryRevenue = Math.max(...salesByCategory.map((category) => category.revenue), 1);

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
          <div className="flex gap-3">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <PackagePlus size={16} className="text-brand-600" /> Add product
            </Link>
            <Link
              to="/admin/orders"
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

      {/* Sales analytics */}
      <section className="admin-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-base font-extrabold tracking-tight text-slate-900">
              Sales analytics
            </h2>
            <p className="text-xs text-slate-500">
              Revenue and growth across key time windows
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
            <TrendingUp size={13} /> Live
          </span>
        </div>

        <div className="mt-5 inline-flex rounded-xl bg-slate-100 p-1">
          {salesByPeriod.map((period) => (
            <button
              key={period.key}
              type="button"
              onClick={() => setPeriodKey(period.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition sm:px-4 ${
                periodKey === period.key
                  ? 'bg-white text-brand-700 shadow-card'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>

        {activePeriod ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiTile
              icon={IndianRupee}
              iconClass="bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm"
              label="Revenue"
              value={formatCurrency(activePeriod.revenue)}
              sub={`${activePeriod.orders} order${activePeriod.orders === 1 ? '' : 's'} in this window`}
              trend={activePeriod.revenueGrowth}
            />
            <KpiTile
              icon={TrendingUp}
              iconClass="bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100"
              label="Revenue growth"
              value={formatGrowth(activePeriod.revenueGrowth)}
              sub="vs. previous period"
            />
            <KpiTile
              icon={ShoppingBag}
              iconClass="bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-100"
              label="Orders growth"
              value={formatGrowth(activePeriod.ordersGrowth)}
              sub="vs. previous period"
            />
            <KpiTile
              icon={Award}
              iconClass="bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-100"
              label="Average order value"
              value={formatCurrency(activePeriod.aov)}
              sub="across this window"
            />
          </div>
        ) : (
          <EmptyNote icon={ShoppingBag} text="No sales recorded yet." />
        )}
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
            <EmptyNote icon={IndianRupee} text="No sales recorded yet." />
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
                      <ProgressBar
                        percent={percent}
                        gradient={STATUS_BAR[status] || 'from-slate-400 to-slate-300'}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyNote icon={ShoppingBag} text="No orders recorded yet." />
          )}
        </div>
      </section>

      {/* Recent orders + top selling */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="admin-card overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h2 className="font-display text-base font-extrabold tracking-tight text-slate-900">
                Recent orders
              </h2>
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
                <li
                  key={order._id}
                  className="group flex items-center justify-between gap-4 px-6 py-3.5 transition hover:bg-slate-50/80"
                >
                  <div className="flex min-w-0 items-center gap-3.5">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold text-white shadow-sm ${
                        AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length]
                      }`}
                    >
                      {(order.user?.name || '?').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {order.user?.name || 'Deleted user'}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        #{order._id.slice(-8).toUpperCase()} · {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-bold text-slate-800">
                      {formatCurrency(order.totalAmount)}
                    </span>
                    <OrderStatusBadge status={order.orderStatus} />
                    <Link
                      to={`/orders/${order._id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                    >
                      <Eye size={13} /> View
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyNote icon={ShoppingBag} text="No orders yet." />
          )}
        </div>

        <div className="admin-card overflow-hidden">
          <SectionHead
            icon={Award}
            title="Top selling products"
            sub="Most units moved"
            badge={
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
                {topProducts.length}
              </span>
            }
          />
          {topProducts.length ? (
            <ul className="divide-y divide-slate-100">
              {topProducts.map((product, index) => {
                const maxSold = Math.max(...topProducts.map((p) => p.sold), 1);
                const soldBar = Math.round((product.sold / maxSold) * 100);
                return (
                  <li key={product._id} className="flex items-center gap-3.5 px-6 py-3.5">
                    <div className="relative shrink-0">
                      <img
                        src={product.image || PLACEHOLDER_IMAGE}
                        alt={product.name}
                        className="h-10 w-10 rounded-lg object-cover ring-1 ring-slate-100"
                        loading="lazy"
                      />
                      <span
                        className={`absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br text-[9px] font-extrabold text-white shadow-sm ring-2 ring-white ${
                          index < 3 ? RANK_STYLES[index] : 'from-slate-400 to-slate-500'
                        }`}
                      >
                        {index + 1}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate text-sm font-medium text-slate-800">{product.name}</p>
                        <span className="shrink-0 text-xs font-bold text-slate-500">
                          {product.sold} sold
                        </span>
                      </div>
                      <div className="mt-1.5">
                        <ProgressBar
                          percent={soldBar}
                          className="h-1"
                          gradient="from-brand-600 to-sky-400"
                        />
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
            <EmptyNote icon={Award} text="No sales yet." />
          )}
        </div>
      </section>

      {/* Low stock + customer analytics */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="admin-card overflow-hidden lg:col-span-2">
          <SectionHead
            icon={AlertTriangle}
            iconClass="text-amber-600"
            title="Low stock alerts"
            sub="Products running low on inventory"
            badge={
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-inset ring-amber-200">
                {lowStockProducts.length}
              </span>
            }
          />
          {lowStockProducts.length ? (
            <ul className="divide-y divide-slate-100">
              {lowStockProducts.map((product) => {
                const stockPct = Math.min(100, (product.stock / LOW_STOCK_THRESHOLD) * 100);
                return (
                  <li
                    key={product._id}
                    className="flex items-center justify-between gap-4 px-6 py-3.5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="h-11 w-11 shrink-0 rounded-lg object-cover ring-1 ring-slate-100"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800">{product.name}</p>
                        <p className="truncate text-xs text-slate-400">
                          {product.category?.name || 'Uncategorized'}
                        </p>
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
                    <div className="flex shrink-0 items-center gap-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                          product.stock === 0
                            ? 'bg-red-50 text-red-600 ring-1 ring-inset ring-red-200'
                            : 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200'
                        }`}
                      >
                        {product.stock === 0 ? 'Out of stock' : `${product.stock} left`}
                      </span>
                      <Link
                        to="/admin/products"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700 transition hover:bg-brand-100"
                      >
                        <RefreshCw size={13} /> Restock
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyNote icon={Boxes} text="All products are well stocked." />
          )}
        </div>

        <div className="admin-card p-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
              <Users size={15} />
            </span>
            <div>
              <h2 className="font-display text-base font-extrabold tracking-tight text-slate-900">
                Customer analytics
              </h2>
              <p className="text-xs text-slate-500">Your customer base health</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <MiniStat
              icon={Users}
              tone="bg-brand-50 text-brand-700"
              label="Total customers"
              value={customerAnalytics.total}
            />
            <MiniStat
              icon={UserPlus}
              tone="bg-emerald-50 text-emerald-700"
              label="New (30 days)"
              value={customerAnalytics.new30d}
            />
            <MiniStat
              icon={RotateCcw}
              tone="bg-violet-50 text-violet-700"
              label="Returning"
              value={customerAnalytics.returning}
            />
            <MiniStat
              icon={Award}
              tone="bg-amber-50 text-amber-600"
              label="Repeat rate"
              value={`${customerAnalytics.repeatRate.toFixed(0)}%`}
            />
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Repeat purchase rate</span>
              <span className="font-extrabold text-brand-700">
                {customerAnalytics.repeatRate.toFixed(1)}%
              </span>
            </div>
            <div className="mt-2">
              <ProgressBar
                percent={customerAnalytics.repeatRate}
                gradient="from-brand-600 to-sky-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category / payments / returns */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="admin-card overflow-hidden">
          <SectionHead
            icon={Layers}
            title="Sales by category"
            sub="Revenue share by category"
            badge={
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                {salesByCategory.length}
              </span>
            }
          />
          {salesByCategory.length ? (
            <ul className="divide-y divide-slate-100">
              {salesByCategory.map((category) => (
                <li key={category.name} className="px-6 py-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-slate-800">{category.name}</p>
                    <span className="shrink-0 text-sm font-bold text-slate-900">
                      {formatCurrency(category.revenue)}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3">
                    <ProgressBar
                      percent={(category.revenue / maxCategoryRevenue) * 100}
                      gradient="from-brand-600 to-violet-400"
                      className="flex-1"
                    />
                    <span className="shrink-0 text-xs font-bold text-brand-700">
                      {category.share.toFixed(1)}%
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] font-medium text-slate-400">
                    {category.units} unit{category.units === 1 ? '' : 's'} · {category.orders} order
                    {category.orders === 1 ? '' : 's'}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyNote icon={Package} text="No category sales yet." />
          )}
        </div>

        <div className="admin-card overflow-hidden">
          <SectionHead
            icon={CreditCard}
            title="Payment overview"
            sub="How customers pay"
          />
          {paymentOverview.onlineCount + paymentOverview.codCount > 0 ? (
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="inline-flex items-center gap-2 font-semibold text-slate-700">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-50 text-brand-700">
                      <CreditCard size={13} />
                    </span>
                    Online payments
                  </span>
                  <span className="shrink-0 font-bold text-slate-900">
                    {formatCurrency(paymentOverview.onlineRevenue)}
                    <span className="ml-1.5 text-xs font-medium text-slate-400">
                      {paymentOverview.onlineCount}
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="inline-flex items-center gap-2 font-semibold text-slate-700">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                      <Wallet size={13} />
                    </span>
                    Cash on delivery
                  </span>
                  <span className="shrink-0 font-bold text-slate-900">
                    {formatCurrency(paymentOverview.codRevenue)}
                    <span className="ml-1.5 text-xs font-medium text-slate-400">
                      {paymentOverview.codCount}
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="inline-flex items-center gap-2 font-semibold text-slate-700">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-50 text-red-600">
                      <Ban size={13} />
                    </span>
                    Failed payments
                  </span>
                  <span className="shrink-0 font-bold text-red-600">
                    {paymentOverview.failedCount}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="inline-flex items-center gap-2 font-semibold text-slate-700">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-50 text-amber-600">
                      <RotateCcw size={13} />
                    </span>
                    Refunded amount
                  </span>
                  <span className="shrink-0 font-bold text-slate-900">
                    {formatCurrency(paymentOverview.refunded)}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Online vs COD</span>
                  <span className="font-extrabold text-brand-700">
                    {formatCurrency(paymentOverview.onlineRevenue)}
                  </span>
                </div>
                <div className="mt-2">
                  <ProgressBar
                    percent={
                      (paymentOverview.onlineRevenue /
                        (paymentOverview.onlineRevenue + paymentOverview.codRevenue || 1)) *
                      100
                    }
                    gradient="from-brand-600 to-violet-400"
                  />
                </div>
              </div>
            </div>
          ) : (
            <EmptyNote icon={CreditCard} text="No payments recorded yet." />
          )}
        </div>

        <div className="admin-card overflow-hidden">
          <SectionHead
            icon={PackageX}
            title="Returns & refunds"
            sub={returnsRefunds.derived ? 'Based on cancelled orders' : 'Return requests'}
            badge={
              <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700 ring-1 ring-inset ring-violet-200">
                {returnsRefunds.requests}
              </span>
            }
          />
          {returnsRefunds.requests > 0 ? (
            <div className="px-6 py-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <MiniStat
                  icon={PackageX}
                  tone="bg-violet-50 text-violet-700"
                  label="Approved"
                  value={returnsRefunds.approved}
                />
                <MiniStat
                  icon={Clock}
                  tone="bg-amber-50 text-amber-600"
                  label="Refund pending"
                  value={returnsRefunds.refundPending}
                />
                <MiniStat
                  icon={Ban}
                  tone="bg-red-50 text-red-600"
                  label="Rejected"
                  value={returnsRefunds.rejected}
                />
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/70 px-4 py-3.5">
                <span className="text-sm font-semibold text-slate-700">
                  Total refunded amount
                </span>
                <span className="font-display text-base font-extrabold tracking-tight text-slate-900">
                  {formatCurrency(returnsRefunds.refunded)}
                </span>
              </div>
              <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-[11px] leading-relaxed text-slate-400">
                Derived from cancelled orders that were already paid. A dedicated returns workflow
                will be added soon.
              </p>
            </div>
          ) : (
            <EmptyNote icon={PackageX} text="No returns or refunds recorded yet." />
          )}
        </div>
      </section>

      {/* Quick actions + admin alerts */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="admin-card overflow-hidden lg:col-span-2">
          <SectionHead
            icon={Zap}
            title="Quick actions"
            sub="Shortcuts for the most common tasks"
            badge={
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
                4 actions
              </span>
            }
          />
          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <Link
              to="/admin/products"
              className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-secondary-600 text-white shadow-sm">
                <PackagePlus size={19} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-slate-800">Add product</span>
                <span className="block text-xs text-slate-400">Create a new listing</span>
              </span>
              <ArrowRight
                size={16}
                className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600"
              />
            </Link>

            <Link
              to="/admin/categories"
              className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-sm">
                <Layers size={19} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-slate-800">Add category</span>
                <span className="block text-xs text-slate-400">Organise your catalogue</span>
              </span>
              <ArrowRight
                size={16}
                className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600"
              />
            </Link>

            <Link
              to="/admin/orders"
              className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-sm">
                <ClipboardList size={19} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-slate-800">Manage orders</span>
                <span className="block text-xs text-slate-400">Process and ship orders</span>
              </span>
              <ArrowRight
                size={16}
                className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600"
              />
            </Link>

            <Link
              to="/admin/coupons"
              className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm">
                <BadgePercent size={19} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-slate-800">Create coupon</span>
                <span className="block text-xs text-slate-400">Discounts &amp; campaigns</span>
              </span>
              <ArrowRight
                size={16}
                className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600"
              />
            </Link>
          </div>
        </div>

        <div className="admin-card overflow-hidden">
          <SectionHead
            icon={Bell}
            title="Admin alerts"
            sub="Things needing attention"
            badge={
              <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600 ring-1 ring-inset ring-red-200">
                {alerts.newOrders24h + alerts.paymentFailures7d}
              </span>
            }
          />
          <ul className="divide-y divide-slate-100">
            <li>
              <AlertRow
                icon={ShoppingBag}
                tone="bg-emerald-50 text-emerald-700"
                label="New orders"
                sub="in the last 24 hours"
                value={alerts.newOrders24h}
                to="/admin/orders"
              />
            </li>
            <li>
              <AlertRow
                icon={AlertTriangle}
                tone="bg-amber-50 text-amber-600"
                label="Low stock"
                sub="products below threshold"
                value={lowStockProducts.length}
                to="/admin/products"
              />
            </li>
            <li>
              <AlertRow
                icon={UserPlus}
                tone="bg-sky-50 text-sky-700"
                label="New customers"
                sub="in the last 24 hours"
                value={alerts.newCustomers24h}
                to="/admin/users"
              />
            </li>
            <li>
              <AlertRow
                icon={RotateCcw}
                tone="bg-violet-50 text-violet-700"
                label="Return requests"
                sub="in the last 30 days"
                value={alerts.returnRequests30d}
                to="/admin/orders"
              />
            </li>
            <li>
              <AlertRow
                icon={CreditCard}
                tone="bg-red-50 text-red-600"
                label="Payment failures"
                sub="in the last 7 days"
                value={alerts.paymentFailures7d}
                to="/admin/orders"
              />
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}