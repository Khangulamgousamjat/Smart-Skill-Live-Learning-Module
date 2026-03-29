import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Video, Calendar, Plus, Clock, ExternalLink } from 'lucide-react';

export const ExpertMyLecturesPage = () => {
  const { t, isDarkMode } = useAppContext();
  const [lectures, setLectures] = useState([
    { id: 1, title: 'Introduction to React Internals', time: 'Tomorrow, 10:00 AM', status: 'upcoming', link: 'https://zoom.us' },
    { id: 2, title: 'Advanced State Management', time: 'Friday, 2:00 PM', status: 'upcoming', link: 'https://zoom.us' },
  ]);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>My Lectures</h2>
          <p className={t.textMuted}>Schedule and manage your live video broadcast sessions.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-500 font-bold transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" /> Schedule Session
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-6">
        {lectures.map(l => (
          <div key={l.id} className={`p-5 rounded-2xl flex justify-between items-center ${t.card}`}>
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                 <Video className="w-6 h-6 text-blue-500" />
               </div>
               <div>
                  <h3 className={`font-bold text-lg ${t.textMain}`}>{l.title}</h3>
                  <div className={`flex items-center gap-2 mt-1 ${t.textMuted}`}>
                    <Clock className="w-4 h-4" /> {l.time}
                  </div>
               </div>
            </div>
            <div className="flex gap-3">
              <button className={`px-4 py-2 text-sm font-bold border rounded-lg hover:bg-black/5 ${t.borderSoft} ${t.textMain}`}>Edit</button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-emerald-500/20 text-emerald-600 rounded-lg hover:bg-emerald-500/30 transition-colors">
                <ExternalLink className="w-4 h-4" /> Start Broadcast
              </button>
            </div>
          </div>
        ))}
        {lectures.length === 0 && (
          <div className={`p-10 rounded-2xl text-center border-dashed ${t.card}`}>
             <p className={t.textMuted}>You haven't scheduled any lectures yet.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-md p-6 rounded-2xl ${t.modalBg} animate-slide-up`}>
            <h3 className={`text-xl font-bold mb-4 ${t.textMain}`}>Schedule New Lecture</h3>
            <div className="space-y-4">
              <div>
                <label className={`text-sm font-semibold ${t.textMain}`}>Session Title</label>
                <input type="text" placeholder="e.g. Advanced State Management" className={`w-full mt-1 p-2 rounded-lg border outline-none ${t.input}`} />
              </div>
              <div>
                <label className={`text-sm font-semibold ${t.textMain}`}>Date & Time</label>
                <input type="datetime-local" className={`w-full mt-1 p-2 rounded-lg border outline-none ${t.input}`} />
              </div>
              <div>
                <label className={`text-sm font-semibold ${t.textMain}`}>Meeting Link (Zoom/Teams)</label>
                <input type="url" placeholder="https://" className={`w-full mt-1 p-2 rounded-lg border outline-none ${t.input}`} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className={`px-4 py-2 font-bold rounded-lg text-gray-500 hover:bg-gray-100`}>Cancel</button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-500">Schedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertMyLecturesPage;
