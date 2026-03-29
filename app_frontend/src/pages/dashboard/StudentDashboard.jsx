import React from 'react';
import { Zap, FolderOpen, Video, Award } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const StudentDashboard = () => {
  const { t } = useAppContext();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>My Intern Portal</h2>
          <p className={t.textMuted}>Track your skills, projects, lectures, and achievements.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Skill Level', value: '65%', icon: Zap, color: 'amber' },
          { label: 'Projects Done', value: '3/5', icon: FolderOpen, color: 'blue' },
          { label: 'Lectures', value: '12', icon: Video, color: 'emerald' },
          { label: 'Certificates', value: '2', icon: Award, color: 'purple' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`p-5 rounded-2xl ${t.card}`}>
            <div className={`w-10 h-10 bg-${color}-500/10 rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`text-${color}-500 w-5 h-5`} />
            </div>
            <div className={`text-2xl font-bold ${t.textMain}`}>{value}</div>
            <div className={`text-xs ${t.textMuted} mt-0.5`}>{label}</div>
          </div>
        ))}
      </div>

      <div className={`p-10 rounded-2xl text-center border-dashed ${t.card}`}>
        <p className={t.textMuted}>Skill radar charts, project kanban, and lecture calendar will render here in Phase 3.</p>
      </div>
    </div>
  );
};
