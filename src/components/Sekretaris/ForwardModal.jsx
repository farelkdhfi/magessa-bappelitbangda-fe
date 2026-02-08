import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  Loader,
  FileText,
  User,
  Users,
  Briefcase
} from 'lucide-react';
import { api } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

const ForwardModal = ({ isOpen, onClose, disposisi, onSuccess }) => {
  const { user } = useAuth();
  const [bawahanList, setBawahanList] = useState([]);
  const [jabatanList, setJabatanList] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedJabatan, setSelectedJabatan] = useState('');
  const [catatan, setCatatan] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [tipePenerusan, setTipePenerusan] = useState('user'); // 'jabatan' atau 'user'

  // Fetch data saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      fetchData();
      // Reset form
      setSelectedUserId('');
      setSelectedJabatan('');
      setCatatan('');
      setTipePenerusan('user'); // Default ke user
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      
      // Fetch bawahan (hanya untuk user spesifik)
      const bawahanResponse = await api.get('/disposisi/atasan/list-bawahan');
      setBawahanList(bawahanResponse.data.data || []);
      
      // Fetch jabatan list
      const jabatanResponse = await api.get('/disposisi/atasan/list-jabatan');
      setJabatanList(jabatanResponse.data || []);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      // alert('Gagal memuat data'); // Ganti dengan toast di implementasi nyata jika ada
    } finally {
      setLoadingData(false);
    }
  };

  const handleForward = async () => {
    if (tipePenerusan === 'jabatan' && !selectedJabatan) {
      alert('Silakan pilih jabatan penerima');
      return;
    }

    if (tipePenerusan === 'user' && !selectedUserId) {
      alert('Silakan pilih user penerima');
      return;
    }

    if (!user?.role) {
      alert('Role user tidak ditemukan');
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        tipe_penerusan: tipePenerusan,
        catatan_atasan: catatan
      };

      if (tipePenerusan === 'jabatan') {
        payload.diteruskan_kepada_jabatan = selectedJabatan;
      } else {
        payload.diteruskan_kepada_user_id = selectedUserId;
      }

      const response = await api.post(`/disposisi/atasan/${user.role}/teruskan/${disposisi.id}`, payload);

      // alert(response.data.message || 'Disposisi berhasil diteruskan'); // Ganti dengan toast
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
    setSelectedJabatan('');
    setSelectedUserId('');
    setCatatan('');
    setTipePenerusan('user');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-zinc-900/50">
          <div>
              <h3 className="text-lg font-semibold text-white tracking-tight">Teruskan Disposisi</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Pilih penerima disposisi surat ini</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scrollable Area */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          {/* Info Card - Dark Glass */}
          <div className="bg-zinc-900/50 rounded-2xl p-4 mb-6 border border-white/5 relative overflow-hidden group">
            {/* Glow Effect */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors" />
            
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400">
                        <FileText className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Detail Surat</span>
                </div>
                <div className="space-y-2">
                    <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-0.5">Perihal</p>
                        <p className="text-sm text-zinc-200 font-medium leading-relaxed">{disposisi.perihal}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-0.5">Sifat Surat</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 text-zinc-300 border border-white/5">
                            {disposisi.sifat}
                        </span>
                    </div>
                </div>
            </div>
          </div>

          {/* Tipe Penerusan Switcher */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
              Metode Penerusan
            </label>
            <div className="grid grid-cols-2 gap-3 p-1 bg-zinc-900/50 rounded-xl border border-white/5">
              <button
                onClick={() => setTipePenerusan('user')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold rounded-lg transition-all duration-300 ${
                  tipePenerusan === 'user'
                    ? 'bg-zinc-800 text-white shadow-lg shadow-black/20 border border-white/10'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                User Spesifik
              </button>
              <button
                onClick={() => setTipePenerusan('jabatan')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold rounded-lg transition-all duration-300 ${
                  tipePenerusan === 'jabatan'
                    ? 'bg-zinc-800 text-white shadow-lg shadow-black/20 border border-white/10'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                Jabatan
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
              {tipePenerusan === 'jabatan' ? (
                // Penerusan ke Jabatan
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
                    Pilih Jabatan <span className="text-red-500">*</span>
                  </label>
                  {loadingData ? (
                    <div className="flex items-center gap-3 px-4 py-3 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 text-sm">
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Memuat daftar jabatan...</span>
                    </div>
                  ) : (
                    <div className="relative">
                        <select
                        value={selectedJabatan}
                        onChange={(e) => setSelectedJabatan(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-900 border border-white/10 text-zinc-200 rounded-xl focus:outline-none focus:border-white/30 focus:bg-black transition-all appearance-none text-sm"
                        disabled={loading}
                        >
                        <option value="" className="bg-zinc-900 text-zinc-500">Pilih jabatan penerima...</option>
                        {jabatanList.map((jabatan) => (
                            <option key={jabatan} value={jabatan} className="bg-zinc-900 text-white">
                            {jabatan}
                            </option>
                        ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                            <Users className="w-4 h-4" />
                        </div>
                    </div>
                  )}
                  <p className="text-[10px] text-zinc-500 mt-2 flex items-center gap-1.5 bg-white/5 p-2 rounded-lg border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    Disposisi akan hilang dari inbox Anda setelah diteruskan.
                  </p>
                </div>
              ) : (
                // Penerusan ke User Spesifik
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
                    Pilih Bawahan <span className="text-red-500">*</span>
                  </label>
                  {loadingData ? (
                    <div className="flex items-center gap-3 px-4 py-3 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 text-sm">
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Memuat daftar bawahan...</span>
                    </div>
                  ) : (
                    <div className="relative">
                        <select
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-900 border border-white/10 text-zinc-200 rounded-xl focus:outline-none focus:border-white/30 focus:bg-black transition-all appearance-none text-sm"
                        disabled={loading}
                        >
                        <option value="" className="bg-zinc-900 text-zinc-500">Pilih bawahan...</option>
                        {bawahanList.map((bawahan) => (
                            <option key={bawahan.id} value={bawahan.id} className="bg-zinc-900 text-white">
                            {bawahan.name} - {bawahan.jabatan}
                            </option>
                        ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                            <User className="w-4 h-4" />
                        </div>
                    </div>
                  )}
                  {bawahanList.length === 0 && !loadingData && (
                    <p className="text-xs text-red-400 mt-2 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
                      Tidak ada bawahan ditemukan di struktur Anda.
                    </p>
                  )}
                </div>
              )}

              {/* Catatan Area */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
                  Catatan Tambahan
                </label>
                <textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Tulis instruksi atau catatan untuk penerima..."
                  rows={4}
                  className="w-full px-4 py-3 bg-zinc-900 border border-white/10 text-zinc-200 placeholder-zinc-600 rounded-xl focus:outline-none focus:border-white/30 focus:bg-black transition-all resize-none text-sm"
                  disabled={loading}
                />
              </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/5 bg-zinc-900/30 flex justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleForward}
            disabled={loading || loadingData || 
              (tipePenerusan === 'jabatan' && !selectedJabatan) || 
              (tipePenerusan === 'user' && !selectedUserId)}
            className="flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold text-sm transition-all shadow-lg shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Teruskan Sekarang</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ForwardModal;