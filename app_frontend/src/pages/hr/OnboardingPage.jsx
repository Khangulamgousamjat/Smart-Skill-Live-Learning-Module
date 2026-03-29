import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  ClipboardCheck, Search, Filter, User, 
  CheckCircle2, Circle, Clock, Loader2,
  ChevronRight, ArrowRight, Flag
} from 'lucide-react';

const OnboardingPage = () => {
  const { t, isDarkMode } = useAppContext();
  const [statusList, setStatusList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOnboarding = async () => {
      try {
        const res = await api.get('/hr/onboarding-status');
        if (res.data.success) {
          setStatusList(res.data.data);
        }
      } catch (err) {
        toast.error('Failed to load onboarding status');
      } finally {
        setLoading(false);
      }
    };
    fetchOnboarding();
  }, []);

  const getProgress = (item) => {
    const steps = [
      item.profile_completed,
      item.department_confirmed,
      item.skill_gap_viewed,
      item.first_lecture_attended,
      item.first_project_submitted
    ];
    const completed = steps.filter(Boolean).length;
    return (completed / steps.length) * 100;
  };

  const filtered = statusList.filter(item => 
    item.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>Onboarding Tracking</h2>
          <p className={t.textMuted}>Verify completion of the 5-step onboarding journey for each intern.</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Completed', count: statusList.filter(i => i.checklist_completed).length, icon: CheckCircle2, color: 'text-green-500' },
          { label: 'In Progress', count: statusList.filter(i => !i.checklist_completed).length, icon: Clock, color: 'text-amber-500' },
          { label: 'Critical Delay', count: 0, icon: Flag, color: 'text-red-500' }
        ].map((stat, idx) => (
          <div key={idx} className={`p-5 rounded-2xl border ${t.card}`}>
            <div className="flex items-center gap-3 mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className={`text-sm font-bold ${t.textMain}`}>{stat.label}</span>
            </div>
            <p className={`text-2xl font-black ${t.textMain}`}>{stat.count}</p>
          </div>
        ))}
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
        <div className="space-y-4">
          {filtered.map(item => {
            const progress = getProgress(item);
            return (
              <div key={item.id} className={`p-5 rounded-3xl border group transition-all hover:scale-[1.01] ${t.card}`}>
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className="flex items-center gap-4 min-w-[250px]">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-amber-500 font-bold">
                      {item.full_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className={`font-bold ${t.textMain}`}>{item.full_name}</h4>
                      <p className={`text-xs ${t.textMuted}`}>{item.email}</p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                      <span className={t.textMuted}>Journey Completion</span>
                      <span className={t.textMain}>{Math.round(progress)}%</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                      <div 
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-1000" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 lg:gap-8 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                    {[
                      { label: 'Profile', val: item.profile_completed },
                      { label: 'Dept', val: item.department_confirmed },
                      { label: 'Skills', val: item.skill_gap_viewed },
                      { label: 'Lecture', val: item.first_lecture_attended },
                      { label: 'Project', val: item.first_project_submitted }
                    ].map((step, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1 min-w-[60px]">
                        {step.val ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className={`w-5 h-5 ${isDarkMode ? 'text-slate-700' : 'text-gray-200'}`} />
                        )}
                        <span className={`text-[9px] font-bold uppercase ${t.textMuted}`}>{step.label}</span>
                      </div>
                    ))}
                  </div>

                  <button className={`p-2 rounded-xl transition-all ${t.hoverCard}`}>
                    <ChevronRight className={`w-5 h-5 ${t.textMuted}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;
