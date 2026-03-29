import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  Briefcase, Plus, Search, Filter, 
  UserPlus, CheckCircle2, Circle, Clock,
  MoreVertical, Loader2, ArrowRight,
  Target, Award, BookOpen
} from 'lucide-react';

const ManagerProjectsPage = () => {
  const { t, isDarkMode } = useAppContext();
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(null); // stores project_id

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, teamRes] = await Promise.all([
          api.get('/projects'), // General projects fetch (need to ensure this exists)
          api.get('/manager/team')
        ]);
        setProjects(projRes.data.data || []);
        setTeam(teamRes.data.data || []);
      } catch (err) {
        toast.error('Failed to load project data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAssign = async (projectId, internId) => {
    try {
      await api.post('/manager/projects/assign', {
        project_id: projectId,
        intern_id: internId
      });
      toast.success('Project assigned successfully');
      setAssigning(null);
    } catch (err) {
      toast.error('Failed to assign project');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>Project Assignments</h2>
          <p className={t.textMuted}>Assign curriculum projects to interns and monitor their live progress.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold transition-all shadow-lg active:scale-95">
          <Plus className="w-4 h-4" />
          Create New Project
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project List */}
        <div className="space-y-5">
          <h3 className={`text-sm font-bold uppercase tracking-widest flex items-center gap-2 ${t.textMuted}`}>
            <BookOpen className="w-4 h-4" />
            Curriculum Projects
          </h3>
          {loading ? (
            <div className="flex justify-center p-12"><Loader2 className="w-6 h-6 animate-spin text-amber-500" /></div>
          ) : projects.map(project => (
            <div key={project.id} className={`p-6 rounded-[32px] border transition-all hover:scale-[1.01] ${t.card}`}>
              <div className="flex justify-between items-start mb-4">
                 <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase">
                   {project.difficulty_level || 'Medium'}
                 </div>
                 <button 
                   onClick={() => setAssigning(assigning === project.id ? null : project.id)}
                   className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all ${
                     assigning === project.id 
                     ? 'bg-amber-500 text-white' 
                     : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                   }`}
                 >
                   <UserPlus className="w-3.5 h-3.5" />
                   {assigning === project.id ? 'Cancel' : 'Assign to Intern'}
                 </button>
              </div>

              <h4 className={`text-lg font-bold mb-2 ${t.textMain}`}>{project.title}</h4>
              <p className={`text-xs mb-6 line-clamp-2 ${t.textMuted}`}>{project.description}</p>
              
              <div className="flex items-center justify-between mt-auto">
                 <div className="flex items-center gap-4 text-[10px] font-bold uppercase text-slate-500">
                    <span className="flex items-center gap-1">
                       <Clock className="w-3 h-3" />
                       14 Days
                    </span>
                    <span className="flex items-center gap-1">
                       <Target className="w-3 h-3" />
                       {project.skills_covered?.length || 0} Skills
                    </span>
                 </div>
                 <div className="flex -space-x-1.5">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800" />
                    ))}
                 </div>
              </div>

              {/* Assignment Dropdown */}
              {assigning === project.id && (
                <div className="mt-6 pt-6 border-t border-white/5 animate-slide-down">
                   <p className={`text-[10px] font-bold uppercase mb-3 ${t.textMuted}`}>Select Team Member</p>
                   <div className="grid grid-cols-1 gap-2">
                      {team.map(intern => (
                        <button
                          key={intern.id}
                          onClick={() => handleAssign(project.id, intern.id)}
                          className={`flex items-center justify-between p-3 rounded-xl transition-all ${isDarkMode ? 'bg-white/[0.02] hover:bg-white/5' : 'bg-gray-50 hover:bg-gray-100'}`}
                        >
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-slate-800" />
                              <span className={`text-xs font-bold ${t.textMain}`}>{intern.full_name}</span>
                           </div>
                           <ArrowRight className="w-4 h-4 text-amber-500" />
                        </button>
                      ))}
                   </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Live Tracking / Activity */}
        <div className="space-y-5">
           <h3 className={`text-sm font-bold uppercase tracking-widest flex items-center gap-2 ${t.textMuted}`}>
             <Target className="w-4 h-4" />
             Assignment Status
           </h3>
           <div className={`p-8 rounded-[40px] border flex flex-col items-center justify-center text-center gap-4 ${t.card}`}>
              <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
                 <Clock className="w-8 h-8 text-amber-500" />
              </div>
              <div>
                 <h4 className={`font-bold ${t.textMain}`}>Active Tracking Feed</h4>
                 <p className={`text-xs max-w-xs mx-auto ${t.textMuted}`}>In Phase 5.2, we will add a real-time feed of milestone completions and reviewer comments here.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerProjectsPage;
