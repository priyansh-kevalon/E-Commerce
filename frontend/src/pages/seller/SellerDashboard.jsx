import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BarChart3,
  Bell,
  Boxes,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  Clock3,
  CreditCard,
  Eye,
  IndianRupee,
  Layers,
  LogOut,
  Package,
  PackagePlus,
  PackageX,
  RefreshCcw,
  RotateCcw,
  ShoppingBag,
  Star,
  Store,
  TrendingDown,
  TrendingUp,
  Wallet,
  XCircle,
  Zap,
} from 'lucide-react';
import StatCard from '../../components/admin/StatCard.jsx';
import Loader from '../../components/common/Loader.jsx';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge.jsx';
import { fetchSellerOverview } from '../../services/sellerService.js';
import { useAuth } from '../../hooks/useAuth.js';
import {
  formatCurrency,
  formatDate,
  getProductImage,
  PLACEHOLDER_IMAGE,
} from '../../utils/helpers.js';

const METRICS = [
  { key: 'revenue', label: 'Revenue' },
  { key: 'orders', label: 'Orders' },
  { key: 'units', label: 'Units sold' },
];

const CHART_COLORS = {
  revenue: '#7c3aed',
  orders: '#0ea5e9',
  units: '#10b981',
};

const NOTIFICATION_STYLE = {
  order: { icon: ShoppingBag, tone: 'bg-emerald-50 text-emerald-600' },
  process: { icon: Clock3, tone: 'bg-amber-50 text-amber-600' },
  pending: { icon: ClipboardList, tone: 'bg-brand-50 text-brand-600' },
  rejected: { icon: XCircle, tone: 'bg-red-50 text-red-600' },
  stock: { icon: AlertTriangle, tone: 'bg-amber-50 text-amber-600' },
  out: { icon: PackageX, tone: 'bg-red-50 text-red-600' },
  payment: { icon: CreditCard, tone: 'bg-rose-50 text-rose-600' },
  refund: { icon: RefreshCcw, tone: 'bg-sky-50 text-sky-600' },
};

const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
};

function SectionHead({ icon: Icon, title, sub, badge }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Icon size={17} />
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-base font-extrabold tracking-tight text-slate-900">{title}</h3>
          {sub && <p className="truncate text-xs text-slate-400">{sub}</p>}
        </div>
      </div>
      {badge}
    </div>
  );
}

function ProgressBar({ percent, gradient = 'from-brand-600 to-brand-400' }) {
  const width = Math.max(0, Math.min(100, Number(percent) || 0));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

const compactAxis = (value) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(value >= 100000000 ? 0 : 1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(value >= 500000 ? 0 : 1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  return `₹${Math.round(value)}`;
};

const niceMaxFor = (values) => {
  const raw = Math.max(...values, 0);
  if (raw === 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / magnitude;
  const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  return nice * magnitude;
};

function SalesChart({ data, metric }) {
  const [hover, setHover] = useState(null);
  const isRevenue = metric === 'revenue';
  const values = data.map((day) => (isRevenue ? day.revenue : metric === 'orders' ? day.orders : day.units));
  const max = niceMaxFor(values);
  const color = CHART_COLORS[metric] || CHART_COLORS.revenue;

  const W = 760;
  const H = 230;
  const padL = 46;
  const padR = 12;
  const padT = 20;
  const padB = 30;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const step = innerW / data.length;
  const barW = Math.max(3, Math.min(step * 0.55, 20));

  const yPos = (value) => padT + innerH - (value / max) * innerH;
  const gridLines = Array.from({ length: 5 }, (_, i) => (max * i) / 4);
  const labelEvery = Math.max(1, Math.ceil(data.length / 9));

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        onMouseLeave={() => setHover(null)}
        role="img"
        aria-label={`${metric} over the last ${data.length} days`}
      >
        {gridLines.map((tick, i) => (
          <g key={`grid-${i}`}>
            <line x1={padL} x2={W - padR} y1={yPos(tick)} y2={yPos(tick)} stroke="#eef2f7" strokeWidth="1" />
            <text x={padL - 8} y={yPos(tick) + 3} textAnchor="end" fontSize="10" fontWeight="600" fill="#94a3b8">
              {isRevenue ? compactAxis(tick) : Math.round(tick)}
            </text>
          </g>
        ))}

        {data.map((day, index) => {
          const value = values[index] || 0;
          const x = padL + index * step + (step - barW) / 2;
          const h = value > 0 ? Math.max((value / max) * innerH, 2) : 0;
          const cx = padL + index * step + step / 2;
          const active = hover === index;
          return (
            <g key={`${day.label}-${index}`}>
              {active && <line x1={cx} x2={cx} y1={padT} y2={H - padB} stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.45" />}
              <rect
                x={x}
                y={yPos(value)}
                width={barW}
                height={Math.max(h, 1)}
                rx="3"
                fill={color}
                opacity={active ? 1 : 0.8}
                onMouseEnter={() => setHover(index)}
              />
              {value > 0 && active && <circle cx={cx} cy={yPos(value)} r="3.5" fill={color} stroke="#fff" strokeWidth="1.5" />}
              <rect
                x={padL + index * step}
                y={padT - 4}
                width={step}
                height={innerH + 8}
                fill="transparent"
                onMouseEnter={() => setHover(index)}
              />
            </g>
          );
        })}

        {data.map((day, index) =>
          index % labelEvery === 0 ? (
            <text
              key={`xlabel-${index}`}
              x={padL + index * step + step / 2}
              y={H - 8}
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill="#94a3b8"
            >
              {day.label}
            </text>
          ) : null
        )}
      </svg>

      {hover !== null && data[hover] && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-slate-900 px-3 py-2 text-center shadow-luxe"
          style={{ left: `${((hover + 0.5) / data.length) * 100}%`, top: '13%' }}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{data[hover].label}</p>
          <p className="mt-0.5 whitespace-nowrap text-xs font-extrabold text-white">
            {isRevenue ? formatCurrency(values[hover]) : values[hover]}
          </p>
          {metric === 'orders' || metric === 'units' ? (
            <p className="text-[10px] font-medium text-slate-400">
              {metric === 'orders'
                ? `${formatCurrency(data[hover].revenue)} revenue`
                : `${data[hover].orders} orders`}
            </p>
          ) : null}
          <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-slate-900" />
        </div>
      )}
      {!data.length ? (
        <p className="py-8 text-center text-sm text-slate-400">No daily sales data available.</p>
      ) : null}
    </div>
  );
}

function QuickAction({ to, icon: Icon, title, sub, accent, className = '' }) {
  return (
    <Link
      to={to}
      className={`group flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3.5 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card ${className}`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm ${accent || 'from-brand-500 to-brand-700'}`}
      >
        <Icon size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-slate-800">{title}</span>
        <span className="block truncate text-[11px] text-slate-400">{sub}</span>
      </span>
      <ArrowRight
        size={15}
        className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600"
      />
    </Link>
  );
}

export default function SellerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [metric, setMetric] = useState('revenue');
  const [openMenu, setOpenMenu] = useState('');

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
  const storeName = user?.name
    ? `${user.name.split(' ')[user.name.split(' ').length - 1]} Store`
    : 'Your Store';

  const kpi = overview?.kpi || {};
  const sales = overview?.sales?.['30d'] || null;
  const notifications = overview?.notifications || [];
  const init = (user?.name || 'S')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = (name) => setOpenMenu((current) => (current === name ? '' : name));

  const topProducts = overview?.topProducts || [];
  const noSales = overview?.productPerformance?.noSales || { count: 0, products: [] };

  return (
    <div className="space-y-6">
      {/* ------------------------------ Header ------------------------------ */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 via-brand-700 to-brand-800 px-6 py-7 text-white shadow-luxe sm:px-8">
        <div className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-white/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-slate-950/10 blur-2xl" />
        <div className="relative">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-100/80">
            Seller dashboard
          </p>
          <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            Welcome back, {firstName} 👋
          </h2>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-brand-100/90">
            <span className="inline-flex items-center gap-1.5">
              <Store size={14} /> {storeName}
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-brand-200 sm:inline-block" />
            <span>{overview ? `${kpi.approved} live product${kpi.approved === 1 ? '' : 's'}` : 'Loading store...'}</span>
            <span className="hidden h-1 w-1 rounded-full bg-brand-200 sm:inline-block" />
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} /> {formatDate(new Date())}
            </span>
          </p>
        </div>
      </section>

      {/* Header controls: updated badge + notifications + profile */}
      <div className="flex flex-wrap items-center justify-end gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card">
        <span className="mr-auto inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          {overview && overview.timestamp ? `Live · updated ${timeAgo(overview.timestamp)}` : 'Live · syncing…'}
        </span>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleMenu('notifications')}
              aria-label="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              <Bell size={18} />
              {notifications.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-red-600 px-1 text-[10px] font-extrabold text-white ring-2 ring-white">
                  {notifications.length}
                </span>
              )}
            </button>

            {openMenu === 'notifications' && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setOpenMenu('')} aria-hidden="true" />
                <div className="absolute right-0 top-12 z-30 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-luxe animate-pop">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-extrabold text-slate-800">Notifications</p>
                    <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-600">
                      {notifications.length} new
                    </span>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="px-4 py-8 text-center text-sm text-slate-400">
                      You're all caught up. No new activity.
                    </p>
                  ) : (
                    <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
                      {notifications.map((notification, index) => {
                        const style = NOTIFICATION_STYLE[notification.type] || NOTIFICATION_STYLE.order;
                        const Icon = style.icon;
                        return (
                          <li key={`${notification.type}-${index}`}>
                            <Link
                              to={notification.link}
                              onClick={() => setOpenMenu('')}
                              className="flex items-start gap-3 px-4 py-3 transition hover:bg-slate-50"
                            >
                              <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.tone}`}>
                                <Icon size={15} />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-[13px] font-semibold text-slate-700">
                                  {notification.message}
                                </span>
                                <span className="mt-0.5 block text-[11px] text-slate-400">
                                  {timeAgo(notification.date)}
                                </span>
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => toggleMenu('profile')}
              className="flex items-center gap-2 rounded-xl bg-white py-1.5 pl-1.5 pr-2.5 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-xs font-extrabold text-ink">
                {init}
              </span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {openMenu === 'profile' && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setOpenMenu('')} aria-hidden="true" />
                <div className="absolute right-0 top-12 z-30 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-luxe animate-pop">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="truncate text-sm font-bold text-slate-800">{user?.name}</p>
                    <p className="truncate text-[11px] text-slate-400">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      to="/"
                      onClick={() => setOpenMenu('')}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                      <Store size={15} className="text-slate-400" /> View store
                    </Link>
                    <Link
                      to="/seller/products"
                      onClick={() => setOpenMenu('')}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                      <Package size={15} className="text-slate-400" /> My products
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut size={15} /> Log out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <Link
            to="/seller/products?create=1"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-brand-800 to-brand-900 px-4 py-2.5 text-sm font-bold text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
          >
            <PackagePlus size={16} /> Add product
          </Link>
        </div>
      </div>

            {loading ? (
        <Loader label="Loading your store..." />
      ) : loadError ? (
        <div className="admin-card flex flex-col items-center gap-3 px-5 py-10 text-center">
          <p className="text-sm text-red-600">{loadError}</p>
          <button
            type="button"
            onClick={() => setReloadKey((value) => value + 1)}
            className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <RotateCcw size={15} /> Try again
          </button>
        </div>
      ) : (
        <>
          {/* ------------------------------ KPI cards ------------------------------ */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
            <StatCard icon={Package} label="Total products" value={kpi.products} hint="In your catalogue" tone="brand" />
            <StatCard icon={ClipboardList} label="Pending products" value={kpi.pending} hint="Awaiting admin approval" tone="amber" />
            <StatCard icon={ShoppingBag} label="Total orders" value={kpi.orders} hint="With your products" tone="sky" />
            <StatCard icon={IndianRupee} label="Total revenue" value={formatCurrency(kpi.revenue)} hint="From sold items" tone="emerald" />
            <StatCard icon={Boxes} label="Units sold" value={kpi.unitsSold} hint="Across all orders" tone="rose" />
            <StatCard icon={CircleDollarSign} label="Avg order value" value={formatCurrency(kpi.avgOrderValue)} hint="Per order placed" tone="slate" />
          </div>

          {/* ------------------------------ Action required ------------------------------ */}
          <div className="admin-card">
            <SectionHead
              icon={Zap}
              title="Action required"
              sub="Things that need your attention"
              badge={
                overview.actionRequired &&
                Object.values(overview.actionRequired).reduce((total, value) => total + Number(value || 0), 0) > 0 ? (
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-inset ring-amber-200">
                    {Object.values(overview.actionRequired).reduce((total, value) => total + Number(value || 0), 0)}{' '}
                    items
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                    <CheckCircle2 size={13} /> All clear
                  </span>
                )
              }
            />
            <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
              <ActionTile
                icon={ClipboardList}
                tone="bg-brand-50 text-brand-600"
                label="Pending approvals"
                count={overview.actionRequired?.pendingApprovals}
                to="/seller/products"
              />
              <ActionTile
                icon={Clock3}
                tone="bg-amber-50 text-amber-600"
                label="Orders to process"
                count={overview.actionRequired?.ordersToProcess}
                to="/seller/orders"
              />
              <ActionTile
                icon={AlertTriangle}
                tone="bg-amber-50 text-amber-600"
                label="Low-stock products"
                count={overview.actionRequired?.lowStockProducts}
                to="/seller/products"
              />
              <ActionTile
                icon={PackageX}
                tone="bg-red-50 text-red-600"
                label="Out-of-stock products"
                count={overview.actionRequired?.outOfStockProducts}
                to="/seller/products"
              />
              <ActionTile
                icon={RefreshCcw}
                tone="bg-sky-50 text-sky-600"
                label="Return / refund requests"
                count={overview.actionRequired?.returnRequests}
                to="/seller/orders"
              />
              <ActionTile
                icon={CreditCard}
                tone="bg-rose-50 text-rose-600"
                label="Payment issues"
                count={overview.actionRequired?.paymentIssues}
                to="/seller/orders"
              />
            </div>
          </div>

          {/* ------------------------------ Sales performance ------------------------------ */}
          <div className="admin-card">
            <SectionHead
              icon={TrendingUp}
              title="Sales performance"
              sub="Daily totals for the last 30 days"
              badge={
                sales && (
                  <div className="flex rounded-xl bg-slate-100 p-1">
                    {METRICS.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setMetric(item.key)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                          metric === item.key
                            ? 'bg-white text-brand-700 shadow-sm ring-1 ring-slate-200'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )
              }
            />
            {sales ? (
              <div className="grid gap-6 p-5 lg:grid-cols-[1fr_260px]">
                <div>
                  <div className="mb-4 flex flex-wrap items-baseline gap-3">
                    <p className="font-display text-3xl font-extrabold tracking-tight text-slate-900">
                      {metric === 'revenue'
                        ? formatCurrency(sales.revenue)
                        : metric === 'orders'
                        ? sales.orders
                        : sales.units}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {metric === 'revenue' ? 'Revenue · last 30 days' : metric === 'orders' ? 'Orders · last 30 days' : 'Units · last 30 days'}
                    </p>
                  </div>
                  {sales.daily && <SalesChart data={sales.daily} metric={metric} />}
                </div>

                <div className="space-y-3">
                  <MiniStat label="Revenue" value={formatCurrency(sales.revenue)} accent="text-brand-600" />
                  <MiniStat label="Orders" value={sales.orders} accent="text-sky-600" />
                  <MiniStat label="Units sold" value={sales.units} accent="text-emerald-600" />
                  <MiniStat
                    label="Avg order value"
                    value={formatCurrency(sales.orders ? sales.revenue / sales.orders : 0)}
                    accent="text-slate-900"
                  />
                </div>
              </div>
            ) : (
              <p className="px-5 py-10 text-center text-sm text-slate-400">No sales data available.</p>
            )}
          </div>

          {/* ------------------------------ Recent orders ------------------------------ */}
          <div className="admin-card overflow-hidden">
            <SectionHead
              icon={ShoppingBag}
              title="Recent orders"
              sub="Latest orders containing your products"
              badge={
                <Link
                  to="/seller/orders"
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
                >
                  View all orders <ArrowRight size={13} />
                </Link>
              }
            />
            {overview.recentOrders.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-slate-400">
                No orders on your products yet. When customers order, they'll show up here.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      <th className="px-6 py-3.5">Order ID</th>
                      <th className="px-6 py-3.5">Customer</th>
                      <th className="px-6 py-3.5">Product</th>
                      <th className="px-6 py-3.5">Amount</th>
                      <th className="px-6 py-3.5">Date</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {overview.recentOrders.map((order) => (
                      <tr key={order._id} className="transition hover:bg-slate-50/80">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-brand-700">#{order.ref}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-[10px] font-bold text-white">
                              {(order.customer || 'G')[0]}
                            </span>
                            <span className="text-sm font-semibold text-slate-700">{order.customer}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={order.productImage || PLACEHOLDER_IMAGE}
                              alt={order.productName}
                              className="h-9 w-9 shrink-0 rounded-lg bg-slate-50 object-cover ring-1 ring-slate-200"
                            />
                            <div className="min-w-0">
                              <p className="max-w-[180px] truncate text-sm font-semibold text-slate-700">
                                {order.productName}
                              </p>
                              <p className="text-[11px] text-slate-400">× {order.quantity}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-800">
                          {formatCurrency(order.amount)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-500">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <OrderStatusBadge status={order.orderStatus} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to="/seller/orders"
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-600 transition hover:border-brand-400 hover:text-brand-700"
                          >
                            <Eye size={13} /> View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ------------------------------ Inventory + low stock + top selling ------------------------------ */}
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="space-y-6 min-w-0">
              <div className="admin-card">
                <SectionHead
                  icon={Boxes}
                  title="Inventory overview"
                  sub="Sellable (approved) products"
                  badge={
                    <Link
                      to="/seller/products"
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
                    >
                      Manage inventory <ArrowRight size={13} />
                    </Link>
                  }
                />
                <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
                  <InventoryTile label="Total stock" value={overview.inventory?.totalStock} sub="Units in hand" tone="brand" />
                  <InventoryTile label="In stock" value={overview.inventory?.inStock} sub="Healthy levels" tone="emerald" />
                  <InventoryTile label="Low stock" value={overview.inventory?.lowStock} sub="≤ 5 units" tone="amber" />
                  <InventoryTile label="Out of stock" value={overview.inventory?.outOfStock} sub="Need restocking" tone="rose" />
                  <InventoryTile
                    label="Inventory value"
                    value={formatCurrency(overview.inventory?.inventoryValue)}
                    sub="At selling price"
                    tone="sky"
                  />
                </div>
              </div>

              <div className="admin-card overflow-hidden">
                <SectionHead
                  icon={AlertTriangle}
                  title="Low stock alerts"
                  sub="Products running out soon"
                  badge={
                    overview.inventory?.lowStock > 0 ? (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-inset ring-amber-200">
                        {overview.inventory?.lowStock} low
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                        <CheckCircle2 size={13} /> Stocked up
                      </span>
                    )
                  }
                />
                {overview.lowStockItems.length === 0 ? (
                  <p className="px-5 py-10 text-center text-sm text-slate-400">
                    No low-stock products. Your inventory looks healthy.
                  </p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {overview.lowStockItems.map((product) => {
                      const stock = product.stock || 0;
                      return (
                        <li key={product._id} className="flex items-center gap-3.5 px-5 py-3.5">
                          <img
                            src={getProductImage(product)}
                            alt={product.name}
                            className="h-11 w-11 shrink-0 rounded-xl bg-slate-50 object-cover ring-1 ring-slate-200"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-slate-800">{product.name}</p>
                            <p className="text-xs text-slate-500">Current stock</p>
                          </div>
                          <div className="shrink-0 text-right">
                            <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-extrabold text-amber-700 ring-1 ring-inset ring-amber-200">
                              {stock === 0 ? 'Out of stock' : `Only ${stock} left`}
                            </span>
                          </div>
                          <Link
                            to="/seller/products"
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-700 to-brand-800 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:brightness-110"
                          >
                            <PackagePlus size={13} /> Restock
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>

            {/* Top selling */}
            <div className="admin-card overflow-hidden">
              <SectionHead
                icon={Award}
                title="Top selling products"
                sub="Best performers by revenue"
                badge={
                  <Link
                    to="/seller/products"
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
                  >
                    View all <ArrowRight size={13} />
                  </Link>
                }
              />
              {topProducts.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-slate-400">
                  Once your products start selling, the best performers will appear here.
                </p>
              ) : (
                <ol className="divide-y divide-slate-100">
                  {topProducts.map((product, index) => (
                    <li key={product._id} className="flex items-center gap-3.5 px-5 py-3.5">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-extrabold ring-1 ring-inset ${
                          index === 0
                            ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-amber-950 ring-amber-300'
                            : index === 1
                            ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-700 ring-slate-300'
                            : index === 2
                            ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-orange-950 ring-orange-300'
                            : 'bg-slate-100 text-slate-500 ring-slate-200'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="h-11 w-11 shrink-0 rounded-xl bg-slate-50 object-cover ring-1 ring-slate-200"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-800">{product.name}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                          <Star size={12} className="fill-amber-400 text-amber-400" />
                          <span className="font-semibold text-slate-600">{Number(product.rating || 0).toFixed(1)}</span>
                          · {product.unitsSold} units · {product.orders} orders
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-extrabold text-slate-800">{formatCurrency(product.revenue)}</p>
                        <Link to="/seller/products" className="text-[11px] font-bold text-brand-600 hover:text-brand-700">
                          View product
                        </Link>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>

          {/* ------------------------------ Product performance ------------------------------ */}
          <div className="admin-card overflow-hidden">
            <SectionHead
              icon={BarChart3}
              title="Product performance"
              sub="Orders and revenue per product"
              badge={
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500 ring-1 ring-inset ring-slate-200">
                  <Eye size={13} /> Views & cart tracking not enabled
                </span>
              }
            />
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                  <TrendingUp size={14} className="text-emerald-500" /> Best performer
                </div>
                {topProducts[0] ? (
                  <div className="mt-2">
                    <p className="truncate text-sm font-bold text-slate-800">{topProducts[0].name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {topProducts[0].orders} orders · {formatCurrency(topProducts[0].revenue)} revenue ·{' '}
                      {topProducts[0].unitsSold} units
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-slate-400">No sales yet.</p>
                )}
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                  <TrendingDown size={14} className="text-rose-500" /> Worst performer
                </div>
                {noSales.count > 0 ? (
                  <>
                    <p className="mt-2 text-sm font-bold text-slate-800">
                      {noSales.count} product{noSales.count === 1 ? '' : 's'} with no sales yet
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                      {noSales.products.join(', ')}
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-slate-400">Every product has sold.</p>
                )}
              </div>
            </div>
            {overview.productPerformance?.products?.length > 0 && (
              <div className="overflow-x-auto border-t border-slate-100">
                <table className="w-full min-w-[520px] text-left">
                  <thead>
                    <tr className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      <th className="px-6 py-3">Product</th>
                      <th className="px-6 py-3">Orders</th>
                      <th className="px-6 py-3">Revenue</th>
                      <th className="px-6 py-3">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {overview.productPerformance.products.map((product) => (
                      <tr key={product._id} className="transition hover:bg-slate-50/80">
                        <td className="max-w-[260px] truncate px-6 py-3 text-sm font-semibold text-slate-700">
                          {product.name}
                        </td>
                        <td className="px-6 py-3 text-sm font-semibold text-slate-600">{product.orders}</td>
                        <td className="px-6 py-3 text-sm font-bold text-slate-800">{formatCurrency(product.revenue)}</td>
                        <td className="px-6 py-3 text-sm font-semibold text-slate-600">
                          <span className="inline-flex items-center gap-1">
                            <Star size={13} className="fill-amber-400 text-amber-400" />
                            {Number(product.rating || 0).toFixed(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ------------------------------ Earnings + store performance ------------------------------ */}
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="admin-card">
              <SectionHead
                icon={Wallet}
                title="Earnings & payouts"
                sub="Your financial summary"
                badge={
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                    Payout monthly
                  </span>
                }
              />
              <div className="p-5">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <EarningsTile label="Total sales" value={formatCurrency(overview.earnings?.totalSales)} tone="brand" />
                  <EarningsTile
                    label={`Platform fee (${overview.earnings?.platformFeeRate}%)`}
                    value={formatCurrency(overview.earnings?.platformFee)}
                    tone="amber"
                  />
                  <EarningsTile label="Refunds" value={formatCurrency(overview.earnings?.refunds)} tone="rose" />
                  <EarningsTile label="Net earnings" value={formatCurrency(overview.earnings?.netEarnings)} tone="emerald" />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-4 text-white shadow-card">
                    <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-100">
                      <CircleDollarSign size={14} /> Pending payout
                    </p>
                    <p className="mt-2 font-display text-2xl font-extrabold tracking-tight">
                      {formatCurrency(overview.earnings?.pendingPayout)}
                    </p>
                    <p className="mt-1 text-xs text-emerald-100/90">
                      Pays out on {formatDate(overview.earnings?.nextPayout)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Payout history</p>
                    <p className="mt-2 text-sm text-slate-500">
                      {overview.earnings?.payoutHistory?.length > 0
                        ? `${overview.earnings.payoutHistory.length} payouts processed`
                        : 'No payouts yet — your earnings will be paid out at the end of each month.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-card">
              <SectionHead
                icon={Star}
                title="Store performance"
                sub="How your store is doing"
                badge={
                  overview.store?.rating > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-extrabold text-amber-700 ring-1 ring-inset ring-amber-200">
                      <Star size={13} className="fill-amber-400 text-amber-400" /> {overview.store?.rating}
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500 ring-1 ring-inset ring-slate-200">
                      No ratings yet
                    </span>
                  )
                }
              />
              <div className="space-y-4 p-5">
                <StoreMetricRow
                  label="Customer reviews"
                  value={overview.store?.reviews}
                  display={`${overview.store?.reviews} review${overview.store?.reviews === 1 ? '' : 's'}`}
                  percent={Math.min(overview.store?.reviews || 0, 100)}
                  gradient="from-brand-600 to-brand-400"
                />
                <StoreMetricRow
                  label="Order completion rate"
                  value={overview.store?.orderCompletionRate}
                  display={`${overview.store?.orderCompletionRate ?? 0}%`}
                  percent={overview.store?.orderCompletionRate}
                  gradient="from-emerald-600 to-emerald-400"
                />
                <StoreMetricRow
                  label="Cancellation rate"
                  value={overview.store?.cancellationRate}
                  display={`${overview.store?.cancellationRate ?? 0}%`}
                  percent={overview.store?.cancellationRate}
                  gradient="from-rose-500 to-rose-400"
                  invert
                />
                <StoreMetricRow
                  label="Return rate"
                  value={overview.store?.returnRate}
                  display={`${overview.store?.returnRate ?? 0}%`}
                  percent={Math.min(overview.store?.returnRate || 0, 100)}
                  gradient="from-sky-500 to-sky-400"
                  invert
                />
              </div>
            </div>
          </div>

          {/* ------------------------------ Store health + quick actions + notifications ------------------------------ */}
          <div className="admin-card">
            <SectionHead
              icon={Layers}
              title="Store health"
              sub="The state of your catalogue"
            />
            <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 lg:grid-cols-5">
              <HealthTile label="Live products" value={overview.storeHealth?.live} dot="bg-emerald-500" />
              <HealthTile label="Pending products" value={overview.storeHealth?.pending} dot="bg-amber-500" />
              <HealthTile label="Rejected products" value={overview.storeHealth?.rejected} dot="bg-red-500" />
              <HealthTile label="Low-stock products" value={overview.storeHealth?.lowStock} dot="bg-amber-500" />
              <HealthTile label="Out-of-stock products" value={overview.storeHealth?.outOfStock} dot="bg-red-500" />
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="admin-card">
              <SectionHead icon={Zap} title="Quick actions" sub="Jump to common tasks" />
              <div className="grid gap-3 p-5 sm:grid-cols-2">
                <QuickAction to="/seller/products?create=1" icon={PackagePlus} title="Add product" sub="List a new item" accent="from-brand-500 to-brand-700" />
                <QuickAction to="/seller/products" icon={Package} title="Manage products" sub="Edit your catalogue" accent="from-sky-500 to-violet-600" />
                <QuickAction to="/seller/orders" icon={ShoppingBag} title="Manage orders" sub="Process & ship" accent="from-emerald-500 to-teal-600" />
                <QuickAction to="/seller/products" icon={Boxes} title="Manage inventory" sub="Restock & update" accent="from-amber-500 to-orange-600" />
                <QuickAction to="/" icon={Store} title="View store" sub="See your storefront" accent="from-slate-600 to-slate-800" className="sm:col-span-2" />
              </div>
            </div>

            <div className="admin-card overflow-hidden">
              <SectionHead
                icon={Bell}
                title="Notifications"
                sub="Recent activity on your store"
                badge={
                  notifications.length > 0 ? (
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-600 ring-1 ring-inset ring-brand-200">
                      {notifications.length} updates
                    </span>
                  ) : null
                }
              />
              {notifications.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-slate-400">
                  No recent activity. New orders, approvals and stock alerts will appear here.
                </p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {notifications.map((notification, index) => {
                    const style = NOTIFICATION_STYLE[notification.type] || NOTIFICATION_STYLE.order;
                    const Icon = style.icon;
                    return (
                      <li key={`${notification.type}-${index}`}>
                        <Link
                          to={notification.link}
                          className="flex items-start gap-3 px-5 py-3 transition hover:bg-slate-50"
                        >
                          <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${style.tone}`}>
                            <Icon size={16} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold text-slate-700">{notification.message}</span>
                            <span className="mt-0.5 block text-[11px] text-slate-400">{timeAgo(notification.date)}</span>
                          </span>
                          <ArrowRight size={14} className="mt-1 shrink-0 text-slate-300" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ActionTile({ icon: Icon, tone, label, count, to }) {
  const clear = !count || count === 0;
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3.5 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card"
    >
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>
        <Icon size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-slate-800">{label}</span>
        <span className={`block text-[11px] font-semibold ${clear ? 'text-emerald-500' : 'text-slate-400'}`}>
          {clear ? 'Nothing to do' : 'Needs attention'}
        </span>
      </span>
      <span
        className={`flex h-7 min-w-[28px] shrink-0 items-center justify-center rounded-full px-2 text-xs font-extrabold ring-1 ring-inset ${
          clear ? 'bg-emerald-50 text-emerald-600 ring-emerald-200' : 'bg-slate-900 text-white ring-slate-900'
        }`}
      >
        {count || 0}
      </span>
    </Link>
  );
}

function MiniStat({ label, value, accent = 'text-slate-900' }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3">
      <p className="truncate text-xs font-semibold text-slate-500">{label}</p>
      <p className={`mt-1 truncate font-display text-lg font-extrabold tracking-tight ${accent}`}>{value}</p>
    </div>
  );
}

function InventoryTile({ label, value, sub, tone }) {
  const styles = {
    brand: { tile: 'from-brand-500 to-brand-700' },
    emerald: { tile: 'from-emerald-500 to-emerald-700' },
    amber: { tile: 'from-amber-400 to-amber-600' },
    rose: { tile: 'from-rose-500 to-rose-700' },
    sky: { tile: 'from-sky-500 to-sky-700' },
  };
  const palette = styles[tone] || styles.brand;
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-2 truncate text-xl font-extrabold tracking-tight text-slate-900">{value}</p>
      {sub ? <p className="mt-0.5 truncate text-[11px] text-slate-400">{sub}</p> : null}
      <span className={`mt-2 inline-block h-1 w-8 rounded-full bg-gradient-to-r ${palette.tile}`} />
    </div>
  );
}

function EarningsTile({ label, value, tone }) {
  const styles = {
    brand: 'text-brand-600',
    amber: 'text-amber-600',
    rose: 'text-rose-600',
    emerald: 'text-emerald-600',
  };
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4">
      <p className="truncate text-[11px] font-semibold text-slate-400">{label}</p>
      <p className={`mt-1.5 truncate font-display text-lg font-extrabold tracking-tight ${styles[tone] || styles.brand}`}>
        {value}
      </p>
    </div>
  );
}

function StoreMetricRow({ label, value, display, percent, gradient, invert }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-600">{label}</span>
        <span className={`font-extrabold ${invert && value > 0 ? 'text-rose-600' : 'text-slate-900'}`}>{display}</span>
      </div>
      <ProgressBar percent={percent} gradient={gradient} />
    </div>
  );
}

function HealthTile({ label, value, dot }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 text-center">
      <p className="mx-auto mb-2 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} /> {label}
      </p>
      <p className="font-display text-2xl font-extrabold tracking-tight text-slate-900">{value || 0}</p>
    </div>
  );
}