import { useState } from 'react';
import { BadgeCheck, Clock3, Store, XCircle } from 'lucide-react';
import { requestSellerAccount } from '../../services/userService.js';

const STATE = {
  none: {
    icon: Store,
    tone: 'text-amber-600 bg-amber-50',
    title: 'Sell on Kevalon',
    blurb: 'Apply to become a seller and start listing your products.',
  },
  pending: {
    icon: Clock3,
    tone: 'text-sky-600 bg-sky-50',
    title: 'Application under review',
    blurb: 'An admin is reviewing your application. You will be notified once it is decided.',
  },
  approved: {
    icon: BadgeCheck,
    tone: 'text-emerald-600 bg-emerald-50',
    title: 'You are a seller',
    blurb: 'Your seller account is approved. Head to your dashboard to start selling.',
  },
  rejected: {
    icon: XCircle,
    tone: 'text-red-600 bg-red-50',
    title: 'Application not approved',
    blurb: 'You can apply again, or update your details first.',
  },
};

/**
 * Self-service seller application. The account only becomes a seller once an
 * admin approves, so the card mirrors the server's sellerStatus.
 */
export default function SellerRequestCard({ user, isSeller, isAdmin }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // Keep local state in step with the server after a successful submit.
  const status = isSeller ? 'approved' : isAdmin ? 'none' : user?.sellerStatus || 'none';
  const config = STATE[status] ?? STATE.none;
  const Icon = config.icon;

  // Admins and existing sellers have nothing to apply for.
  if (isSeller || isAdmin) return null;

  const canApply = status !== 'pending';
  const note = user?.sellerNote;

  const handleApply = async () => {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await requestSellerAccount();
      setNotice('Application submitted. An admin has been notified.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="admin-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${config.tone}`}>
            <Icon size={20} />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-base font-extrabold text-slate-900">{config.title}</h2>
            <p className="mt-1 max-w-prose text-sm text-slate-600">{config.blurb}</p>
          </div>
        </div>

        {canApply && (
          <button
            type="button"
            onClick={handleApply}
            disabled={busy}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-600 px-4 py-2.5 text-xs font-bold text-white shadow-glow transition hover:bg-brand-700 active:scale-95 disabled:pointer-events-none disabled:opacity-60"
          >
            <Store size={14} />
            {busy ? 'Submitting…' : 'Become a Seller'}
          </button>
        )}
      </div>

      {status === 'pending' && (
        <p className="mt-4 rounded-xl bg-sky-50 px-3.5 py-2.5 text-xs font-semibold text-sky-700">
          Pending approval. Please wait for an admin to review it.
        </p>
      )}

      {status === 'rejected' && note && (
        <p className="mt-4 rounded-xl bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-700">
          Admin note: {note}
        </p>
      )}

      {notice && (
        <p className="mt-4 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-xs font-semibold text-emerald-700">
          {notice}
        </p>
      )}

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-700">{error}</p>
      )}
    </section>
  );
}
