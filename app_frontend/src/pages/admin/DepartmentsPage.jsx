import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  Building2, Plus, Trash2, Loader2, 
  Search, Briefcase, Info, AlertCircle 
} from 'lucide-react';

const DepartmentsPage = () => {
  const { t, isDarkMode } = useAppContext();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/departments');
      setDepartments(res.data.data || []);
    } catch {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    
    setLoading(true);
    try {
      const res = await api.post('/admin/departments', { 
        name: newName, 
        description: newDesc 
      });
      setDepartments(prev => [...prev, res.data.data]);
      setNewName('');
      setNewDesc('');
      setIsAdding(false);
      toast.success('Department created successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create department');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    
    setDeletingId(id);
    try {
      await api.delete(`/admin/departments/${id}`);
      setDepartments(prev => prev.filter(d => d.id !== id));
      toast.success('Department deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete department');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = departments.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.description && d.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>Departments</h2>
          <p className={t.textMuted}>Manage organizational units and teams.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold transition-all shadow-lg active:scale-95"
        >
          <Plus className="w-4 h-4" />
          {isAdding ? 'Cancel' : 'New Department'}
        </button>
      </div>

      {isAdding && (
        <div className={`p-6 rounded-2xl border animate-slide-down ${t.card}`}>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${t.textMuted}`}>Department Name</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Full Stack Development"
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none ${t.input}`}
                  required
                />
              </div>
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${t.textMuted}`}>Description (Optional)</label>
                <input 
                  type="text" 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Brief purpose of this team"
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none ${t.input}`}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={loading || !newName.trim()}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Department'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={`p-4 rounded-2xl flex items-center gap-3 ${t.card}`}>
        <Search className={`w-4 h-4 ${t.textMuted}`} />
        <input 
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter departments..."
          className={`flex-1 bg-transparent outline-none text-sm ${t.textMain}`}
        />
      </div>

      {loading && departments.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-32 rounded-2xl animate-pulse ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className={`p-16 rounded-2xl text-center border-2 border-dashed ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-amber-500" />
          </div>
          <h3 className={`text-lg font-bold ${t.textMain}`}>No Departments Found</h3>
          <p className={t.textMuted}>Try creating one or adjusting your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(dept => (
            <div key={dept.id} className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] group ${t.card}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-amber-500" />
                </div>
                <button 
                  onClick={() => handleDelete(dept.id)}
                  className={`p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ${
                    isDarkMode ? 'hover:bg-red-500/10 text-slate-500 hover:text-red-400' 
                               : 'hover:bg-red-50 text-gray-400 hover:text-red-600'
                  }`}
                  disabled={deletingId === dept.id}
                >
                  {deletingId === dept.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
              <h4 className={`font-bold text-lg mb-1 ${t.textMain}`}>{dept.name}</h4>
              <p className={`text-xs leading-relaxed ${t.textMuted}`}>
                {dept.description || 'No description provided.'}
              </p>
              
              <div className={`mt-4 pt-4 border-t flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${t.border} ${t.textMuted}`}>
                <Info className="w-3 h-3" />
                ID: {dept.id.substring(0, 8)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DepartmentsPage;
