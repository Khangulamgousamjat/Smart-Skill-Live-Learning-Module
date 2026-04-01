import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Search, Send, User, MoreVertical, Phone, Video, Info, Smile, Paperclip, Loader2, MessageSquare, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSocket } from '../../context/SocketContext';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export default function StudentMessages() {
  const { t } = useLanguage();
  const { user } = useSelector((s) => s.auth);
  const { socket } = useSocket();
  
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (socket) {
      socket.on('receive_message', (data) => {
        if (selectedUser && (data.senderId === selectedUser.id || data.senderId === user.id)) {
          setMessages((prev) => [...prev, {
            id: Date.now(),
            sender_id: data.senderId,
            content: data.message,
            created_at: new Date().toISOString()
          }]);
        }
        fetchConversations(); // Update sidebar last message
      });
      return () => socket.off('receive_message');
    }
  }, [socket, selectedUser, user.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/messages/conversations/list');
      setConversations(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (targetId) => {
    setMsgLoading(true);
    try {
      const res = await axiosInstance.get(`/messages/${targetId}`);
      setMessages(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load messages');
    } finally {
      setMsgLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const msgData = {
      receiverId: selectedUser.id,
      content: newMessage
    };

    try {
      const res = await axiosInstance.post('/messages', msgData);
      // Emit via socket for real-time
      socket.emit('send_message', {
        receiverId: selectedUser.id,
        senderId: user.id,
        senderName: user.full_name,
        message: newMessage
      });

      setMessages((prev) => [...prev, res.data.data]);
      setNewMessage('');
      fetchConversations(); // Refresh sidebar
    } catch (err) {
      toast.error('Failed to send');
    }
  };

  const handleSearch = async (val) => {
    setSearchQuery(val);
    if (val.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await axiosInstance.get(`/users?search=${val}`);
      setSearchResults(res.data.data.filter(u => u.id !== user.id));
    } catch (err) {}
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-140px)] flex gap-0 md:gap-6 bg-transparent overflow-hidden">
        
        {/* Sidebar */}
        <AnimatePresence>
          {(!selectedUser || window.innerWidth > 768) && (
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="w-full md:w-80 lg:w-96 flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden shrink-0 shadow-xl"
            >
              <div className="p-6 border-b border-[var(--color-border)]">
                <h1 className="text-xl font-bold font-sora text-[var(--color-text-primary)] mb-4">{t('messages')}</h1>
                <div className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input 
                    type="text" 
                    placeholder={t('searchUsers')}
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] pl-11 pr-4 py-3 rounded-2xl text-sm focus:border-[var(--color-primary)] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {searchQuery.length >= 2 ? (
                  <div className="p-2 space-y-1">
                    <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest p-4 pb-2">Search Results</p>
                    {searchResults.map(u => (
                      <button 
                        key={u.id}
                        onClick={() => { setSelectedUser(u); setSearchQuery(''); }}
                        className="w-full flex items-center gap-4 p-4 hover:bg-[var(--color-surface-2)] rounded-2xl transition-all text-left"
                      >
                         <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
                            {u.profile_photo_url ? <img src={u.profile_photo_url} className="w-full h-full object-cover" /> : <User className="text-[var(--color-text-muted)]" />}
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-[var(--color-text-primary)] truncate">{u.full_name}</p>
                            <p className="text-[10px] text-[var(--color-text-muted)] uppercase">{u.role}</p>
                         </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {loading ? (
                      <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[var(--color-primary)]" /></div>
                    ) : conversations.length === 0 ? (
                      <div className="p-8 text-center text-[var(--color-text-muted)] text-sm italic">{t('noConversations')}</div>
                    ) : (
                      conversations.map(conv => (
                        <button 
                          key={conv.other_id}
                          onClick={() => setSelectedUser({ id: conv.other_id, full_name: conv.full_name, profile_photo_url: conv.profile_photo_url })}
                          className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left group ${selectedUser?.id === conv.other_id ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'hover:bg-[var(--color-surface-2)]'}`}
                        >
                           <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                              {conv.profile_photo_url ? <img src={conv.profile_photo_url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-black/10 flex items-center justify-center text-xl font-bold">{conv.full_name?.charAt(0)}</div>}
                           </div>
                           <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-0.5">
                                <p className={`font-bold text-sm truncate ${selectedUser?.id === conv.other_id ? 'text-white' : 'text-[var(--color-text-primary)]'}`}>{conv.full_name}</p>
                                <span className={`text-[9px] ${selectedUser?.id === conv.other_id ? 'text-white/60' : 'text-[var(--color-text-muted)]'}`}>
                                  {conv.last_message_at && format(new Date(conv.last_message_at), 'HH:mm')}
                                </span>
                              </div>
                              <p className={`text-xs truncate ${selectedUser?.id === conv.other_id ? 'text-white/80' : 'text-[var(--color-text-muted)]'}`}>
                                {conv.last_message}
                              </p>
                           </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-2xl relative ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
           {selectedUser ? (
             <>
               {/* Chat Header */}
               <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface)]/80 backdrop-blur-md sticky top-0 z-10">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setSelectedUser(null)} className="md:hidden p-2 -ml-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
                       <ArrowLeft size={20} />
                    </button>
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-[var(--color-border)] shrink-0">
                       {selectedUser.profile_photo_url ? <img src={selectedUser.profile_photo_url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[var(--color-surface-2)] flex items-center justify-center text-lg font-bold">{selectedUser.full_name?.charAt(0)}</div>}
                    </div>
                    <div>
                       <h3 className="font-bold text-[var(--color-text-primary)] text-sm">{selectedUser.full_name}</h3>
                       <p className="text-[10px] text-[var(--color-success)] flex items-center gap-1 font-bold italic">
                         <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" /> {t('online')}
                       </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                     <button className="p-2.5 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] rounded-xl transition-all"><Phone size={18}/></button>
                     <button className="p-2.5 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] rounded-xl transition-all"><Video size={18}/></button>
                     <button className="p-2.5 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] rounded-xl transition-all"><MoreVertical size={18}/></button>
                  </div>
               </div>

               {/* Messages History */}
               <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[var(--color-surface-2)]/30">
                  {msgLoading ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[var(--color-primary)] opacity-50" /></div>
                  ) : (
                    <>
                      <div className="text-center py-4">
                        <span className="bg-[var(--color-surface)] border border-[var(--color-border)] text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">Chat started</span>
                      </div>
                      {messages.map((m) => {
                        const isMine = m.sender_id === user.id;
                        return (
                          <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                             <div className={`max-w-[80%] md:max-w-[70%] group relative`}>
                                <div className={`p-4 rounded-2xl shadow-sm border ${isMine 
                                  ? 'bg-[var(--color-primary)] text-white border-blue-400/20 rounded-tr-none' 
                                  : 'bg-[var(--color-surface)] text-[var(--color-text-primary)] border-[var(--color-border)] rounded-tl-none'}`}>
                                   <p className="text-sm leading-relaxed">{m.content}</p>
                                </div>
                                <p className={`text-[9px] mt-1.5 font-bold uppercase tracking-tighter text-[var(--color-text-muted)] shrink-0 ${isMine ? 'text-right' : 'text-left'}`}>
                                   {format(new Date(m.created_at), 'HH:mm')}
                                </p>
                             </div>
                          </div>
                        );
                      })}
                      <div ref={chatEndRef} />
                    </>
                  )}
               </div>

               {/* Input Area */}
               <form onSubmit={handleSendMessage} className="p-4 bg-[var(--color-surface)] border-t border-[var(--color-border)]">
                  <div className="flex items-center gap-3 bg-[var(--color-surface-2)] border border-[var(--color-border)] p-2 rounded-2xl focus-within:border-[var(--color-primary)] transition-all">
                     <button type="button" className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-all"><Smile size={20}/></button>
                     <button type="button" className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-all"><Paperclip size={20}/></button>
                     <input 
                       type="text" 
                       value={newMessage}
                       onChange={(e) => setNewMessage(e.target.value)}
                       placeholder={t('typeMessage')}
                       className="flex-1 bg-transparent border-none outline-none text-sm py-2 px-1 text-[var(--color-text-primary)]"
                     />
                     <button 
                       type="submit" 
                       disabled={!newMessage.trim()}
                       className="bg-[var(--color-primary)] text-white p-2.5 rounded-xl hover:opacity-90 disabled:opacity-30 transition-all shadow-lg shadow-blue-500/20"
                     >
                       <Send size={18} />
                     </button>
                  </div>
               </form>
             </>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
               <div className="w-24 h-24 bg-[var(--color-surface-2)] rounded-3xl border border-[var(--color-border)] flex items-center justify-center mb-6 shadow-sm">
                  <MessageSquare size={40} className="text-[var(--color-primary)] opacity-50" />
               </div>
               <h2 className="text-2xl font-bold font-sora text-[var(--color-text-primary)] mb-2">Your Conversations</h2>
               <p className="text-[var(--color-text-muted)] max-w-xs mx-auto leading-relaxed">Select a user from the sidebar to start a real-time secure chat.</p>
             </div>
           )}
        </div>
      </div>
    </DashboardLayout>
  );
}
