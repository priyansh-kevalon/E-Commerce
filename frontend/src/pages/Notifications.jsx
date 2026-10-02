import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import {
  BadgeCheck,
  Bell,
  CheckCheck,
  ClipboardCheck,
  Loader2,
  LogIn,
  Package,
  PencilLine,
  Sparkles,
  Store,
  Tag,
  UserPlus,
  X,
} from 'lucide-react';
import {
  clearNotifications,
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../services/notificationService.js';

const ICON_BY_TYPE = {
  order_placed: Package,
  order_status: Package,
  order_cancelled: X,
  new_order: Tag,
  new_product: Sparkles,
  product_submitted: ClipboardCheck,
  product_updated: PencilLine,
  product_sold: BadgeCheck,
  low_stock: Tag,
  product_status: CheckCheck,
  seller_request: Store,
  seller_approved: BadgeCheck,
  seller_rejected: X,
  user_registered: UserPlus,
  user_login: LogIn,
};

const TONE_BY_TYPE = {
  order_cancelled: 'bg-red-50 text-red-600',
  new_order: 'bg-amber-50 text-amber-600',
  new_product: 'bg-brand-50 text-brand-700',
  product_submitted: 'bg-violet-50 text-violet-600',
  product_updated: 'bg-sky-50 text-sky-600',
  product_sold: 'bg-emerald-50 text-emerald-600',
  seller_request: 'bg-amber-50 text-amber-600',
  seller_approved: 'bg-emerald-50 text-emerald-600',
  seller_rejected: 'bg-red-50 text-red-600',
  user_registered: 'bg-indigo-50 text-indigo-600',
  user_login: 'bg-slate-100 text-slate-600',
};

const fullTimestamp = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

export default function Notifications() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchNotifications({ limit: 50 });
      setItems(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (requestError) {
      setError(requestError.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    fetchNotifications({ limit: 50 })
      .then((data) => {
        if (!active) return;
        setItems(data.notifications);
        setUnreadCount(data.unreadCount);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleMarkAll = async () => {
    try {
      const data = await markAllNotificationsRead();
      setUnreadCount(data.unreadCount);
      setItems((prev) => prev.map((item) => ({ ...item, read: true })));
    } catch {
      // Best-effort; the list is reconciled on the next load.
    }
  };

  const handleOpen = async (item) => {
    if (item.read) return;
    try {
      const data = await markNotificationRead(item.id);
      setUnreadCount(data.unreadCount);
      setItems((prev) =>
        prev.map((entry) => (entry.id === item.id ? { ...entry, read: true } : entry))
      );
    } catch {
      // Ignore.
    }
  };

  const handleClearAll = async () => {
    try {
      await clearNotifications();
      setItems([]);
      setUnreadCount(0);
    } catch {
      // Ignore.
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-3 py-6 sm:px-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {unreadCount > 0
              ? `${unreadCount} unread`
              : 'You are all caught up.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAll}
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-2 text-xs font-bold text-brand-700 transition hover:border-brand-400 hover:bg-brand-100"
            >
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
          {items.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-3.5 py-2 text-xs font-bold text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              <X size={14} /> Clear all
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-2 px-4 py-16 text-sm text-slate-500">
            <Loader2 size={16} className="animate-spin" /> Loading notifications
          </div>
        ) : error ? (
          <div className="px-4 py-16 text-center">
            <p className="text-sm font-semibold text-red-600">{error}</p>
            <button
              type="button"
              onClick={load}
              className="mt-3 rounded-full border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Try again
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Bell size={24} />
            </span>
            <p className="mt-4 text-sm font-semibold text-slate-700">No notifications yet</p>
            <p className="mt-1 text-xs text-slate-500">
              Order updates, offers and seller alerts will appear here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((item) => {
              const Icon = ICON_BY_TYPE[item.type] || Bell;
              const tone = TONE_BY_TYPE[item.type] || 'bg-brand-50 text-brand-700';
              // Seller requests are also sent to sellers, who cannot open
              // /admin/users, so only admins get the link.
              const href =
                item.link && (item.type !== 'seller_request' || isAdmin) ? item.link : '';

              const inner = (
                <>
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tone}`}
                  >
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-sm leading-snug ${
                        item.read
                          ? 'font-medium text-slate-600'
                          : 'font-bold text-slate-900'
                      }`}
                    >
                      {item.title}
                    </span>
                    {item.body && (
                      <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                        {item.body}
                      </span>
                    )}
                    <span className="mt-1.5 block text-[11px] font-medium text-slate-400">
                      {fullTimestamp(item.createdAt)}
                    </span>
                  </span>
                  {!item.read && (
                    <span
                      aria-hidden="true"
                      className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-600"
                    />
                  )}
                </>
              );

              return (
                <li key={item.id}>
                  {href ? (
                    <Link
                      to={href}
                      onClick={() => handleOpen(item)}
                      className="flex items-start gap-3 px-4 py-4 transition hover:bg-slate-50"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpen(item)}
                      className="flex w-full items-start gap-3 px-4 py-4 text-left transition hover:bg-slate-50"
                    >
                      {inner}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
