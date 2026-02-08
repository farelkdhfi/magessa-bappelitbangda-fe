import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  Loader,
  FileText,
  User,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { api } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

const ForwardModal = ({ isOpen, onClose, disposisi, onSuccess }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [catatan, setCatatan] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Fetch users saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      // Reset form ketika modal dibuka
      setSelectedUserId('');
      setCatatan('');
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const bawahanResponse = await api.get('/disposisi/atasan/list-bawahan');
      setUsers(bawahanResponse.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Gagal memuat daftar user');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleForward = async () => {
    if (!selectedUserId) {
      alert('Silakan pilih penerima');
      return;
    }

    if (!user?.role) {
      alert('Role user tidak ditemukan');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(`/disposisi/atasan/${user.role}/teruskan/${disposisi.id}`, {
        diteruskan_kepada_user_id: selectedUserId,
        catatan_atasan: catatan
      });

      alert(response.data.message || 'Disposisi berhasil diteruskan');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error forwarding disposisi:', error);
      const message = error.response?.data?.error || 'Gagal meneruskan disposisi';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedUserId('');
    setCatatan('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl shadow-black/50 max-w-md w-full transform transition-all animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/5 blur-3xl rounded-full pointer-events-none" />

        {/* Header */}
        <div className="relative p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white tracking-tight">Teruskan Disposisi</h3>
            <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">Action Required</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* Info Card - Disposisi Context */}
          <div className="bg-zinc-950/50 rounded-2xl p-4 border border-white/5 mb-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-zinc-300 mb-2">Detail Dokumen</h4>
                <div className="space-y-1">
                  <p className="text-xs text-zinc-500">
                    <span className="text-zinc-600 uppercase tracking-wider font-bold text-[10px] mr-2">PERIHAL</span>
                    <span className="text-zinc-300">{disposisi.perihal}</span>
                  </p>
                  <p className="text-xs text-zinc-500">
                    <span className="text-zinc-600 uppercase tracking-wider font-bold text-[10px] mr-2">SIFAT</span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-zinc-300">
                      {disposisi.sifat}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {/* Input: Pilih Penerima */}
            <div>
              <label className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                <User className="w-3 h-3" />
                Teruskan Kepada <span className="text-red-500">*</span>
              </label>
              
              {loadingUsers ? (
                <div className="flex items-center justify-center py-4 bg-zinc-900 border border-white/5 rounded-xl border-dashed">
                  <Loader className="w-4 h-4 animate-spin mr-2 text-zinc-400" />
                  <span className="text-sm text-zinc-500">Memuat daftar user...</span>
                </div>
              ) : (
                <div className="relative group">
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 focus:bg-black/40 transition-all appearance-none cursor-pointer"
                    disabled={loading}
                  >
                    <option value="" className="bg-zinc-900 text-zinc-500">Pilih penerima...</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id} className="bg-zinc-900 text-white">
                        {user.name} — {user.jabatan}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    <ArrowRight className="w-4 h-4 rotate-90" />
                  </div>
                </div>
              )}
              {users.length === 0 && !loadingUsers && (
                <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                  <X className="w-3 h-3" /> Tidak ada user bawahan ditemukan
                </p>
              )}
            </div>

            {/* Input: Catatan */}
            <div>
              <label className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                <MessageSquare className="w-3 h-3" />
                Catatan Atasan (Opsional)
              </label>
              <textarea
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Tambahkan instruksi khusus..."
                rows={4}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 focus:bg-black/40 transition-all resize-none"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-transparent hover:bg-zinc-800 text-zinc-500 hover:text-white rounded-2xl font-semibold transition-colors border border-transparent hover:border-white/5 text-sm"
          >
            Batal
          </button>
          <button
            onClick={handleForward}
            disabled={loading || !selectedUserId || loadingUsers}
            className="flex-[2] px-4 py-3 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold transition-all shadow-xl shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <span>Teruskan Sekarang</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForwardModal;