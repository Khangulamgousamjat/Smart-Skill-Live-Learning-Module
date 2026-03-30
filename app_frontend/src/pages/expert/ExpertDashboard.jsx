import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/cards/StatCard';
import axiosInstance from '../../api/axios';
import { Video, Users, FolderOpen, FileText, CalendarPlus, Edit2, XCircle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ExpertDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    stats: { sessions: 0, totalStudents: 0, avgAttendance: 0, resources: 0 },
    upcoming: [],
    pastAttendance: [],
    recentQna: []
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [lecturesRes, upRes] = await Promise.all([
        axiosInstance.get('/lectures?my=true&limit=5').catch(() => ({ data: { data: [] } })),
        axiosInstance.get('/lectures?my=true&upcoming=true&limit=3').catch(() => ({ data: { data: [] } }))
      ]);

      const allMy = lecturesRes.data?.data || [];
      const upcoming = upRes.data?.data || [
         { id: 1, title: 'React Hooks Deep Dive', start_time: new Date(Date.now() + 86400000).toISOString() },
         { id: 2, title: 'Performance Optimization', start_time: new Date(Date.now() + 172800000).toISOString() },
      ];

      // Mock data for Expert views
      const mockGraph = [
        { session: 'Lec 1', attendance: 85 },
        { session: 'Lec 2', attendance: 92 },
        { session: 'Lec 3', attendance: 78 },
        { session: 'Lec 4', attendance: 88 },
        { session: 'Lec 5', attendance: 95 }
      ];

      setData({
        stats: {
          sessions: allMy.length || 24,
          totalStudents: 156,
          avgAttendance: 88,
          resources: 42
        },
        upcoming,
        pastAttendance: mockGraph,
        recentQna: [
          { id: 1, text: 'How do you handle memoization in deep component trees?', intern: 'John D.', date: '2 hours ago' },
          { id: 2, text: 'Explain the event loop practically?', intern: 'Alice W.', date: '5 hours ago' }
        ]
      });
    } catch (err) {
      setError('Failed to load expert data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <DashboardLayout><div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-t-[var(--color-primary)] rounded-full animate-spin border-[var(--color-border)]" /></div></DashboardLayout>;
  if (error) return <DashboardLayout><div className="text-center py-20 text-red-500 font-bold">{error}</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Row 1: Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="My Sessions" value={data.stats.sessions} icon={Video} color="primary" />
          <StatCard title="Total Interns Taught" value={data.stats.totalStudents} icon={Users} color="info" />
          <StatCard title="Avg Attendance %" value={`${data.stats.avgAttendance}%`} icon={CheckCircle} color="success" />
          <StatCard title="Resources Uploaded" value={data.stats.resources} icon={FileText} color="warning" />
        </div>

        {/* Row 2: 60/40 */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
           
           {/* Upcoming Lectures */}
           <div className="lg:col-span-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm flex flex-col">
              <div className="px-6 py-4 border-b border-[var(--color-border)]">
                 <h2 className="text-base font-bold font-sora text-[var(--color-text-primary)]">Upcoming Lectures</h2>
              </div>
              <div className="p-0 overflow-auto">
                 {data.upcoming.length === 0 ? (
                    <div className="p-8 text-center text-sm text-[var(--color-text-muted)]">No upcoming sessions</div>
                 ) : (
                    <ul className="divide-y divide-[var(--color-border)]">
                       {data.upcoming.map((sess, idx) => (
                          <li key={idx} className="p-4 sm:p-5 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition">
                             <div>
                                <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-1">{sess.title}</h3>
                                <div className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                                   <Video size={12} /> {new Date(sess.start_time).toLocaleString()}
                                </div>
                             </div>
                             <div className="flex gap-2">
                                <button className="p-2 text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition">
                                   <Edit2 size={16} />
                                </button>
                                <button className="p-2 text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition">
                                   <XCircle size={16} />
                                </button>
                             </div>
                          </li>
                       ))}
                    </ul>
                 )}
              </div>
           </div>

           {/* Schedule New */}
           <div className="lg:col-span-2 flex flex-col">
              <button className="flex-1 min-h-[160px] bg-dashed border-2 border-dashed border-[var(--color-primary)]/50 rounded-xl flex flex-col items-center justify-center text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all group shadow-sm bg-[var(--color-primary)]/5">
                 <CalendarPlus size={36} className="mb-3 text-[var(--color-primary)] group-hover:text-white transition-colors" />
                 <span className="font-bold text-base">Schedule New Lecture</span>
                 <span className="text-xs mt-1 font-medium opactiy-80">Click to open scheduling form</span>
              </button>
           </div>
        </div>

        {/* Row 3: Bar Chart */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm p-6 flex flex-col">
           <h2 className="text-base font-bold font-sora text-[var(--color-text-primary)] mb-6">Attendance Rate (Last 5 Sessions)</h2>
           <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data.pastAttendance} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888" strokeOpacity={0.2} />
                    <XAxis dataKey="session" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} domain={[0, 100]} />
                    <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }}/>
                    <Bar dataKey="attendance" fill="var(--color-accent)" radius={[4, 4, 0, 0]} barSize={40} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Row 4: Recent Q&A */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm overflow-hidden flex flex-col">
           <div className="px-6 py-4 border-b border-[var(--color-border)] flex justify-between items-center text-white bg-[var(--color-primary)]">
              <h2 className="text-base font-bold font-sora">Recent Unanswered Questions</h2>
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">{data.recentQna.length} Pending</span>
           </div>
           <div className="p-0">
              {data.recentQna.length === 0 ? (
                 <div className="text-center py-8 text-sm text-[var(--color-text-muted)]">No unanswered questions.</div>
              ) : (
                 <ul className="divide-y divide-[var(--color-border)]">
                    {data.recentQna.map((q, idx) => (
                       <li key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/5 dark:bg-white/5 hover:bg-[var(--color-surface)] transition cursor-default">
                          <div className="flex-1">
                             <div className="flex items-center gap-2 mb-1 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                                <span>{q.intern}</span> • <span>{q.date}</span>
                             </div>
                             <p className="text-sm font-semibold text-[var(--color-text-primary)]">"{q.text}"</p>
                          </div>
                          <button className="px-4 py-2 bg-[var(--color-accent)] text-[var(--color-primary)] font-bold text-xs rounded-lg hover:bg-white hover:text-[var(--color-accent)] transition-colors border border-[var(--color-accent)] whitespace-nowrap self-start sm:self-auto">
                             Write Answer
                          </button>
                       </li>
                    ))}
                 </ul>
              )}
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
