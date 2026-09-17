import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
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

const LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/users', label: 'Users', icon: Users },
];

const linkClass = ({ isActive }) =>
  `group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
    isActive
      ? 'bg-gradient-to-r from-brand-700/30 to-brand-900/20 text-white ring-1 ring-white/15'
      : 'text-slate-400 hover:bg-white/5 hover:text-white'
  }`;

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

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

  const sidebar = (
    <>
      <div className="relative flex h-16 items-center gap-2 overflow-hidden border-b border-white/10 px-5 text-white">
        <div className="pointer-events-none absolute inset-0 bg-radial-brand opacity-40" />
        <Store size={22} className="relative text-brand-300" />
        <span className="relative font-display text-base font-extrabold tracking-tight">
          {APP_NAME}
        </span>
        <span className="relative ml-1 rounded-md bg-gradient-to-r from-brand-700 to-brand-900 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          Admin
        </span>
      </div>

      <p className="px-5 pb-1 pt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
        Manage
      </p>
      <nav className="flex-1 space-y-1 p-3 pt-1">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            <link.icon size={18} className="shrink-0" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/10 p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          <Store size={18} /> View store
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-red-400 transition hover:bg-white/5 hover:text-red-300"
        >
          <LogOut size={18} /> Log out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-ink lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-950/60 to-transparent" />
        <div className="relative flex h-full flex-col">{sidebar}</div>
      </aside>

      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-ink">{sidebar}</aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur-xl sm:px-6">
          <button
            type="button"
            aria-label="Toggle sidebar"
            onClick={() => setOpen((value) => !value)}
            className="rounded-md p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div>
            <p className="font-display text-sm font-bold text-slate-900">Admin panel</p>
            <p className="hidden text-xs text-slate-500 sm:block">
              Manage your store, catalogue and orders
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight text-slate-800">{user?.name}</p>
              <p className="text-xs capitalize text-slate-500">{user?.role}</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-700 to-brand-900 text-sm font-bold text-white shadow-glow">
              {initials}
            </span>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <div key={location.pathname} className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
