import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import {
  Search, Filter, Users, UserCheck, UserX,
  Loader2, RefreshCw, ChevronLeft, ChevronRight
} from 'lucide-react';

const ROLES = ['all', 'student', 'expert', 'manager', 'hr_admin', 'super_admin'];
const STATUSES = ['all', 'active', 'pending_email', 'pending_approval', 'rejected', 'deactivated'];

const STATUS_STYLE = {
  active:            { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Active' },
  pending_email:     { text: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    label: 'Verifying Email' },
  pending_approval:  { text: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   label: 'Pending Approval' },
  rejected:          { text: 'text-red-400',      bg: 'bg-red-500/10',     border: 'border-red-500/20',     label: 'Rejected' },
  deactivated:       { text: 'text-slate-400',    bg: 'bg-slate-500/10',   border: 'border-slate-500/20',   label: 'Deactivated' },
};

const ROLE_STYLE = {
  student:    'text-emerald-400',
  expert:     'text-blue-400',
  manager:    'text-amber-400',
  hr_admin:   'text-purple-400',
  super_admin:'text-red-400',
};

const UsersPage = () => {
  const { t, isDarkMode } = useAppContext();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [togglingId, setTogglingId] = useState(null);

  const limit = 10;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit });
      if (search) params.set('search', search);
      if (roleFilter !== 'all') params.set('role', roleFilter);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      const res = await api.get(`/admin/users?${params}`);
      setUsers(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, statusFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Debounce search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleToggle = async (userId, currentStatus) => {
    setTogglingId(userId);
    try {
      const res = await api.patch(`/admin/users/${userId}/toggle-status`);
      toast.success(res.data.message);
      setUsers(prev => prev.map(u => u.id === userId
        ? { ...u, account_status: res.data.newStatus }
        : u
      ));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setTogglingId(null);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>User Directory</h2>
          <p className={t.textMuted}>
            {total} total users across all roles
          </p>
        </div>
        <button onClick={fetchUsers} disabled={loading} className={`p-2.5 rounded-xl border transition-colors ${isDarkMode ? 'border-white/10 hover:bg-white/5 text-slate-400' : 'border-gray-200 hover:bg-gray-50 text-gray-500'}`}>
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filters */}
      <div className={`p-4 rounded-2xl flex flex-wrap gap-3 items-center ${t.card}`}>
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${t.textMuted}`} />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search name or email…"
            className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border outline-none ${t.input}`}
          />
        </div>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className={`px-3 py-2 text-sm rounded-xl border outline-none ${isDarkMode ? 'bg-slate-800 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-700'}`}
        >
          {ROLES.map(r => <option key={r} value={r}>{r === 'all' ? 'All Roles' : r.replace('_', ' ')}</option>)}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className={`px-3 py-2 text-sm rounded-xl border outline-none ${isDarkMode ? 'bg-slate-800 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-700'}`}
        >
          {STATUSES.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : STATUS_STYLE[s]?.label || s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className={`rounded-2xl overflow-hidden ${t.card}`}>
        {loading ? (
          <div className="flex items-center justify-center p-16">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          </div>
        ) : users.length === 0 ? (
          <div className="p-16 text-center">
            <Users className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-slate-700' : 'text-gray-200'}`} />
            <p className={t.textMuted}>No users found matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-left text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'bg-white/5 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Employee ID</th>
                  <th className="px-5 py-3">Joined</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => {
                  const ss = STATUS_STYLE[u.account_status] || STATUS_STYLE['deactivated'];
                  return (
                    <tr key={u.id} className={`transition-colors ${isDarkMode ? 'hover:bg-white/3' : 'hover:bg-gray-50'}`}>
                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg,#1E3A5F,#2E5490)' }}>
                            {u.full_name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className={`font-semibold ${t.textMain}`}>{u.full_name}</p>
                            <p className={`text-xs ${t.textMuted}`}>{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold capitalize ${ROLE_STYLE[u.role] || 'text-slate-400'}`}>
                          {u.role?.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${ss.text} ${ss.bg} ${ss.border}`}>
                          {ss.label}
                        </span>
                      </td>

                      {/* Employee ID */}
                      <td className={`px-5 py-4 text-xs font-mono ${t.textMuted}`}>
                        {u.employee_id || '—'}
                      </td>

                      {/* Joined */}
                      <td className={`px-5 py-4 text-xs ${t.textMuted}`}>
                        {new Date(u.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        {u.role !== 'super_admin' && (
                          <button
                            onClick={() => handleToggle(u.id, u.account_status)}
                            disabled={togglingId === u.id}
                            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                              u.account_status === 'active'
                                ? isDarkMode ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' : 'border-red-200 text-red-600 hover:bg-red-50'
                                : isDarkMode ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                            }`}
                          >
                            {togglingId === u.id ? <Loader2 className="w-3 h-3 animate-spin" />
                              : u.account_status === 'active' ? <UserX className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                            {u.account_status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={`flex items-center justify-between px-5 py-3 border-t ${t.border}`}>
            <p className={`text-xs ${t.textMuted}`}>Showing {((page-1)*limit)+1}–{Math.min(page*limit, total)} of {total}</p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                className={`p-1.5 rounded-lg border disabled:opacity-40 transition-colors ${isDarkMode ? 'border-white/10 hover:bg-white/5 text-slate-400' : 'border-gray-200 hover:bg-gray-50 text-gray-500'}`}>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}
                className={`p-1.5 rounded-lg border disabled:opacity-40 transition-colors ${isDarkMode ? 'border-white/10 hover:bg-white/5 text-slate-400' : 'border-gray-200 hover:bg-gray-50 text-gray-500'}`}>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
