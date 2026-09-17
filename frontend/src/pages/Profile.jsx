import { Link } from 'react-router-dom';
import { CalendarDays, Mail, Package, ShieldCheck, User as UserIcon } from 'lucide-react';
import ProfileForm from '../components/profile/ProfileForm.jsx';
import ChangePasswordForm from '../components/profile/ChangePasswordForm.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { formatDate } from '../utils/helpers.js';

export default function Profile() {
  const { user, isAdmin } = useAuth();

  const initials = (user?.name || '?')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const details = [
    { icon: UserIcon, label: 'Full name', value: user?.name },
    { icon: Mail, label: 'Email', value: user?.email },
    { icon: ShieldCheck, label: 'Role', value: user?.role },
    { icon: CalendarDays, label: 'Member since', value: user?.createdAt ? formatDate(user.createdAt) : '-' },
  ];

  return (
    <div className="mx-auto max-w-5xl px-3 py-4 sm:px-4">
      <section className="rounded-md border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white">
              {initials}
            </span>
            <div>
              <h1 className="text-lg font-bold text-slate-800">{user?.name}</h1>
              <p className="text-sm text-slate-500">{user?.email}</p>
              <span className="mt-1 inline-block rounded-sm bg-brand-50 px-2 py-0.5 text-xs font-bold capitalize text-brand-700">
                {user?.role} account
              </span>
            </div>
          </div>

          <Link
            to="/orders"
            className="inline-flex items-center gap-2 rounded-sm bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
          >
            <Package size={16} /> My Orders
          </Link>
        </div>

        <dl className="grid divide-y divide-slate-100 sm:grid-cols-2 sm:divide-y-0">
          {details.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 px-5 py-4">
              <Icon size={18} className="shrink-0 text-slate-400" />
              <div className="min-w-0">
                <dt className="text-xs uppercase tracking-wide text-slate-400">{label}</dt>
                <dd className="truncate text-sm font-semibold capitalize text-slate-800">{value}</dd>
              </div>
              {label === 'Role' && isAdmin && (
                <span className="rounded-sm bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700">
                  Admin
                </span>
              )}
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <ProfileForm />
        <ChangePasswordForm />
      </div>
    </div>
  );
}
