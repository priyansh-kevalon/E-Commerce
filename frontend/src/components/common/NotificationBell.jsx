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
  PencilLine,
  Sparkles,
  Store,
  Tag,
  X,
  XCircle,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import useUnreadNotifications from '../../hooks/useUnreadNotifications.js';
import { decideSellerRequest } from '../../services/adminService.js';
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
  product_updated: PencilLine,
  product_sold: BadgeCheck,
  low_stock: Tag,
  product_status: Check,
  seller_request: Store,
  seller_approved: BadgeCheck,
  seller_rejected: X,
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
  const { isAuthenticated, isAdmin } = useAuth();
  const { unreadCount, setUnreadCount } = useUnreadNotifications();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  // Notification id currently being approved/rejected, so only that row spins.
  const [actingId, setActingId] = useState(null);
  // Notification id showing the optional rejection-reason input.
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const [actionError, setActionError] = useState({ id: null, message: '' });
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

  const closeRejectInput = () => {
    setRejectingId(null);
    setRejectNote('');
  };

  /**
   * Approve or reject a seller application without leaving the bell. On success
   * the notification is retired, because the request it points at is settled.
   */
  const handleDecision = async (item, status, note = '') => {
    const applicantId = item.meta?.userId;
    if (!applicantId) return;

    setActingId(item.id);
    setActionError({ id: null, message: '' });
    try {
      await decideSellerRequest(applicantId, status, note);
      setItems((prev) => prev.filter((entry) => entry.id !== item.id));
      setUnreadCount((count) => Math.max(0, count - (item.read ? 0 : 1)));
      closeRejectInput();
      // Keep any Admin Users list open elsewhere in sync with this decision.
      window.dispatchEvent(
        new CustomEvent('seller-request-decided', { detail: { id: applicantId, status } })
      );
    } catch (err) {
      setActionError({ id: item.id, message: err.message });
    } finally {
      setActingId(null);
    }
  };

  // A seller request is only actionable by an admin, and only while the
  // notification still carries the applicant it refers to.
  const isActionable = (item) =>
    isAdmin && item.type === 'seller_request' && Boolean(item.meta?.userId);

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
                  const actionable = isActionable(item);
                  const busy = actingId === item.id;
                  // Seller requests are also sent to sellers, who have no
                  // access to /admin/users, so only admins get the link.
                  const href =
                    item.link && (item.type !== 'seller_request' || isAdmin)
                      ? item.link
                      : '';

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

                  // Approve / Reject controls, rendered under an actionable
                  // seller request.
                  const actions = actionable ? (                    <div className="mt-2.5 pl-12">
                      {rejectingId === item.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={rejectNote}
                            onChange={(event) => setRejectNote(event.target.value)}
                            maxLength={300}
                            placeholder="Optional reason, shown to the applicant"
                            aria-label="Rejection reason"
                            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                          />
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => handleDecision(item, 'rejected', rejectNote.trim())}
                              className="rounded-lg bg-red-600 px-2.5 py-1.5 text-[11px] font-bold text-white transition hover:bg-red-700 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                            >
                              {busy ? 'Working…' : 'Confirm reject'}
                            </button>
                            <button
                              type="button"
                              onClick={closeRejectInput}
                              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleDecision(item, 'approved')}
                            className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-glow transition hover:bg-brand-700 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                          >
                            {busy ? <Loader2 size={12} className="animate-spin" /> : <BadgeCheck size={12} />}
                            Approve
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => {
                              setRejectingId(item.id);
                              setActionError({ id: null, message: '' });
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-300 bg-white px-2.5 py-1.5 text-[11px] font-bold text-red-600 transition hover:bg-red-50 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                          >
                            <XCircle size={12} /> Reject
                          </button>
                        </div>
                      )}

                      {actionError.id === item.id && (
                        <p className="mt-2 text-[11px] font-semibold text-red-600">
                          {actionError.message}
                        </p>
                      )}
                    </div>
                  ) : null;

                  return (
                    <li key={item.id} className="px-4 py-3">
                      {actionable ? (
                        // Not a link: clicking the row must not navigate away
                        // while the decision controls are right underneath.
                        <div className="flex items-start gap-3">
                          {body}
                        </div>
                      ) : href ? (
                        <Link
                          to={href}
                          onClick={() => handleOpenItem(item)}
                          className="-mx-4 -my-3 flex items-start gap-3 px-4 py-3 transition hover:bg-slate-50"
                        >
                          {body}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenItem(item)}
                          className="-mx-4 -my-3 flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                        >
                          {body}
                        </button>
                      )}
                      {actions}
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
