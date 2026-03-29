import React from 'react';
import { Target, Users, LayoutList } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const ManagerDashboard = () => {
  const { t } = useAppContext();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>Manager Hub</h2>
          <p className={t.textMuted}>Project assignment, intern evaluations, and squad tracking.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-2xl ${t.card}`}>
           <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <Target className="text-amber-500 w-6 h-6" />
            </div>
            <div><h3 className={`font-semibold ${t.textMain}`}>Active Projects</h3></div>
          </div>
        </div>
        <div className={`p-6 rounded-2xl ${t.card}`}>
           <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Users className="text-blue-500 w-6 h-6" />
            </div>
            <div><h3 className={`font-semibold ${t.textMain}`}>My Team</h3></div>
          </div>
        </div>
        <div className={`p-6 rounded-2xl ${t.card}`}>
           <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <LayoutList className="text-emerald-500 w-6 h-6" />
            </div>
            <div><h3 className={`font-semibold ${t.textMain}`}>Pending Evaluations</h3></div>
          </div>
        </div>
      </div>
      
      <div className={`p-10 rounded-2xl text-center border-dashed ${t.card}`}>
        <p className={t.textMuted}>Project kanban boards and review interfaces will generate here.</p>
      </div>
    </div>
  );
};
