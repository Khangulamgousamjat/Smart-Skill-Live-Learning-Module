import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  Users, Search, Filter, Mail, Phone, 
  MapPin, Calendar, CheckCircle2, Circle,
  MoreVertical, Download, ExternalLink, Loader2
} from 'lucide-react';

const InternsPage = () => {
  const { t, isDarkMode } = useAppContext();
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const res = await api.get('/hr/interns');
        if (res.data.success) {
          setInterns(res.data.data);
        }
      } catch (err) {
        toast.error('Failed to load interns');
      } finally {
        setLoading(false);
      }
    };
    fetchInterns();
  }, []);

  const filtered = interns.filter(i => {
    const matchesSearch = i.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          i.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || i.account_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>Intern Directory</h2>
          <p className={t.textMuted}>Monitor and manage all active interns across the platform.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 text-amber-500 font-bold border border-amber-500/20 hover:bg-amber-500/20 transition-all">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className={`flex-1 flex items-center gap-3 px-4 py-2.5 rounded-2xl border ${t.card}`}>
          <Search className={`w-4 h-4 ${t.textMuted}`} />
          <input 
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`flex-1 bg-transparent outline-none text-sm ${t.textMain}`}
          />
        </div>
        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border ${t.card}`}>
          <Filter className={`w-4 h-4 ${t.textMuted}`} />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`bg-transparent outline-none text-sm font-semibold pr-4 ${t.textMain}`}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending_approval">Pending</option>
            <option value="deactivated">Deactivated</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(intern => (
            <div key={intern.id} className={`p-6 rounded-3xl border group transition-all hover:scale-[1.02] ${t.card}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-800">
                    <img 
                      src={intern.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${intern.email}`} 
                      alt={intern.full_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                    intern.account_status === 'active' ? 'bg-green-500' : 'bg-amber-500'
                  }`} />
                </div>
                <button className={`p-2 rounded-xl transition-colors ${t.hoverCard}`}>
                  <MoreVertical className={`w-4 h-4 ${t.textMuted}`} />
                </button>
              </div>

              <div>
                <h3 className={`font-bold text-lg mb-1 flex items-center gap-2 ${t.textMain}`}>
                  {intern.full_name}
                  {intern.checklist_completed && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </h3>
                <p className={`text-xs mb-4 ${t.textMuted}`}>{intern.department_name || 'Unassigned'}</p>
                
                <div className="space-y-2.5 mb-6">
                  <div className="flex items-center gap-2.5 text-xs">
                    <Mail className={`w-3.5 h-3.5 ${t.textMuted}`} />
                    <span className={t.textMain}>{intern.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <Calendar className={`w-3.5 h-3.5 ${t.textMuted}`} />
                    <span className={t.textMuted}>Joined: {new Date(intern.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[8px] text-white">
                        P{i}
                      </div>
                    ))}
                    <div className="w-6 h-6 rounded-full bg-amber-500 border-2 border-slate-900 flex items-center justify-center text-[10px] text-white font-bold">
                      +{intern.completed_projects || 0}
                    </div>
                  </div>
                  <button className="text-xs font-bold text-amber-500 flex items-center gap-1 hover:underline">
                    View Profile
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InternsPage;
