import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { Trash2, Calendar, Clock, FileText, User, AlertTriangle, X, Search, Mail, Image as ImageIcon, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import isImageFile from '../../utils/isImageFile';
import ImageModal from '../Ui/ImageModal';

const AdminDaftarSuratKeluar = () => {
  const [suratList, setSuratList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, suratId: null, suratInfo: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const fetchSuratKeluar = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/surat-keluar');
      const data = response.data.data || [];
      setSuratList(data);
      setFilteredData(data);
    } catch (err) {
      const errorMessage = 'Gagal memuat daftar surat keluar';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = suratList;
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(surat =>
        surat.nama_surat?.toLowerCase().includes(searchLower) ||
        surat.ditujukan_ke?.toLowerCase().includes(searchLower) ||
        surat.keterangan?.toLowerCase().includes(searchLower) ||
        surat.catatan_internal?.toLowerCase().includes(searchLower)
      );
    }
    setFilteredData(filtered);
  }, [suratList, searchTerm]);

  const openDeleteModal = (surat) => {
    setDeleteModal({
      isOpen: true,
      suratId: surat.id,
      suratInfo: {
        nama_surat: surat.nama_surat,
        ditujukan_ke: surat.ditujukan_ke,
        created_at: surat.created_at
      }
    });
  };

  const handleConfirmDelete = async (id) => {
    try {
      await api.delete(`/surat-keluar/${id}`);
      toast.success('Surat berhasil dihapus');
      setDeleteModal({ isOpen: false, suratId: null, suratInfo: null });
      fetchSuratKeluar();
    } catch (err) {
      const errorMessage = 'Gagal menghapus surat keluar';
      toast.error(errorMessage);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSuratKeluar();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
  };

  // --- NEW STYLE COMPONENTS ---
  
  const StatItem = ({ label, count, icon: Icon }) => (
    <div className="relative overflow-hidden p-6 rounded-3xl border bg-zinc-900/50 backdrop-blur-sm border-white/5 text-white hover:border-white/20 transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-xl border bg-white/5 border-white/5">
                <Icon className="w-5 h-5 text-zinc-400" />
            </div>
        </div>
        <div>
            <h3 className="text-4xl font-light tracking-tight mb-1">{count}</h3>
            <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">{label}</p>
        </div>
    </div>
  );

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <span className="text-xs text-zinc-500 uppercase tracking-widest animate-pulse">Memuat Arsip...</span>
        </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
            <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">Terjadi Kesalahan</h3>
        <p className="text-zinc-500 text-sm mb-6 max-w-xs mx-auto">{error}</p>
        <button onClick={fetchSuratKeluar} className="px-6 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-zinc-200 transition">
            Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto pb-20">
      
        {/* 1. STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <StatItem label="Total Surat Keluar" count={suratList.length} icon={Mail} />
            <StatItem label="Bulan Ini" count={suratList.filter(s => new Date(s.created_at).getMonth() === new Date().getMonth()).length} icon={Calendar} />
        </div>

        {/* 2. SEARCH BAR */}
        <div className="bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-2xl p-4 mb-8 sticky top-4 z-20 shadow-2xl shadow-black/20">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input 
                        type="text"
                        placeholder="Cari perihal, tujuan, atau keterangan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full text-zinc-500 hover:text-white transition">
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>
            </div>
            <div className="mt-3 px-1 flex justify-between items-center text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
                <span>Menampilkan {filteredData.length} data</span>
            </div>
        </div>

        {/* 3. CONTENT GRID */}
        {filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-zinc-900/20">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-white/5">
                    <Search className="w-6 h-6 text-zinc-600" />
                </div>
                <h3 className="text-white font-medium mb-1">Tidak ditemukan</h3>
                <p className="text-zinc-500 text-sm">Coba ubah kata kunci pencarian anda.</p>
                {searchTerm && (
                    <button onClick={clearFilters} className="mt-4 text-xs text-white underline underline-offset-4">Reset Pencarian</button>
                )}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredData.map((surat) => (
                    <article key={surat.id} className="group bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl p-6 hover:border-white/20 transition-all duration-300 flex flex-col h-full">
                        
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white leading-tight mb-1 group-hover:text-zinc-100 transition-colors line-clamp-2">
                                    {surat.nama_surat}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-zinc-400 mt-2">
                                    <User className="w-3 h-3" />
                                    <span className="capitalize">Tujuan: {surat.ditujukan_ke?.replace(/-/g, ' ') || '-'}</span>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 bg-zinc-950 border border-white/5 px-2 py-1 rounded-lg">
                                {formatDate(surat.created_at)}
                            </span>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-6 bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Tanggal Surat</p>
                                <div className="flex items-center gap-2 text-zinc-300 text-xs">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {formatDate(surat.tanggal_surat)}
                                </div>
                            </div>
                             <div>
                                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Diinput Pada</p>
                                <div className="flex items-center gap-2 text-zinc-300 text-xs">
                                    <Clock className="w-3.5 h-3.5" />
                                    {formatDate(surat.created_at)}
                                </div>
                            </div>
                            <div className="col-span-2 pt-2 border-t border-white/5">
                                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Keterangan</p>
                                <p className="text-xs text-zinc-400 leading-relaxed italic line-clamp-2">
                                    {surat.keterangan || "Tidak ada keterangan."}
                                </p>
                            </div>
                        </div>

                        {/* Lampiran */}
                        {surat.files && surat.files.length > 0 && (
                            <div className="mb-6">
                                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-3 flex items-center gap-2">
                                    <ImageIcon className="w-3 h-3" /> Lampiran ({surat.files.length})
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    {surat.files.slice(0, 4).map((file) => {
                                        const isImage = isImageFile(file);
                                        return (
                                            <div 
                                                key={file.id}
                                                onClick={() => isImage ? setSelectedImage(file.url) : window.open(file.url, '_blank')}
                                                className="w-12 h-12 rounded-lg bg-zinc-950 border border-white/10 overflow-hidden cursor-pointer hover:border-white/40 transition-all flex items-center justify-center relative group/img"
                                                title={file.filename}
                                            >
                                                {isImage ? (
                                                    <img src={file.url} alt="Lampiran" className="w-full h-full object-cover opacity-70 group-hover/img:opacity-100 transition-opacity" />
                                                ) : (
                                                    <FileText className="w-5 h-5 text-zinc-500 group-hover/img:text-white transition-colors" />
                                                )}
                                            </div>
                                        )
                                    })}
                                    {surat.files.length > 4 && (
                                        <div className="w-12 h-12 rounded-lg bg-zinc-800 border border-white/5 flex items-center justify-center text-xs text-zinc-400">
                                            +{surat.files.length - 4}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="mt-auto pt-4 border-t border-white/5">
                            <button 
                                onClick={() => openDeleteModal(surat)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-bold rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Hapus Arsip
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        )}

        {/* 4. MODALS */}
        
        {/* Delete Modal */}
        {deleteModal.isOpen && (
             <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
                <div className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                    <div className="p-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-8 h-8 text-rose-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Hapus Arsip?</h3>
                        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                            Surat <span className="text-white font-medium">"{deleteModal.suratInfo?.nama_surat}"</span> akan dihapus permanen.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button 
                                onClick={() => setDeleteModal({ isOpen: false, suratId: null, suratInfo: null })} 
                                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 hover:text-white transition-all"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={() => handleConfirmDelete(deleteModal.suratId)} 
                                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-900/20 transition-all"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <ImageModal
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
        />
    </div>
  );
};

export default AdminDaftarSuratKeluar;