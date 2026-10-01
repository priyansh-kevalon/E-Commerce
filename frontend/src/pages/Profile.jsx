import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Heart,
  LifeBuoy,
  LogOut,
  Package,
  ShieldCheck,
  Store,
  UserCircle2,
  User as UserIcon,
} from 'lucide-react';
import ProfileForm from '../components/profile/ProfileForm.jsx';
import ChangePasswordForm from '../components/profile/ChangePasswordForm.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { formatDate } from '../utils/helpers.js';

const NAV_LINKS = [
  { to: '/profile', label: 'Account', icon: UserIcon, end: true },
  { to: '/orders', label: 'My orders', icon: Package },
  { to: '/wishlist', label: 'My wishlist', icon: Heart },
];

const navClass = ({ isActive }) =>
  `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
    isActive
      ? 'bg-brand-50 text-brand-800 ring-1 ring-inset ring-brand-200'
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
  }`;

export default function Profile() {
  const { user, isAdmin, isSeller, logout } = useAuth();
  const navigate = useNavigate();

  const initials = (user?.name || '?')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const firstName = (user?.name || 'there').split(' ')[0];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const roleLabel =
    user?.role === 'admin' ? 'Administrator' : user?.role === 'seller' ? 'Seller' : 'Customer';
  const roleAccent =
    user?.role === 'admin'
      ? 'text-violet-600 bg-violet-50'
      : user?.role === 'seller'
      ? 'text-amber-600 bg-amber-50'
      : 'text-brand-600 bg-brand-50';

  const details = [
    {
      icon: ShieldCheck,
      label: 'Account role',
      value: roleLabel,
      accent: roleAccent,
    },
    {
      icon: CalendarDays,
      label: 'Member since',
      value: user?.createdAt ? formatDate(user.createdAt) : '-',
      accent: 'text-sky-600 bg-sky-50',
    },
    {
      icon: UserCircle2,
      label: 'Account status',
      value: user?.isActive === false ? 'Inactive' : 'Active',
      accent: 'text-emerald-600 bg-emerald-50',
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">My account</p>
        <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Hi, {firstName} 👋
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 sm:mt-2">
          Manage your personal details, keep your account secure and track your orders.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
        {/* Account navigation */}
        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="admin-card overflow-hidden">
            <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 to-brand-800 px-5 pb-5 pt-6 text-white">
              <div className="dotted pointer-events-none absolute inset-0 opacity-30" />
              <div className="relative">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold ring-1 ring-inset ring-white/25 backdrop-blur">
                  {initials}
                </span>
                <p className="mt-3 truncate font-display text-base font-extrabold">{user?.name}</p>
                <p className="truncate text-xs text-white/70">{user?.email}</p>
              </div>
            </div>

            <nav className="p-3">
              <div className="space-y-1">
                {NAV_LINKS.map((link) => (
                  <NavLink key={link.to} to={link.to} end={link.end} className={navClass}>
                    <link.icon size={18} className="shrink-0 opacity-80" />
                    <span>{link.label}</span>
                  </NavLink>
                ))}
                {isSeller && (
                  <NavLink to="/seller" className={navClass}>
                    <Store size={18} className="shrink-0 opacity-80" />
                    <span>Seller center</span>
                  </NavLink>
                )}
                {isAdmin && (
                  <NavLink to="/admin" className={navClass}>
                    <Store size={18} className="shrink-0 opacity-80" />
                    <span>Admin panel</span>
                  </NavLink>
                )}
              </div>

              <div className="mt-3 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={18} className="shrink-0" />
                  Sign out
                </button>
              </div>
            </nav>
          </div>

          <div className="admin-card flex items-start gap-3 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <LifeBuoy size={17} />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800">Need help?</p>
              <Link to="/" className="mt-0.5 block text-xs font-medium text-brand-600 hover:text-brand-700">
                Visit the help centre →
              </Link>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="space-y-6">
          <section className="admin-card grid divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {details.map(({ icon: Icon, label, value, accent }) => (
              <div key={label} className="flex items-center gap-3.5 px-5 py-4">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent}`}>
                  <Icon size={18} />
                </span>
                <div className="min-w-0">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</dt>
                  <dd className="mt-0.5 truncate text-sm font-bold capitalize text-slate-800">{value}</dd>
                </div>
              </div>
            ))}
          </section>

          <ProfileForm />
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}