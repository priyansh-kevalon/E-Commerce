import { useCallback, useEffect, useState } from 'react';
import { RotateCcw, Search, ShieldCheck, Trash2, User as UserIcon } from 'lucide-react';
import Loader from '../../components/common/Loader.jsx';
import { fetchUsers, updateUser, deleteUser } from '../../services/adminService.js';
import { useAuth } from '../../hooks/useAuth.js';
import { formatDate } from '../../utils/helpers.js';

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Users</h1>
        <p className="mt-1 text-sm text-slate-500">Manage customer accounts, roles and access.</p>
      </div>

      {notice.message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            notice.type === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {notice.message}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="w-full max-w-sm">
          <div className="relative">
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or email..."
              aria-label="Search users"
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </form>

        <select
          value={role}
          onChange={(event) => setRole(event.target.value)}
          aria-label="Filter by role"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        >
          <option value="">All roles</option>
          <option value="customer">Customers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        {loading ? (
          <Loader label="Loading users..." />
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
          <p className="px-5 py-10 text-center text-sm text-slate-400">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm md:min-w-full">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Active</th>
                  <th className="hidden px-5 py-3 font-medium md:table-cell">Joined</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((item) => {
                  const isSelf = item._id === currentUser?._id;
                  return (
                    <tr key={item._id} className="hover:bg-slate-50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                            {item.role === 'admin' ? <ShieldCheck size={16} /> : <UserIcon size={16} />}
                          </span>
                          <div>
                            <p className="font-medium text-slate-800">
                              {item.name} {isSelf && <span className="text-xs text-brand-600">(you)</span>}
                            </p>
                            <p className="text-xs text-slate-400">{item.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <select
                          value={item.role}
                          disabled={isSelf || busyId === item._id}
                          onChange={(event) => applyUpdate(item, { role: event.target.value })}
                          className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="customer">customer</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          type="button"
                          disabled={isSelf || busyId === item._id}
                          onClick={() => applyUpdate(item, { isActive: !item.isActive })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            item.isActive ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}
                          aria-label="Toggle active"
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              item.isActive ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="hidden px-5 py-3 text-slate-600 md:table-cell">{formatDate(item.createdAt)}</td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            disabled={isSelf || busyId === item._id}
                            onClick={() => handleDelete(item)}
                            aria-label="Delete user"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
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
