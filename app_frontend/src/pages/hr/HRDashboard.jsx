import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/cards/StatCard';
import axiosInstance from '../../api/axios';
import { Users, Building2, Activity, Award, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function HRDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    stats: { interns: 0, depts: 0, activeWeek: 0, certsMonth: 0 },
    deptComparison: [],
    missingSkills: [],
    newInterns: [],
    recentCerts: []
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [progRes, internsRes, deptRes] = await Promise.all([
        axiosInstance.get('/progress/organization').catch(() => ({ data: { data: [] } })),
        axiosInstance.get('/users?role=student&limit=5&sort=newest').catch(() => ({ data: { data: { users: [] } } })),
        axiosInstance.get('/admin/departments').catch(() => ({ data: { data: [] } }))
      ]);

      const depts = deptRes.data?.data || [
        { name: 'CS Dept' }, { name: 'ME Dept' }, { name: 'EE Dept' }
      ];
      
      const newInterns = internsRes.data?.data?.users || [
         { full_name: 'Mike Ross', email: 'mike@example.com', created_at: new Date().toISOString() },
         { full_name: 'Harvey Specter', email: 'harvey@example.com', created_at: new Date().toISOString() }
      ];

      // Mock graph data for HR view
      const mockGraph = [
        { name: 'Eng', avgScore: 85 }, { name: 'Sales', avgScore: 78 },
        { name: 'Marketing', avgScore: 92 }, { name: 'HR', avgScore: 65 }
      ];

      setData({
        stats: {
          interns: progRes.data?.data?.length || 154,
          depts: depts.length,
          activeWeek: 112,
          certsMonth: 23
        },
        deptComparison: mockGraph,
        missingSkills: [
          { skill: 'React Native', count: 45 },
          { skill: 'Docker Containerization', count: 32 },
          { skill: 'GraphQL', count: 28 },
          { skill: 'Advanced Git Workflow', count: 19 },
          { skill: 'System Design Basics', count: 12 },
        ],
        newInterns,
        recentCerts: [
          { name: 'Advanced React', student: 'Alice W.', date: '2023-10-01' },
          { name: 'Node.js Mastery', student: 'Bob M.', date: '2023-09-28' },
        ]
      });
    } catch (err) {
      setError('Failed to load HR data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return (
     <DashboardLayout><div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-t-[var(--color-primary)] rounded-full animate-spin border-[var(--color-border)]" /></div></DashboardLayout>
  );

  if (error) return (
     <DashboardLayout><div className="text-center py-20 text-red-500 font-bold">{error}</div></DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Row 1: Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Interns" value={data.stats.interns} icon={Users} color="primary" />
          <StatCard title="Departments" value={data.stats.depts} icon={Building2} color="info" />
          <StatCard title="Active This Week" value={data.stats.activeWeek} icon={Activity} color="success" />
          <StatCard title="Certs This Month" value={data.stats.certsMonth} icon={Award} color="warning" />
        </div>

        {/* Row 2: 55/45 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           
           {/* Dept Comparison */}
           <div className="lg:col-span-7 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm p-6 flex flex-col">
              <h2 className="text-base font-bold font-sora text-[var(--color-text-primary)] mb-6">Department Comparison</h2>
              <div className="h-[280px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.deptComparison} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888" strokeOpacity={0.2} />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} domain={[0, 100]} />
                       <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }}/>
                       <Bar dataKey="avgScore" radius={[4, 4, 0, 0]}>
                         {data.deptComparison.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'var(--color-primary)' : 'var(--color-accent)'} />
                         ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Missing Skills */}
           <div className="lg:col-span-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm flex flex-col">
              <div className="px-6 py-4 border-b border-[var(--color-border)]">
                 <h2 className="text-base font-bold font-sora text-[var(--color-text-primary)]">Top 5 Most Missing Skills</h2>
              </div>
              <div className="p-6 overflow-auto">
                 <div className="space-y-4">
                    {data.missingSkills.map((item, idx) => (
                       <div key={idx} className="flex justify-between items-center group">
                          <div className="flex items-center gap-3 w-4/5">
                             <div className="w-6 h-6 rounded-md bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs flex items-center justify-center shrink-0">
                                !
                             </div>
                             <span className="font-medium text-sm text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-primary)] transition">{item.skill}</span>
                          </div>
                          <div className="text-xs font-bold px-2 py-1 bg-black/5 dark:bg-white/5 rounded-md text-[var(--color-text-muted)] group-hover:bg-[var(--color-primary)]/10 group-hover:text-[var(--color-primary)] transition">
                             {item.count} Interns
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

        </div>

        {/* Row 3: 50/50 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           
           {/* New Registrations */}
           <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm flex flex-col">
              <div className="px-6 py-4 border-b border-[var(--color-border)]">
                 <h2 className="text-base font-bold font-sora text-[var(--color-text-primary)]">New Registrations this week</h2>
              </div>
              <div className="p-0">
                 {data.newInterns.length === 0 ? (
                    <div className="p-8 text-center text-sm text-[var(--color-text-muted)]">No new registrations</div>
                 ) : (
                    <ul className="divide-y divide-[var(--color-border)]">
                       {data.newInterns.map((user, idx) => (
                          <li key={idx} className="p-4 flex items-center gap-4 hover:bg-black/5 dark:hover:bg-white/5 transition">
                             <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] font-bold flex items-center justify-center">
                                {user.full_name?.charAt(0)}
                             </div>
                             <div>
                                <p className="text-sm font-bold text-[var(--color-text-primary)]">{user.full_name}</p>
                                <p className="text-xs text-[var(--color-text-muted)]">Joined {new Date(user.created_at).toLocaleDateString()}</p>
                             </div>
                          </li>
                       ))}
                    </ul>
                 )}
              </div>
           </div>

           {/* Certificates Issuance */}
           <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-10 pointer-events-none">
                 <Award size={140} />
              </div>
              <div className="px-6 py-4 border-b border-[var(--color-border)] flex justify-between items-center relative z-10">
                 <h2 className="text-base font-bold font-sora text-[var(--color-text-primary)]">Certificate Issuance</h2>
              </div>
              <div className="p-6 relative z-10 flex flex-col h-full">
                 <button className="w-full py-3 bg-[var(--color-accent)] text-white font-bold text-sm rounded-xl hover:opacity-90 transition mb-6 shadow-sm flex items-center justify-center gap-2">
                    <CheckCircle size={18} /> Issue New Certificate
                 </button>
                 
                 <h3 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Recently Issued</h3>
                 <div className="space-y-3 overflow-y-auto">
                    {data.recentCerts.map((cert, idx) => (
                       <div key={idx} className="flex justify-between items-center bg-black/5 dark:bg-white/5 p-3 rounded-lg border border-[var(--color-border)]">
                          <div>
                             <p className="text-sm font-bold text-[var(--color-text-primary)]">{cert.name}</p>
                             <p className="text-xs text-[var(--color-text-muted)]">to {cert.student}</p>
                          </div>
                          <p className="text-xs font-medium text-[var(--color-text-muted)]">{cert.date}</p>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
