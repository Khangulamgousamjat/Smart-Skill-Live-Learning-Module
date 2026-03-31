import { useState, useEffect } from 'react';
import DashboardLayout
  from '../../components/layout/DashboardLayout';
import StatCard
  from '../../components/cards/StatCard';
import axiosInstance from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Users, Building2, Award,
  CheckSquare, Clock, Check, X,
  RefreshCw, AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    totalDepartments: 0,
    totalCertificates: 0,
  });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    setError(false);
    try {
      // Fetch all data in parallel
      const [usersRes, deptsRes, roleReqRes] =
        await Promise.allSettled([
          axiosInstance.get(
            '/users?page=1&limit=5&sort=newest'
          ),
          axiosInstance.get('/departments'),
          axiosInstance.get('/role-requests?status=pending'),
        ]);

      // Process users
      if (usersRes.status === 'fulfilled') {
        const data = usersRes.value.data;
        setRecentUsers(data.data || []);
        setStats(prev => ({
          ...prev,
          totalUsers: data.pagination?.total
            || data.data?.length || 0
        }));
      }

      // Process departments
      if (deptsRes.status === 'fulfilled') {
        setStats(prev => ({
          ...prev,
          totalDepartments:
            deptsRes.value.data.data?.length || 0
        }));
      }

      // Process role requests
      if (roleReqRes.status === 'fulfilled') {
        const requests = roleReqRes.value.data.data || [];
        setPendingRequests(requests);
        setStats(prev => ({
          ...prev,
          pendingApprovals: requests.length
        }));
      }

    } catch (err) {
      console.error('Dashboard load error:', err);
      setError(true);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId, userName) => {
    setActionLoading(requestId);
    try {
      await axiosInstance.patch(
        `/role-requests/${requestId}/approve`
      );
      toast.success(`${userName} approved successfully`);
      loadDashboard();
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Approval failed'
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId, userName) => {
    const reason = window.prompt(
      `Rejection reason for ${userName}:`
    );
    if (!reason) return;
    setActionLoading(requestId);
    try {
      await axiosInstance.patch(
        `/role-requests/${requestId}/reject`,
        { rejection_reason: reason }
      );
      toast.success(`${userName} rejected`);
      loadDashboard();
    } catch (err) {
      toast.error('Rejection failed');
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      super_admin : 'bg-purple-100 text-purple-700',
      hr_admin    : 'bg-blue-100   text-blue-700',
      manager     : 'bg-green-100  text-green-700',
      expert      : 'bg-amber-100  text-amber-700',
      student     : 'bg-gray-100   text-gray-700',
    };
    return (
      <span className={`
        px-2 py-0.5 rounded-full text-xs font-medium
        ${styles[role] || styles.student}
      `}>
        {role?.replace('_', ' ')}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      active           : 'bg-green-100 text-green-700',
      pending_approval : 'bg-amber-100 text-amber-700',
      pending_email    : 'bg-blue-100  text-blue-700',
      rejected         : 'bg-red-100   text-red-700',
      deactivated      : 'bg-gray-100  text-gray-700',
    };
    return (
      <span className={`
        px-2 py-0.5 rounded-full text-xs font-medium
        ${styles[status] || styles.active}
      `}>
        {status?.replace('_', ' ')}
      </span>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center
                        py-32">
          <div className="text-center">
            <div className="w-10 h-10 border-4 rounded-full
                            animate-spin mx-auto mb-4
                            border-[var(--color-border)]
                            border-t-[var(--color-primary)]" />
            <p className="text-[var(--color-text-muted)]
                          text-sm">
              Loading dashboard...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center
                        py-32">
          <div className="text-center">
            <AlertCircle
              size={40}
              className="mx-auto mb-3
                         text-[var(--color-danger)]"
            />
            <p className="text-[var(--color-danger)]
                          font-medium mb-3">
              Failed to load dashboard data
            </p>
            <button
              onClick={loadDashboard}
              className="flex items-center gap-2 mx-auto
                         px-4 py-2 rounded-lg text-sm
                         bg-[var(--color-primary)]
                         text-white"
            >
              <RefreshCw size={14} />
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold font-sora
                         text-[var(--color-text-primary)]">
            Admin Dashboard
          </h1>
          <p className="text-[var(--color-text-muted)]
                        text-sm mt-1">
            Smart Skill & Live Learning Module — Gous org
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4
                        gap-4">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            color="primary"
          />
          <StatCard
            title="Pending Approvals"
            value={stats.pendingApprovals}
            icon={Clock}
            color={stats.pendingApprovals > 0
              ? 'danger' : 'success'}
          />
          <StatCard
            title="Departments"
            value={stats.totalDepartments}
            icon={Building2}
            color="info"
          />
          <StatCard
            title="Certificates Issued"
            value={stats.totalCertificates}
            icon={Award}
            color="success"
          />
        </div>

        {/* Pending Approvals Table */}
        <div className="bg-[var(--color-surface)]
                        border border-[var(--color-border)]
                        rounded-xl overflow-hidden">
          <div className="flex items-center justify-between
                          px-5 py-4 border-b
                          border-[var(--color-border)]">
            <div className="flex items-center gap-2">
              <CheckSquare
                size={18}
                className="text-[var(--color-primary)]"
              />
              <h2 className="font-sora font-semibold
                             text-[var(--color-text-primary)]">
                Pending Approval Requests
              </h2>
              {pendingRequests.length > 0 && (
                <span className="px-2 py-0.5 rounded-full
                                 text-xs font-bold
                                 bg-red-100 text-red-600">
                  {pendingRequests.length}
                </span>
              )}
            </div>
            <button
              onClick={() => navigate('/admin/approvals')}
              className="text-xs text-[var(--color-primary)]
                         hover:underline"
            >
              View all →
            </button>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="py-10 text-center">
              <Check
                size={32}
                className="mx-auto mb-2 text-green-500"
              />
              <p className="text-[var(--color-text-muted)]
                            text-sm">
                No pending requests
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--color-surface-2)]">
                    <th className="text-left px-5 py-3
                                   text-[var(--color-text-muted)]
                                   font-medium text-xs
                                   uppercase tracking-wide">
                      Name
                    </th>
                    <th className="text-left px-5 py-3
                                   text-[var(--color-text-muted)]
                                   font-medium text-xs
                                   uppercase tracking-wide">
                      Email
                    </th>
                    <th className="text-left px-5 py-3
                                   text-[var(--color-text-muted)]
                                   font-medium text-xs
                                   uppercase tracking-wide">
                      Role
                    </th>
                    <th className="text-left px-5 py-3
                                   text-[var(--color-text-muted)]
                                   font-medium text-xs
                                   uppercase tracking-wide">
                      Department
                    </th>
                    <th className="text-left px-5 py-3
                                   text-[var(--color-text-muted)]
                                   font-medium text-xs
                                   uppercase tracking-wide">
                      Date
                    </th>
                    <th className="text-left px-5 py-3
                                   text-[var(--color-text-muted)]
                                   font-medium text-xs
                                   uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y
                  divide-[var(--color-border)]">
                  {pendingRequests.map((req) => (
                    <tr key={req.id}
                        className="hover:bg-[var(--color-surface-2)]
                                   transition-colors">
                      <td className="px-5 py-3
                                     text-[var(--color-text-primary)]
                                     font-medium">
                        {req.full_name}
                      </td>
                      <td className="px-5 py-3
                                     text-[var(--color-text-secondary)]">
                        {req.email}
                      </td>
                      <td className="px-5 py-3">
                        {getRoleBadge(req.requested_role)}
                      </td>
                      <td className="px-5 py-3
                                     text-[var(--color-text-secondary)]">
                        {req.department_name || '—'}
                      </td>
                      <td className="px-5 py-3
                                     text-[var(--color-text-muted)]">
                        {new Date(req.requested_at)
                          .toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(
                              req.id, req.full_name
                            )}
                            disabled={
                              actionLoading === req.id
                            }
                            className="flex items-center
                                       gap-1 px-3 py-1.5
                                       rounded-lg text-xs
                                       font-medium
                                       bg-green-500
                                       hover:bg-green-600
                                       text-white
                                       disabled:opacity-50
                                       transition-all"
                          >
                            <Check size={12} />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(
                              req.id, req.full_name
                            )}
                            disabled={
                              actionLoading === req.id
                            }
                            className="flex items-center
                                       gap-1 px-3 py-1.5
                                       rounded-lg text-xs
                                       font-medium
                                       bg-red-500
                                       hover:bg-red-600
                                       text-white
                                       disabled:opacity-50
                                       transition-all"
                          >
                            <X size={12} />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Users + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2
                        gap-6">
          {/* Recent Users */}
          <div className="bg-[var(--color-surface)]
                          border border-[var(--color-border)]
                          rounded-xl overflow-hidden">
            <div className="flex items-center justify-between
                            px-5 py-4 border-b
                            border-[var(--color-border)]">
              <h2 className="font-sora font-semibold
                             text-[var(--color-text-primary)]">
                Recent Users
              </h2>
              <button
                onClick={() => navigate('/admin/users')}
                className="text-xs
                           text-[var(--color-primary)]
                           hover:underline"
              >
                View all →
              </button>
            </div>
            <div className="divide-y
                            divide-[var(--color-border)]">
              {recentUsers.length === 0 ? (
                <p className="text-center py-6 text-sm
                              text-[var(--color-text-muted)]">
                  No users yet
                </p>
              ) : (
                recentUsers.map((user) => (
                  <div key={user.id}
                       className="flex items-center
                                  justify-between
                                  px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full
                                      bg-[var(--color-primary)]
                                      flex items-center
                                      justify-center">
                        <span className="text-white text-xs
                                         font-bold">
                          {user.full_name
                            ?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium
                          text-[var(--color-text-primary)]">
                          {user.full_name}
                        </p>
                        <p className="text-xs
                          text-[var(--color-text-muted)]">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.account_status)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[var(--color-surface)]
                          border border-[var(--color-border)]
                          rounded-xl p-5">
            <h2 className="font-sora font-semibold
                           text-[var(--color-text-primary)]
                           mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: 'Manage Departments',
                  path: '/admin/departments',
                  color: 'bg-blue-500'
                },
                {
                  label: 'Manage Skills',
                  path: '/admin/skills',
                  color: 'bg-green-500'
                },
                {
                  label: 'Post Announcement',
                  path: '/admin/announcements',
                  color: 'bg-amber-500'
                },
                {
                  label: 'View All Users',
                  path: '/admin/users',
                  color: 'bg-purple-500'
                },
                {
                  label: 'Approval Requests',
                  path: '/admin/approvals',
                  color: 'bg-red-500'
                },
                {
                  label: 'System Logs',
                  path: '/admin/logs',
                  color: 'bg-gray-500'
                },
              ].map((action) => (
                <button
                  key={action.path}
                  onClick={() => navigate(action.path)}
                  className={`
                    ${action.color} text-white
                    rounded-xl p-3 text-sm font-medium
                    hover:opacity-90 transition-all
                    text-left
                  `}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
