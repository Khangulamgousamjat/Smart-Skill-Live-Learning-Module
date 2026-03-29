import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  Calendar, Search, Filter, Download, 
  User, BookOpen, Clock, Loader2,
  CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';

const AttendancePage = () => {
  const { t, isDarkMode } = useAppContext();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/hr/attendance');
        if (res.data.success) {
          setLogs(res.data.data);
        }
      } catch (err) {
        toast.error('Failed to load attendance logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filtered = logs.filter(log => 
    log.intern_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.lecture_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>Attendance Tracking</h2>
          <p className={t.textMuted}>Monitor intern participation in live lectures and workshops.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 text-amber-500 font-bold border border-amber-500/20 hover:bg-amber-500/20 transition-all">
          <Download className="w-4 h-4" />
          Export Logs
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className={`flex-1 flex items-center gap-3 px-4 py-2.5 rounded-2xl border ${t.card}`}>
          <Search className={`w-4 h-4 ${t.textMuted}`} />
          <input 
            type="text"
            placeholder="Search by intern or lecture..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`flex-1 bg-transparent outline-none text-sm ${t.textMain}`}
          />
        </div>
        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border ${t.card}`}>
          <Calendar className={`w-4 h-4 ${t.textMuted}`} />
          <input 
            type="date"
            className={`bg-transparent outline-none text-sm font-semibold ${t.textMain}`}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
      ) : (
        <div className={`rounded-3xl border overflow-hidden ${t.card}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <th className={`px-6 py-4 text-[10px] font-bold uppercase tracking-wider ${t.textMuted}`}>Intern</th>
                  <th className={`px-6 py-4 text-[10px] font-bold uppercase tracking-wider ${t.textMuted}`}>Lecture</th>
                  <th className={`px-6 py-4 text-[10px] font-bold uppercase tracking-wider ${t.textMuted}`}>Joined At</th>
                  <th className={`px-6 py-4 text-[10px] font-bold uppercase tracking-wider ${t.textMuted}`}>Duration</th>
                  <th className={`px-6 py-4 text-[10px] font-bold uppercase tracking-wider ${t.textMuted}`}>Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${t.border}`}>
                {filtered.map(log => (
                  <tr key={log.id} className={`group hover:${isDarkMode ? 'bg-white/5' : 'bg-gray-50'} transition-colors`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-400" />
                        </div>
                        <span className={`font-semibold text-sm ${t.textMain}`}>{log.intern_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                        <span className={`text-sm ${t.textMain}`}>{log.lecture_title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs ${t.textMuted}`}>
                        {new Date(log.joined_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span className={`text-xs ${t.textMain}`}>{log.duration_watched_minutes} mins</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {log.duration_watched_minutes > 45 ? (
                        <div className="flex items-center gap-1.5 text-green-500 text-[10px] font-bold uppercase">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Present
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-amber-500 text-[10px] font-bold uppercase">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Partial
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <p className={t.textMuted}>No records found for the given criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
