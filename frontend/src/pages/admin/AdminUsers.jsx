import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  BadgeCheck,
  CalendarDays,
  Clock3,
  RotateCcw,
  Search,
  ShieldCheck,
  Store,
  Trash2,
  UsersRound,
  XCircle,
} from 'lucide-react';
import Loader from '../../components/common/Loader.jsx';
import {
  fetchUsers,
  updateUser,
  deleteUser,
  decideSellerRequest,
} from '../../services/adminService.js';
import { useAuth } from '../../hooks/useAuth.js';
import { formatDate } from '../../utils/helpers.js';

const AVATAR_GRADIENTS = [
  'from-brand-500 to-brand-700',
  'from-sky-500 to-sky-700',
  'from-violet-500 to-violet-700',
  'from-rose-500 to-rose-700',
  'from-emerald-500 to-emerald-700',
  'from-amber-500 to-amber-700',
];

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [notice, setNotice] = useState({ type: '', message: '' });
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState('');
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const requestsRef = useRef(null);
  const location = useLocation();

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await fetchUsers({ search: query || undefined, role: role || undefined });
      setUsers(data);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, [query, role, reloadKey]);

  // Kept separate from the main table so it always shows every applicant
  // awaiting review, regardless of the search/role filters above.
  const loadRequests = useCallback(async () => {
    setRequestsLoading(true);
    setRequestsError('');
    try {
      const data = await fetchUsers({ sellerStatus: 'pending' });
      setRequests(data);
    } catch (err) {
      setRequestsError(err.message);
    } finally {
      setRequestsLoading(false);
    }
  }, [reloadKey]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  // Lets the admin bell deep-link straight to this section.
  const focusRequests = location.hash === '#seller-requests';
  useEffect(() => {
    if (focusRequests && !requestsLoading && requestsRef.current) {
      requestsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [focusRequests, requestsLoading]);

  // An application may be settled from the notification bell, so stay in sync.
  useEffect(() => {
    const onDecided = () => loadRequests();
    window.addEventListener('seller-request-decided', onDecided);
    return () => window.removeEventListener('seller-request-decided', onDecided);
  }, [loadRequests]);

  const admins = users.filter((item) => item.role === 'admin').length;
  const sellers = users.filter((item) => item.role === 'seller').length;
  const active = users.filter((item) => item.isActive).length;

  const handleSearch = (event) => {
    event.preventDefault();
    setQuery(search.trim());
  };

  const applyUpdate = async (target, payload) => {
    setBusyId(target._id);
    try {
      const updated = await updateUser(target._id, payload);
      setUsers((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
      setNotice({ type: 'success', message: 'User updated successfully.' });
    } catch (err) {
      setNotice({ type: 'error', message: err.message });
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (target) => {
    if (!window.confirm(`Delete ${target.name}? This cannot be undone.`)) return;
    setBusyId(target._id);
    try {
      await deleteUser(target._id);
      setUsers((prev) => prev.filter((item) => item._id !== target._id));
      setNotice({ type: 'success', message: 'User deleted successfully.' });
    } catch (err) {
      setNotice({ type: 'error', message: err.message });
    } finally {
      setBusyId(null);
    }
  };

  const initialsOf = (name = 'A') =>
    name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

  const handleDecision = async (target, status, note = '') => {
    setBusyId(target._id);
    try {
      const updated = await decideSellerRequest(target._id, status, note);
      setRequests((prev) => prev.filter((item) => item._id !== updated._id));
      // The main table's role cell should reflect a promotion straight away.
      setUsers((prev) =>
        prev.map((item) => (item._id === updated._id ? { ...item, ...updated } : item))
      );
      setNotice({
        type: 'success',
        message:
          status === 'approved'
            ? `${target.name} is now a seller.`
            : `${target.name}'s application was rejected.`,
      });
      setRejectingId(null);
      setRejectNote('');
    } catch (err) {
      setNotice({ type: 'error', message: err.message });
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (target) => {
    const note = rejectNote.trim();
    if (note && !window.confirm(`Reject ${target.name}'s application?`)) return;
    await handleDecision(target, 'rejected', note);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">Customers</h1>
        <p className="mt-1 text-sm text-slate-500">
          {users.length ? `${users.length} user${users.length === 1 ? '' : 's'} · ${active} active · ${admins} admin${admins === 1 ? '' : 's'} · ${sellers} seller${sellers === 1 ? '' : 's'}` : 'Manage accounts, roles and access.'}
        </p>
      </div>

      {notice.message && (
        <div
          className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm shadow-sm ${
            notice.type === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border border-red-200 bg-red-50 text-red-700'
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${notice.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
          {notice.message}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="w-full max-w-sm">
          <div className="relative">
            <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or email..."
              aria-label="Search customers"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            />
          </div>
        </form>

        <select
          value={role}
          onChange={(event) => setRole(event.target.value)}
          aria-label="Filter by role"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        >
          <option value="">All roles</option>
          <option value="customer">Customers</option>
          <option value="seller">Sellers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {requestsError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          Could not load seller applications: {requestsError}
        </div>
      )}

      {requests.length > 0 && (
        <section ref={requestsRef} id="seller-requests" className="admin-card overflow-hidden scroll-mt-24">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 bg-amber-50 px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Store size={17} />
              </span>
              <div>
                <h2 className="font-display text-sm font-extrabold text-amber-900">
                  Seller applications
                </h2>
                <p className="text-xs text-amber-700">
                  {requests.length} awaiting your decision
                </p>
              </div>
            </div>
          </div>

          <ul className="divide-y divide-slate-100">
            {requests.map((item) => (
              <li key={item._id} className="space-y-3 px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3.5">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold text-white shadow-sm ${
                        AVATAR_GRADIENTS[requests.indexOf(item) % AVATAR_GRADIENTS.length]
                      }`}
                    >
                      {initialsOf(item.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">{item.name}</p>
                      <p className="truncate text-xs text-slate-400">{item.email}</p>
                      <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-700">
                        <Clock3 size={12} />
                        Applied {formatDate(item.sellerRequestedAt || item.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      disabled={busyId === item._id}
                      onClick={() => handleDecision(item, 'approved')}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-xs font-bold text-white shadow-glow transition hover:bg-brand-700 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                    >
                      <BadgeCheck size={14} />
                      {busyId === item._id ? 'Working…' : 'Approve'}
                    </button>
                    <button
                      type="button"
                      disabled={busyId === item._id}
                      onClick={() =>
                        setRejectingId((id) => (id === item._id ? null : item._id))
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-3.5 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                </div>

                {rejectingId === item._id && (
                  <div className="flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 p-3">
                    <input
                      type="text"
                      value={rejectNote}
                      onChange={(event) => setRejectNote(event.target.value)}
                      maxLength={300}
                      placeholder="Optional reason, shown to the applicant"
                      aria-label="Rejection reason"
                      className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    />
                    <button
                      type="button"
                      disabled={busyId === item._id}
                      onClick={() => handleReject(item)}
                      className="rounded-lg bg-red-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-red-700 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                    >
                      Confirm reject
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRejectingId(null);
                        setRejectNote('');
                      }}
                      className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="admin-card overflow-hidden">
        {loading ? (
          <Loader label="Loading customers..." />
        ) : loadError ? (
          <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
            <p className="text-sm text-red-600">{loadError}</p>
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <RotateCcw size={15} /> Try again
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-5 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <UsersRound size={22} />
            </span>
            <p className="text-sm text-slate-400">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table min-w-[720px]">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Active</th>
                  <th>Joined</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item, index) => {
                  const isSelf = item._id === currentUser?._id;
                  return (
                    <tr key={item._id}>
                      <td>
                        <div className="flex items-center gap-3.5">
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold text-white shadow-sm ${
                              AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length]
                            }`}
                          >
                            {initialsOf(item.name)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">
                              {item.name}
                              {isSelf && (
                                <span className="ml-2 rounded-md bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold text-brand-600 ring-1 ring-inset ring-brand-200">
                                  you
                                </span>
                              )}
                            </p>
                            <p className="truncate text-xs text-slate-400">{item.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        {isSelf ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700 ring-1 ring-inset ring-violet-200">
                            <ShieldCheck size={13} /> Admin
                          </span>
                        ) : (
                          <select
                            value={item.role}
                            disabled={busyId === item._id}
                            onChange={(event) => applyUpdate(item, { role: event.target.value })}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="customer">Customer</option>
                            <option value="seller">Seller</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          disabled={isSelf || busyId === item._id}
                          onClick={() => applyUpdate(item, { isActive: !item.isActive })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            item.isActive ? 'bg-gradient-to-r from-brand-500 to-brand-600 shadow-glow' : 'bg-slate-300'
                          }`}
                          aria-label="Toggle active"
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                              item.isActive ? 'translate-x-[22px]' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </td>
                      <td>
                        <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                          <CalendarDays size={13} className="text-slate-400" />
                          {formatDate(item.createdAt)}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          type="button"
                          disabled={isSelf || busyId === item._id}
                          onClick={() => handleDelete(item)}
                          aria-label="Delete user"
                          className="admin-btn-icon danger disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}