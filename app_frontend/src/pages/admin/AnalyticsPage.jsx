import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import api from '../../api/axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart3, Users, Clock, ShieldAlert, Loader2 } from 'lucide-react';

const COLORS = {
  student:    '#22C55E',
  expert:     '#3B82F6',
  manager:    '#F4A100',
  hr_admin:   '#8B5CF6',
  super_admin:'#EF4444',
};

const ROLE_STATUS_COLORS = ['#22C55E', '#F4A100', '#3B82F6', '#EF4444', '#64748B'];

const AnalyticsPage = () => {
  const { t, isDarkMode } = useAppContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics')
      .then(res => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#F4A100' }} />
      </div>
    );
  }

  const roleData = (data?.roleDistribution || []).map(r => ({
    name: r.role.replace('_', ' '),
    value: parseInt(r.count),
    color: COLORS[r.role] || '#64748B',
  }));

  const totalUsers = roleData.reduce((s, r) => s + r.value, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>Platform Analytics</h2>
        <p className={t.textMuted}>Live user distribution and activity overview.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users',       value: totalUsers,                          color: '#F4A100', icon: Users        },
          { label: 'Pending Approvals', value: data?.pendingApprovals || 0,         color: '#EF4444', icon: ShieldAlert  },
          { label: 'Active Students',   value: roleData.find(r=>r.name==='student')?.value || 0, color:'#22C55E', icon: Users },
          { label: 'Experts / Staff',   value: (roleData.find(r=>r.name==='expert')?.value||0) + (roleData.find(r=>r.name==='manager')?.value||0), color:'#3B82F6', icon: BarChart3 },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className={`p-5 rounded-2xl ${t.card}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
            </div>
            <div className="text-3xl font-black" style={{ color }}>{value}</div>
            <div className={`text-xs mt-1 ${t.textMuted}`}>{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Distribution Pie */}
        <div className={`p-6 rounded-2xl ${t.card}`}>
          <h3 className={`font-semibold mb-4 flex items-center gap-2 ${t.textMain}`}>
            <BarChart3 className="w-5 h-5" style={{ color: '#F4A100' }} />
            User Distribution by Role
          </h3>
          {roleData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: isDarkMode ? '#1e293b' : '#fff',
                    border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
                    borderRadius: '12px',
                    color: isDarkMode ? '#f1f5f9' : '#0f172a',
                  }}
                  formatter={(v, name) => [`${v} users`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className={`text-center py-12 ${t.textMuted}`}>No user data yet</p>
          )}
          {/* Legend */}
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {roleData.map(r => (
              <div key={r.name} className="flex items-center gap-1.5 text-xs" style={{ color: r.color }}>
                <div className="w-3 h-3 rounded-full" style={{ background: r.color }} />
                <span className="capitalize font-semibold">{r.name}</span>
                <span className={t.textMuted}>({r.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className={`p-6 rounded-2xl ${t.card}`}>
          <h3 className={`font-semibold mb-4 flex items-center gap-2 ${t.textMain}`}>
            <Clock className="w-5 h-5" style={{ color: '#F4A100' }} />
            Most Recent Signups
          </h3>
          <div className="space-y-3">
            {(data?.recentUsers || []).length === 0 && (
              <p className={`text-sm ${t.textMuted} text-center py-8`}>No users yet</p>
            )}
            {(data?.recentUsers || []).map((u, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#1E3A5F,#2E5490)' }}>
                  {u.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${t.textMain}`}>{u.full_name}</p>
                  <p className={`text-xs truncate ${t.textMuted}`}>{u.email}</p>
                </div>
                <span className={`text-[10px] font-bold capitalize flex-shrink-0`}
                  style={{ color: COLORS[u.role] || '#64748B' }}>
                  {u.role?.replace('_',' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
