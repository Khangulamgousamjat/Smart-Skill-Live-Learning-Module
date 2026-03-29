import React from 'react';
import { Bot, X, MessageSquare, Send } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const Chatbot = () => {
  const { 
    isDarkMode, t, isChatOpen, setIsChatOpen, 
    chatMessages, chatInput, setChatInput, 
    isChatLoading, handleSendMessage, chatEndRef
  } = useAppContext();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isChatOpen && (
        <div className={`w-80 sm:w-96 h-[500px] rounded-2xl mb-4 flex flex-col overflow-hidden transform transition-all shadow-2xl ${t.modalBg}`}>
          <div className={`p-4 flex justify-between items-center text-white ${isDarkMode ? 'bg-slate-800 border-b border-white/10' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}>
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <h3 className="font-bold text-sm">ERP Mentor Bot ✨</h3>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 flex flex-col ${isDarkMode ? 'bg-black/20' : 'bg-gray-50'}`}>
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${msg.role === 'user' ? (isDarkMode ? 'bg-blue-600 text-white rounded-br-none' : 'bg-blue-600 text-white rounded-br-none') : (isDarkMode ? 'bg-white/10 border border-white/10 text-slate-200 rounded-bl-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none')}`}>
                  <span className="whitespace-pre-wrap leading-relaxed">{msg.text}</span>
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className={`rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center space-x-1 ${isDarkMode ? 'bg-white/10 border border-white/10' : 'bg-white border border-gray-200'}`}>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className={`p-3 flex items-center gap-2 border-t ${isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-gray-200'}`}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask your mentor..."
              className={`flex-1 px-4 py-2 text-sm rounded-full focus:outline-none transition-all ${t.input}`}
              disabled={isChatLoading}
            />
            <button 
              type="submit" 
              disabled={!chatInput.trim() || isChatLoading}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
      
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-all transform hover:scale-110 flex items-center justify-center ${isChatOpen ? 'bg-red-500 text-white' : (isDarkMode ? 'bg-slate-700 text-white border border-white/20' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white')}`}
      >
        {isChatOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
};
