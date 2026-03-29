import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { MessageSquare, Send } from 'lucide-react';

export const ExpertQnAPage = () => {
  const { t, isDarkMode } = useAppContext();
  const [questions, setQuestions] = useState([
    { id: 1, student: 'Alex Singh', question: 'How do you handle state normalization in Redux across large arrays?', lecture: 'Advanced State Management', answered: false },
    { id: 2, student: 'Sarah Connor', question: 'Does context API replace Redux completely?', lecture: 'Introduction to React Internals', answered: true, answer: 'No, they solve different problems. Context is for dependency injection, Redux is state management.' },
  ]);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [reply, setReply] = useState('');

  const submitAnswer = () => {
    if (!reply.trim()) return;
    setQuestions(questions.map(q => q.id === activeQuestion.id ? { ...q, answered: true, answer: reply } : q));
    setActiveQuestion(null);
    setReply('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>Q&A Dashboard</h2>
          <p className={t.textMuted}>Answer pending queries submitted by interns during your lectures.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className={`flex-1 rounded-2xl overflow-hidden shadow-sm border ${t.borderSoft} ${t.bg}`}>
          <div className="p-4 border-b font-bold tracking-wide text-amber-500 uppercase text-sm border-amber-500/20 bg-amber-500/5">
            Pending Questions
          </div>
          <div className="divide-y divide-gray-200 dark:divide-white/5">
            {questions.filter(q => !q.answered).map(q => (
              <div 
                key={q.id} 
                onClick={() => setActiveQuestion(q)}
                className={`p-4 cursor-pointer transition-colors ${activeQuestion?.id === q.id ? (isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50') : t.hover}`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-amber-500" />
                  <div className="flex-1">
                    <p className={`font-semibold ${t.textMain}`}>{q.question}</p>
                    <p className={`text-xs mt-1 ${t.textMuted}`}>From <strong className={t.textMain}>{q.student}</strong> via {q.lecture}</p>
                  </div>
                </div>
              </div>
            ))}
            {questions.filter(q => !q.answered).length === 0 && (
              <div className="p-10 text-center text-gray-500 text-sm">You are all caught up!</div>
            )}
          </div>
        </div>

        {activeQuestion && (
           <div className={`w-full lg:w-[450px] p-6 rounded-2xl flex flex-col justify-between ${t.card}`}>
              <div>
                <h3 className={`font-bold text-lg leading-tight mb-2 ${t.textMain}`}>{activeQuestion.question}</h3>
                <p className={`text-sm ${t.textMuted}`}>Posted by {activeQuestion.student}</p>
              </div>
              <div className="mt-8">
                <textarea 
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your expert answer here..."
                  className={`w-full h-32 p-3 rounded-xl border resize-none focus:ring-2 focus:ring-amber-500 outline-none ${t.input}`}
                ></textarea>
                <button 
                  onClick={submitAnswer}
                  className="w-full mt-4 flex justify-center items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95"
                >
                  <Send className="w-5 h-5" /> Send Reply to Intern
                </button>
              </div>
           </div>
        )}
      </div>

      <div className="mt-10">
        <h3 className={`text-lg font-bold mb-4 ${t.textMain}`}>Answered History</h3>
        <div className="space-y-4">
          {questions.filter(q => q.answered).map(q => (
            <div key={q.id} className={`p-5 rounded-2xl ${t.card}`}>
              <p className={`font-semibold ${t.textMain}`}>{q.question}</p>
              <div className={`mt-3 p-3 text-sm rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-gray-50 border-gray-100 text-gray-700'}`}>
                <strong>Your Reply:</strong> {q.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpertQnAPage;
