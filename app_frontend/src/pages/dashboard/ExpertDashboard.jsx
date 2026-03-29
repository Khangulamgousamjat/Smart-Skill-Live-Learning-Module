import React from 'react';
import { BookOpen, MessageSquare, UploadCloud } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const ExpertDashboard = () => {
  const { t } = useAppContext();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>Expert Studio</h2>
          <p className={t.textMuted}>Manage your lectures, resources, and intern Q&A sessions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-2xl ${t.card}`}>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <BookOpen className="text-blue-500 w-6 h-6" />
            </div>
            <div>
              <h3 className={`font-semibold ${t.textMain}`}>My Lectures</h3>
              <p className={`text-sm ${t.textMuted}`}>Upcoming & past sessions</p>
            </div>
          </div>
        </div>
        <div className={`p-6 rounded-2xl ${t.card}`}>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <UploadCloud className="text-emerald-500 w-6 h-6" />
            </div>
            <div>
              <h3 className={`font-semibold ${t.textMain}`}>Resources</h3>
              <p className={`text-sm ${t.textMuted}`}>PDFs, slides, recordings</p>
            </div>
          </div>
        </div>
        <div className={`p-6 rounded-2xl ${t.card}`}>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <MessageSquare className="text-amber-500 w-6 h-6" />
            </div>
            <div>
              <h3 className={`font-semibold ${t.textMain}`}>Q&A Dashboard</h3>
              <p className={`text-sm ${t.textMuted}`}>Pending intern questions</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`p-10 rounded-2xl text-center border-dashed ${t.card}`}>
        <p className={t.textMuted}>Lecture scheduling and resource upload tools will appear here in Phase 3.</p>
      </div>
    </div>
  );
};
