import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { UploadCloud, FileText, Upload, Trash2, Link as LinkIcon } from 'lucide-react';

export const ExpertResourcesPage = () => {
  const { t, isDarkMode } = useAppContext();
  const [resources, setResources] = useState([
    { id: 1, title: 'React Hooks Cheatsheet', type: 'PDF', url: '#' },
    { id: 2, title: 'State Management Overview', type: 'Video', url: '#' },
  ]);
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>Resource Library</h2>
          <p className={t.textMuted}>Upload slides, notes, and study guides for your interns.</p>
        </div>
        <button 
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl shadow-lg hover:bg-emerald-500 font-bold transition-all active:scale-95"
        >
          <Upload className="w-5 h-5" /> Upload File
        </button>
      </div>

      {showUpload && (
         <div className={`p-6 rounded-2xl border-dashed border-2 flex flex-col items-center justify-center space-y-4 ${isDarkMode ? 'border-white/20 bg-white/5' : 'border-emerald-200 bg-emerald-50'}`}>
            <UploadCloud className="w-12 h-12 text-emerald-500" />
            <p className={`font-bold ${t.textMain}`}>Drag & Drop resources here</p>
            <p className={`text-sm ${t.textMuted}`}>Support for PDF, DOCX, ZIP, MP4 up to 50MB.</p>
            <button className="px-6 py-2 bg-white text-emerald-600 font-bold rounded-full shadow-sm hover:shadow-md transition-shadow">Browse Files</button>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {resources.map(r => (
          <div key={r.id} className={`p-5 rounded-2xl flex flex-col justify-between ${t.card}`}>
            <div className="flex items-start justify-between">
               <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                 {r.type === 'PDF' ? <FileText className="w-5 h-5 text-emerald-500" /> : <LinkIcon className="w-5 h-5 text-emerald-500" />}
               </div>
               <button className="text-red-500 hover:text-red-400 p-2"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="mt-4">
               <h3 className={`font-bold text-lg leading-snug ${t.textMain}`}>{r.title}</h3>
               <p className={`text-xs mt-1 uppercase font-bold tracking-wider text-emerald-500`}>{r.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpertResourcesPage;
