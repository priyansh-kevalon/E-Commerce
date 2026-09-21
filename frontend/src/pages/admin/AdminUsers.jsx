import { useCallback, useEffect, useState } from 'react';
import {
  CalendarDays,
  RotateCcw,
  Search,
  ShieldCheck,
  Trash2,
  UsersRound,
} from 'lucide-react';
import Loader from '../../components/common/Loader.jsx';
import { fetchUsers, updateUser, deleteUser } from '../../services/adminService.js';
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

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

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