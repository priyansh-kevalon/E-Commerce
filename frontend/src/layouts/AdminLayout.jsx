import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BadgePercent,
  Bell,
  ChevronRight,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  Store,
  Users,
  X,
} from 'lucide-react';
import { APP_NAME } from '../utils/constants.js';
import { useAuth } from '../hooks/useAuth.js';

const NAV = [
  {
    section: 'Overview',
    links: [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    section: 'Catalogue',
    links: [
      { to: '/admin/products', label: 'Products', icon: Package },
      { to: '/admin/categories', label: 'Categories', icon: FolderTree },
    ],
  },
  {
    section: 'Sales & customers',
    links: [
      { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
      { to: '/admin/users', label: 'Customers', icon: Users },
    ],
  },
  {
    section: 'Marketing',
    links: [{ to: '/admin/coupons', label: 'Coupons', icon: BadgePercent }],
  },
];

const PAGE_META = {
  '/admin': { title: 'Dashboard', subtitle: 'Store performance at a glance' },
  '/admin/products': { title: 'Products', subtitle: 'Create, edit and manage your catalogue' },
  '/admin/categories': { title: 'Categories', subtitle: 'Organise products into browsable groups' },
  '/admin/orders': { title: 'Orders', subtitle: 'Track and progress customer orders' },
  '/admin/users': { title: 'Customers', subtitle: 'Manage accounts, roles and access' },
  '/admin/coupons': { title: 'Coupons', subtitle: 'Create and manage discount codes' },
};

function getPageMeta(pathname) {
  const exact = PAGE_META[pathname];
  if (exact) return exact;
  const match = Object.keys(PAGE_META)
    .sort((a, b) => b.length - a.length)
    .find((key) => pathname.startsWith(key));
  return PAGE_META[match] || { title: 'Admin', subtitle: 'Manage your store' };
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const meta = getPageMeta(location.pathname);

  const initials = (user?.name || 'A')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
      isActive
        ? 'bg-gradient-to-r from-brand-600/25 via-brand-700/10 to-transparent text-white ring-1 ring-inset ring-white/10'
        : 'text-slate-400 hover:bg-white/5 hover:text-white'
    }`;

  const sidebar = (
    <>
      <div className="flex h-[4.5rem] items-center gap-3 border-b border-white/10 px-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 text-white shadow-glow ring-1 ring-white/20">
          <Store size={20} />
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate font-display text-base font-extrabold tracking-tight text-white">
            {APP_NAME}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-300/90">
            Admin panel
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
        {NAV.map((group) => (
          <div key={group.section}>
            <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              {group.section}
            </p>
            <div className="space-y-1">
              {group.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={linkClass}
                  onClick={() => setOpen(false)}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-brand-300 to-brand-500" />
                      )}
                      <link.icon
                        size={18}
                        className={`shrink-0 transition ${isActive ? 'text-brand-300' : 'group-hover:text-white'}`}
                      />
                      <span className="truncate">{link.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          to="/"
          className="mb-2 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          <Store size={18} className="shrink-0" />
          <span className="flex-1">View store</span>
          <ChevronRight size={15} className="text-slate-500" />
        </Link>

        <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-inset ring-white/10">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 text-sm font-bold text-white ring-1 ring-white/20">
              {initials}
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
              <p className="truncate text-[11px] capitalize text-slate-400">{user?.role}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Log out"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-500/15 hover:text-red-400"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="admin-bg min-h-screen">
      {/* Desktop sidebar */}
      <aside className="admin-sidebar fixed inset-y-0 left-0 z-40 hidden w-72 flex-col lg:flex">
        {sidebar}
      </aside>

      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="admin-sidebar absolute inset-y-0 left-0 flex w-72 flex-col animate-drawer">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-xl sm:px-6 lg:h-[4.5rem]">
          <button
            type="button"
            aria-label="Toggle sidebar"
            onClick={() => setOpen((value) => !value)}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="min-w-0">
            <nav className="hidden items-center gap-1.5 text-xs text-slate-400 sm:flex">
              <span>Admin</span>
              <ChevronRight size={12} />
              <span className="font-medium text-brand-600">{meta.title}</span>
            </nav>
            <h1 className="truncate font-display text-lg font-extrabold tracking-tight text-slate-900 lg:text-xl">
              {meta.title}
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm ring-1 ring-slate-200">
              <Bell size={17} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-white" />
            </span>

            <span className="h-8 w-px bg-slate-200" />

            <div className="hidden text-right leading-tight sm:block">
              <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
              <p className="text-[11px] capitalize text-slate-500">{user?.role}</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 text-sm font-bold text-white shadow-glow ring-2 ring-white">
              {initials}
            </span>
          </div>
        </header>

        <main className="px-4 pb-12 pt-6 sm:px-6 lg:px-8">
          <div key={location.pathname} className="mx-auto max-w-[1500px] animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}