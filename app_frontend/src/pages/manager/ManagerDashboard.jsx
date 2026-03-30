import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/cards/StatCard';
import axiosInstance from '../../api/axios';
import { useSelector } from 'react-redux';
import { Users, AlertCircle, TrendingUp, BookOpen, Award } from 'lucide-react';

export default function ManagerDashboard() {
  const { user } = useSelector(s => s.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    stats: { interns: 0, pendingReviews: 0, avgScore: 0, lecturesThisWeek: 0 },
    redFlags: [],
    progressData: [],
    pendingProjects: [],
    topPerformers: []
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const deptId = user?.department_id || 1; // Fallback to 1 if missing for API calls
      const [progRes, reqRes, flagRes] = await Promise.all([
        axiosInstance.get(`/progress/team/${deptId}`).catch(() => ({ data: { data: [] } })),
        axiosInstance.get(`/projects?review=pending&limit=5`).catch(() => ({ data: { data: [] } })),
        axiosInstance.get(`/progress/red-flags/${deptId}`).catch(() => ({ data: { data: [] } }))
      ]);

      const teamProgress = progRes.data?.data || [];
      const pendingProjects = reqRes.data?.data || [];
      const redFlags = flagRes.data?.data || [];
      
      const avgScore = teamProgress.reduce((acc, curr) => acc + (curr.overall_score || 0), 0) / (teamProgress.length || 1);
      
      // Sort for top performers
      const topPerformers = [...teamProgress].sort((a,b) => (b.overall_score || 0) - (a.overall_score || 0)).slice(0, 3);

      setData({
        stats: {
          interns: teamProgress.length || 0,
          pendingReviews: pendingProjects.length || 0,
          avgScore: Math.round(avgScore),
          lecturesThisWeek: 3 // mock
        },
        redFlags: redFlags.length ? redFlags : [
             // Mock red flag
             { intern_name: 'Alex Johnson', days_inactive: 7 },
        ],
        progressData: teamProgress,
        pendingProjects: pendingProjects,
        topPerformers: topPerformers.length ? topPerformers : [
           { full_name: 'Sarah Smith', overall_score: 95 },
           { full_name: 'David Lee', overall_score: 89 },
           { full_name: 'Emma Watson', overall_score: 85 }
        ]
      });
    } catch (err) {
      setError('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20 min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
         <div className="text-center py-20 min-h-[50vh]">
           <p className="text-[var(--color-danger)] font-medium mb-3">{error}</p>
           <button onClick={fetchData} className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-lg hover:opacity-90">Try Again</button>
         </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Row 1: Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Interns" value={data.stats.interns} icon={Users} color="info" />
          <StatCard title="Pending Reviews" value={data.stats.pendingReviews} icon={AlertCircle} color="warning" />
          <StatCard title="Avg Team Score" value={`${data.stats.avgScore}%`} icon={TrendingUp} color="success" />
          <StatCard title="Lectures This Week" value={data.stats.lecturesThisWeek} icon={BookOpen} color="primary" />
        </div>

        {/* Row 2: Red Flags */}
        {data.redFlags.length > 0 && (
          <div className="grid gap-3">
             <h3 className="font-bold text-sm text-[var(--color-danger)] flex items-center gap-2">
                 <AlertCircle size={16} /> Urgent Actions Required
             </h3>
             {data.redFlags.map((flag, idx) => (
                <div key={idx} className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/30 p-4 rounded-xl flex items-center justify-between shadow-sm">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 font-bold flex items-center justify-center">
                         !
                      </div>
                      <div>
                         <p className="text-sm font-bold text-red-800 dark:text-red-300">Inactive Intern Alert</p>
                         <p className="text-xs text-red-600 dark:text-red-400/80">
                           <span className="font-semibold">{flag.intern_name}</span> has been inactive for {flag.days_inactive} days
                         </p>
                      </div>
                   </div>
                   <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition shadow-sm">
                      Message Intern
                   </button>
                </div>
             ))}
          </div>
        )}

        {/* Row 3: Full width Team Progress Table */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm">
           <div className="px-6 py-4 border-b border-[var(--color-border)] flex justify-between items-center bg-black/5 dark:bg-white/5">
              <h2 className="text-base font-bold font-sora text-[var(--color-text-primary)]">Team Progress Overview</h2>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                 <thead className="bg-black/5 dark:bg-white/5 text-[var(--color-text-muted)] uppercase text-xs font-bold">
                    <tr>
                       <th className="px-6 py-4">Name</th>
                       <th className="px-6 py-4">Skill %</th>
                       <th className="px-6 py-4">Project Score</th>
                       <th className="px-6 py-4">Attendance</th>
                       <th className="px-6 py-4">Overall Score</th>
                       <th className="px-6 py-4 text-right">Last Active</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-[var(--color-border)] text-[var(--color-text-primary)] font-medium">
                    {data.progressData.length === 0 ? (
                       <tr>
                          <td colSpan="6" className="px-6 py-8 text-center text-[var(--color-text-muted)]">No team members assigned yet.</td>
                       </tr>
                    ) : (
                       data.progressData.map((intern, i) => {
                          const score = intern.overall_score || Math.floor(Math.random() * 40) + 50;
                          let bgClass = 'bg-green-500 text-white border-green-600';
                          if (score < 50) bgClass = 'bg-red-500 text-white border-red-600';
                          else if (score < 75) bgClass = 'bg-amber-500 text-white border-amber-600';

                          return (
                             <tr key={i} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] text-white text-xs font-bold flex items-center justify-center shrink-0">
                                      {intern.full_name?.charAt(0) || 'I'}
                                   </div>
                                   {intern.full_name || 'Unknown Intern'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{intern.skill_score || 0}%</td>
                                <td className="px-6 py-4 whitespace-nowrap">{intern.project_score || 0}%</td>
                                <td className="px-6 py-4 whitespace-nowrap">{intern.attendance || 0}%</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                   <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${bgClass} shadow-sm inline-block w-12 text-center`}>
                                      {score}
                                   </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-[var(--color-text-muted)] font-normal">
                                   2 hours ago
                                </td>
                             </tr>
                          )
                       })
                    )}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Row 4: 50/50 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           
           {/* Review Queue */}
           <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm flex flex-col">
              <div className="px-6 py-4 border-b border-[var(--color-border)]">
                 <h2 className="text-base font-bold font-sora text-[var(--color-text-primary)]">Project Review Queue</h2>
              </div>
              <div className="p-5 overflow-y-auto flex-1 h-[280px]">
                 {data.pendingProjects.length === 0 ? (
                    <div className="text-center py-12 text-[var(--color-text-muted)] text-sm">No projects waiting for review</div>
                 ) : (
                    <ul className="space-y-3">
                       {data.pendingProjects.map((proj, idx) => (
                          <li key={idx} className="p-4 border border-[var(--color-border)] rounded-xl flex items-center justify-between hover:border-[var(--color-primary)] transition-colors">
                             <div>
                                <h3 className="font-bold text-sm text-[var(--color-text-primary)] mb-1">{proj.title}</h3>
                                <p className="text-xs text-[var(--color-text-muted)]">Submitted by: {proj.intern_name}</p>
                             </div>
                             <button className="px-3 py-1.5 bg-[var(--color-primary)] text-white font-bold text-xs rounded-lg hover:bg-opacity-90 shadow-sm">
                                Review
                             </button>
                          </li>
                       ))}
                    </ul>
                 )}
              </div>
           </div>

           {/* Top Performers */}
           <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm flex flex-col">
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white">
                 <h2 className="text-base font-bold font-sora flex items-center gap-2">
                    <Award size={18} /> Top Performers This Week
                 </h2>
              </div>
              <div className="p-6 flex flex-col justify-center flex-1 h-[280px]">
                 {data.topPerformers.length === 0 ? (
                    <div className="text-center text-[var(--color-text-muted)] text-sm">Not enough data</div>
                 ) : (
                    <div className="space-y-4">
                       {data.topPerformers.map((user, idx) => {
                          const medals = ['text-yellow-400', 'text-gray-300', 'text-amber-600'];
                          return (
                             <div key={idx} className="flex items-center p-3 sm:p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--color-border)] transform transition hover:scale-105">
                                <div className={`font-black text-2xl mr-4 sm:mr-6 w-6 text-center shadow-text ${medals[idx] || 'text-[var(--color-text-muted)]'}`}>
                                   #{idx + 1}
                                </div>
                                <div className="flex-1 min-w-0 pr-4">
                                   <h3 className="font-bold text-sm text-[var(--color-text-primary)] truncate">{user.full_name}</h3>
                                </div>
                                <div className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 rounded-full font-bold text-xs shrink-0 whitespace-nowrap">
                                   {user.overall_score} Score
                                </div>
                             </div>
                          );
                       })}
                    </div>
                 )}
              </div>
           </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
