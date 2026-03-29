import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  Users, Search, Filter, Mail, Phone, 
  Briefcase, CheckCircle2, Circle, Clock,
  MoreVertical, Download, ExternalLink, Loader2,
  CalendarDays, Award, Star
} from 'lucide-react';

const TeamPage = () => {
  const { t, isDarkMode } = useAppContext();
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await api.get('/manager/team');
        if (res.data.success) {
          setTeam(res.data.data);
        }
      } catch (err) {
        toast.error('Failed to load team data');
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const filtered = team.filter(i => 
    i.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>Team Overview</h2>
          <p className={t.textMuted}>Manage and monitor the progress of interns in your department.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className={`px-4 py-2 rounded-xl bg-amber-500/10 text-amber-500 font-bold border border-amber-500/20 flex items-center gap-2`}>
             <Star className="w-4 h-4 fill-amber-500" />
             {team.length} Active Interns
           </div>
        </div>
      </div>

      <div className={`p-4 rounded-2xl flex items-center gap-3 ${t.card}`}>
        <Search className={`w-4 h-4 ${t.textMuted}`} />
        <input 
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by intern name..."
          className={`flex-1 bg-transparent outline-none text-sm ${t.textMain}`}
        />
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
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-800">
                  <img 
                    src={intern.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${intern.email}`} 
                    alt={intern.full_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className={`p-2 rounded-xl transition-colors ${t.hoverCard}`}>
                   <MoreVertical className={`w-4 h-4 ${t.textMuted}`} />
                </button>
              </div>

              <div>
                <h3 className={`font-bold text-lg mb-1 flex items-center gap-2 ${t.textMain}`}>
                  {intern.full_name}
                </h3>
                
                <div className="flex flex-wrap gap-2 mb-6">
                   <div className={`px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase`}>
                     {intern.active_tasks > 0 ? `${intern.active_tasks} Active Tasks` : 'Idle'}
                   </div>
                   <div className={`px-2 py-0.5 rounded-lg bg-red-500/10 text-red-500 text-[10px] font-bold uppercase`}>
                     {intern.pending_reviews > 0 ? `${intern.pending_reviews} Pending Review` : 'All Reviewed'}
                   </div>
                </div>

                <div className="space-y-4 mb-6">
                   <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider">
                         <span className={t.textMuted}>Onboarding Progress</span>
                         <span className={t.textMain}>{intern.onboarding_completed ? '100%' : 'In Progress'}</span>
                      </div>
                      <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                         <div 
                           className={`h-full bg-amber-500 transition-all duration-1000`} 
                           style={{ width: intern.onboarding_completed ? '100%' : '60%' }}
                         />
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center gap-1">
                         <Award className={`w-4 h-4 text-emerald-500`} />
                         <span className={`text-[10px] font-bold ${t.textMain}`}>4.5 Avg</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                         <CheckCircle2 className={`w-4 h-4 text-amber-500`} />
                         <span className={`text-[10px] font-bold ${t.textMain}`}>12 Done</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                         <CalendarDays className={`w-4 h-4 text-blue-500`} />
                         <span className={`text-[10px] font-bold ${t.textMain}`}>98% Att</span>
                      </div>
                   </div>
                </div>

                <div className="flex gap-2">
                   <button className="flex-1 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-400 transition-colors shadow-lg active:scale-95">
                     View & Evaluate
                   </button>
                   <button className={`p-2 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all ${t.textMain}`}>
                     <Mail className="w-4 h-4" />
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

export default TeamPage;
