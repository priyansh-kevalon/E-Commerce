import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BadgeCheck,
  Bell,
  Check,
  CheckCheck,
  ClipboardCheck,
  Loader2,
  Package,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import useUnreadNotifications from '../../hooks/useUnreadNotifications.js';
import {
  clearNotifications,
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../services/notificationService.js';

const ICON_BY_TYPE = {
  order_placed: Package,
  order_status: Package,
  order_cancelled: X,
  new_order: Tag,
  new_product: Sparkles,
  product_submitted: ClipboardCheck,
  product_sold: BadgeCheck,
  low_stock: Tag,
  product_status: Check,
};

const TONE_BY_TYPE = {
  order_cancelled: 'bg-red-50 text-red-600',
  new_order: 'bg-amber-50 text-amber-600',
  new_product: 'bg-brand-50 text-brand-700',
  product_submitted: 'bg-violet-50 text-violet-600',
  product_sold: 'bg-emerald-50 text-emerald-600',
};

const timeAgo = (value) => {
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return '';

  const seconds = Math.max(0, Math.round((Date.now() - then) / 1000));
  if (seconds < 60) return 'just now';

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(then));
};

export default function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const { unreadCount, setUnreadCount } = useUnreadNotifications();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  const loadPanel = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await fetchNotifications({ limit: 20 });
      setItems(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, setUnreadCount]);

  useEffect(() => {
    if (open) loadPanel();
  }, [open, loadPanel]);

  useEffect(() => {
    if (!open) return undefined;

    const onClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const handleToggle = () => {
    if (!isAuthenticated) return;
    setOpen((value) => !value);
  };

  const handleMarkAll = async () => {
    try {
      const data = await markAllNotificationsRead();
      setUnreadCount(data.unreadCount);
      setItems((prev) => prev.map((item) => ({ ...item, read: true })));
    } catch {
      // Keep the panel as-is; the next poll will reconcile.
    }
  };

  const handleOpenItem = async (item) => {
    setOpen(false);
    if (item.read) return;
    try {
      const data = await markNotificationRead(item.id);
      setUnreadCount(data.unreadCount);
    } catch {
      // Marking read is best-effort.
    }
  };

  const handleClearAll = async () => {
    try {
      await clearNotifications();
      setItems([]);
      setUnreadCount(0);
    } catch {
      // Ignore; the list simply stays as-is.
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={open}
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : 'Notifications'
        }
        className={`relative flex h-9 items-center gap-1.5 rounded-full px-2 transition active:scale-95 sm:h-10 sm:px-2.5 ${
          open
            ? 'bg-brand-50 text-brand-700'
            : 'text-slate-600 hover:bg-slate-100 hover:text-brand-700'
        }`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span
            key={unreadCount}
            className="absolute right-0.5 top-0.5 flex min-w-[18px] animate-badge items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold leading-[18px] text-white"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 flex max-h-[70vh] w-[min(22rem,calc(100vw-2rem))] animate-fade-in flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-luxe">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-extrabold text-slate-900">Notifications</p>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAll}
                  className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold text-brand-700 transition hover:bg-brand-50"
                >
                  <CheckCheck size={12} /> Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close notifications"
                className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {loading && items.length === 0 ? (
              <div className="flex items-center justify-center gap-2 px-4 py-10 text-sm text-slate-500">
                <Loader2 size={16} className="animate-spin" /> Loading notifications
              </div>
            ) : items.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <Bell size={20} />
                </span>
                <p className="mt-3 text-sm font-semibold text-slate-700">No notifications yet</p>
                <p className="mt-1 text-xs text-slate-500">
                  Order updates and offers will show up here.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {items.map((item) => {
                  const Icon = ICON_BY_TYPE[item.type] || Bell;
                  const tone = TONE_BY_TYPE[item.type] || 'bg-brand-50 text-brand-700';

                  const body = (
                    <>
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${tone}`}
                      >
                        <Icon size={16} />
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
                          <span className="mt-0.5 block text-xs leading-snug text-slate-500">
                            {item.body}
                          </span>
                        )}
                        <span className="mt-1 block text-[11px] font-medium text-slate-400">
                          {timeAgo(item.createdAt)}
                        </span>
                      </span>
                      {!item.read && (
                        <span
                          aria-hidden="true"
                          className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-600"
                        />
                      )}
                    </>
                  );

                  return (
                    <li key={item.id}>
                      {item.link ? (
                        <Link
                          to={item.link}
                          onClick={() => handleOpenItem(item)}
                          className="flex items-start gap-3 px-4 py-3 transition hover:bg-slate-50"
                        >
                          {body}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenItem(item)}
                          className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                        >
                          {body}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-slate-100 px-2 py-2">
              <button
                type="button"
                onClick={handleClearAll}
                className="w-full rounded-lg py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-50 hover:text-red-600"
              >
                Clear all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
