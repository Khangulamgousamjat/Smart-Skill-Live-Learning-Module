import React from 'react';
import { ShieldAlert, Users, Settings } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const SuperAdminDashboard = () => {
  const { t } = useAppContext();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>Super Admin Center</h2>
          <p className={t.textMuted}>Platform oversight, role approvals, and global settings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-2xl ${t.card}`}>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
              <ShieldAlert className="text-red-500 w-6 h-6" />
            </div>
            <div>
              <h3 className={`font-semibold ${t.textMain}`}>Pending Approvals</h3>
              <p className={`text-sm ${t.textMuted}`}>Staff role requests</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-red-500">12</div>
        </div>
        
        <div className={`p-6 rounded-2xl ${t.card}`}>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Users className="text-blue-500 w-6 h-6" />
            </div>
            <div>
              <h3 className={`font-semibold ${t.textMain}`}>Total Users</h3>
              <p className={`text-sm ${t.textMuted}`}>Across all roles</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-500">2,451</div>
        </div>

        <div className={`p-6 rounded-2xl ${t.card}`}>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-slate-500/10 rounded-xl flex items-center justify-center">
              <Settings className="text-slate-500 w-6 h-6" />
            </div>
            <div>
              <h3 className={`font-semibold ${t.textMain}`}>System Health</h3>
              <p className={`text-sm ${t.textMuted}`}>API & DB Status</p>
            </div>
          </div>
          <div className="text-xl font-bold text-green-500">All Systems Operational</div>
        </div>
      </div>
      
      <div className={`p-10 rounded-2xl text-center border-dashed ${t.card}`}>
        <p className={t.textMuted}>Detailed approval table and global settings will be implemented here in Phase 3.</p>
      </div>
    </div>
  );
};
