import { FileText, X, CheckCircle, Download, Calendar, User, Building2, MessageSquare, Trash2, AlertTriangle, Search, Filter, Loader, Mail, Clock, AlertCircle, ChevronDown, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';
import { useState, useEffect } from 'react';
import isImageFile from '../../utils/isImageFile';
import ImageModal from '../Ui/ImageModal';

const AdminDaftarSuratMasuk = () => {
  const [suratData, setSuratData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, suratId: null, suratInfo: null });
  const [selectedImage, setSelectedImage] = useState(null);

  // State untuk pencarian dan filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch data dari API
  useEffect(() => {
    fetchAllData();
  }, []);

  // Effect untuk filtering dan searching
  useEffect(() => {
    let filtered = suratData;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(surat => surat.status === statusFilter);
    }
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(surat =>
        surat.asal_instansi?.toLowerCase().includes(searchLower) ||
        surat.tujuan_jabatan?.toLowerCase().includes(searchLower) ||
        surat.nomor_surat?.toLowerCase().includes(searchLower) ||
        surat.keterangan?.toLowerCase().includes(searchLower)
      );
    }
    setFilteredData(filtered);
  }, [suratData, searchTerm, statusFilter]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError('');
      const suratResponse = await api.get('/surat-masuk');
      const disposisiResponse = await api.get('/disposisi/kepala');

      const disposisiMapping = {};
      disposisiResponse.data?.data?.forEach(disposisi => {
        if (disposisi.surat_masuk?.id) {
          disposisiMapping[disposisi.surat_masuk.id] = disposisi.id;
        }
      });

      const suratWithDisposisiId = suratResponse.data?.data?.map(surat => ({
        ...surat,
        disposisi_id: disposisiMapping[surat.id] || null
      })) || [];

      setSuratData(suratWithDisposisiId);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.error || 'Gagal memuat data');
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // --- NEW STYLE HELPERS ---

  const getStatusBadge = (status) => {
    const isRead = status === 'sudah dibaca';
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
        isRead 
        ? 'bg-white text-black border-white' 
        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
      }`}>
        {isRead ? 'Selesai' : 'Unread'}
      </span>
    );
  };

  const StatItem = ({ label, count, icon: Icon, active }) => (
    <div className={`relative overflow-hidden p-6 rounded-3xl border transition-all duration-300 ${
        active 
        ? 'bg-white text-black border-white' 
        : 'bg-zinc-900/50 backdrop-blur-sm border-white/5 text-white hover:border-white/20'
    }`}>
        <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-xl border ${
                active ? 'bg-black/5 border-black/10' : 'bg-white/5 border-white/5'
            }`}>
                <Icon className={`w-5 h-5 ${active ? 'text-black' : 'text-zinc-400'}`} />
            </div>
        </div>
        <div>
            <h3 className="text-4xl font-light tracking-tight mb-1">{count}</h3>
            <p className={`text-[10px] uppercase tracking-widest font-bold ${
                active ? 'text-black/60' : 'text-zinc-500'
            }`}>{label}</p>
        </div>
    </div>
  );

  const handleDownloadPDF = async (suratId, nomorSurat) => {
    setIsDownloading(true);
    setDownloadProgress(0);
    try {
      const surat = suratData.find(s => s.id === suratId);
      const disposisiId = surat?.disposisi_id;

      if (!disposisiId) {
        toast.error('Disposisi belum dibuat oleh Kepala Dinas');
        return;
      }

      const response = await api.get(`/disposisi/download-pdf/${disposisiId}`, {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          const total = progressEvent.total;
          const current = progressEvent.loaded;
          if (total) setDownloadProgress(Math.round((current / total) * 100));
        }
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `disposisi-${nomorSurat || suratId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('PDF berhasil diunduh!');
    } catch (err) {
      toast.error('Gagal mengunduh PDF');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleConfirmDelete = async (id) => {
    try {
      await api.delete(`/surat-masuk/${id}`);
      toast.success('Surat dihapus');
      setDeleteModal({ isOpen: false, suratId: null, suratInfo: null });
      fetchAllData();
    } catch (error) {
      toast.error('Gagal menghapus');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  // Stats
  const totalSurat = suratData.length;
  const belumDibaca = suratData.filter(surat => surat.status === 'belum dibaca').length;
  const sudahDibaca = suratData.filter(surat => surat.status === 'sudah dibaca').length;

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <span className="text-xs text-zinc-500 uppercase tracking-widest animate-pulse">Memuat Database...</span>
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
        <button onClick={fetchAllData} className="px-6 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-zinc-200 transition">
            Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto pb-20">
        
        {/* 1. STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatItem label="Total Surat" count={totalSurat} icon={Mail} />
            <StatItem label="Pending" count={belumDibaca} icon={Clock} />
            <StatItem label="Selesai" count={sudahDibaca} icon={CheckCircle} active={true} />
        </div>

        {/* 2. FILTER & SEARCH BAR */}
        <div className="bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-2xl p-4 mb-8 sticky top-4 z-20 shadow-2xl shadow-black/20">
            <div className="flex flex-col md:flex-row gap-4">
                
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input 
                        type="text"
                        placeholder="Cari instansi, nomor surat, atau keterangan..."
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

                {/* Filter Dropdown */}
                <div className="relative">
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`flex items-center justify-between gap-3 w-full md:w-48 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                            statusFilter !== 'all' 
                            ? 'bg-white text-black border-white' 
                            : 'bg-zinc-950 text-zinc-300 border-white/10 hover:border-white/30'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            {statusFilter === 'all' ? 'Semua Status' : statusFilter === 'belum dibaca' ? 'Pending' : 'Selesai'}
                        </span>
                        <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-30 animate-in fade-in zoom-in-95 duration-100">
                            <button onClick={() => { setStatusFilter('all'); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition">
                                Semua Status
                            </button>
                            <button onClick={() => { setStatusFilter('belum dibaca'); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition">
                                Belum Dibaca
                            </button>
                            <button onClick={() => { setStatusFilter('sudah dibaca'); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition">
                                Sudah Dibaca
                            </button>
                        </div>
                    )}
                </div>

                {/* Reset Button */}
                {(searchTerm || statusFilter !== 'all') && (
                    <button 
                        onClick={clearFilters}
                        className="px-4 py-3 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 text-sm font-medium transition-all"
                    >
                        Reset
                    </button>
                )}
            </div>
            
            {/* Filter Info */}
            <div className="mt-3 px-1 flex justify-between items-center text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
                <span>Total Data: {filteredData.length}</span>
                {statusFilter !== 'all' && <span>Filter: {statusFilter}</span>}
            </div>
        </div>

        {/* 3. CONTENT GRID */}
        {filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-zinc-900/20">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-white/5">
                    <Search className="w-6 h-6 text-zinc-600" />
                </div>
                <h3 className="text-white font-medium mb-1">Tidak ditemukan</h3>
                <p className="text-zinc-500 text-sm">Coba ubah kata kunci atau filter anda.</p>
                <button onClick={clearFilters} className="mt-4 text-xs text-white underline underline-offset-4">Hapus Filter</button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredData.map((surat) => (
                    <article key={surat.id} className="group bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl p-6 hover:border-white/20 transition-all duration-300 flex flex-col h-full">
                        
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white leading-tight mb-1 group-hover:text-zinc-100 transition-colors">
                                    {surat.asal_instansi}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-zinc-400">
                                    <User className="w-3 h-3" />
                                    <span className="capitalize">{surat.tujuan_jabatan?.replace(/-/g, ' ') || '-'}</span>
                                </div>
                            </div>
                            {getStatusBadge(surat.status)}
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-6 bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Tanggal</p>
                                <div className="flex items-center gap-2 text-zinc-300 text-xs">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {formatDate(surat.created_at)}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Agenda</p>
                                <div className="flex items-center gap-2 text-zinc-300 text-xs">
                                    <FileText className="w-3.5 h-3.5" />
                                    {surat.nomor_surat}
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
                        {surat.photos && surat.photos.length > 0 && (
                            <div className="mb-6">
                                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-3 flex items-center gap-2">
                                    <ImageIcon className="w-3 h-3" /> Lampiran ({surat.photos.length})
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    {surat.photos.slice(0, 4).map((photo) => {
                                        const isImage = isImageFile(photo);
                                        return (
                                            <div 
                                                key={photo.id}
                                                onClick={() => isImage ? setSelectedImage(photo.url) : window.open(photo.url, '_blank')}
                                                className="w-12 h-12 rounded-lg bg-zinc-950 border border-white/10 overflow-hidden cursor-pointer hover:border-white/40 transition-all flex items-center justify-center relative group/img"
                                            >
                                                {isImage ? (
                                                    <img src={photo.url} alt="Lampiran" className="w-full h-full object-cover opacity-70 group-hover/img:opacity-100 transition-opacity" />
                                                ) : (
                                                    <FileText className="w-5 h-5 text-zinc-500 group-hover/img:text-white transition-colors" />
                                                )}
                                            </div>
                                        )
                                    })}
                                    {surat.photos.length > 4 && (
                                        <div className="w-12 h-12 rounded-lg bg-zinc-800 border border-white/5 flex items-center justify-center text-xs text-zinc-400">
                                            +{surat.photos.length - 4}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Actions (Pushed to bottom) */}
                        <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                            {surat.has_disposisi === true && surat.disposisi_id ? (
                                <button 
                                    onClick={() => handleDownloadPDF(surat.id, surat.nomor_surat)}
                                    disabled={isDownloading}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50"
                                >
                                    {isDownloading ? <Loader className="w-3 h-3 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                                    Download
                                </button>
                            ) : (
                                <div className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-500 text-xs font-medium rounded-xl border border-transparent cursor-not-allowed">
                                    <Clock className="w-3.5 h-3.5" /> Menunggu Disposisi
                                </div>
                            )}

                            <button 
                                onClick={() => setDeleteModal({ isOpen: true, suratId: surat.id, suratInfo: surat })}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-bold rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Hapus
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
                        <h3 className="text-lg font-semibold text-white mb-2">Hapus Data?</h3>
                        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                            Data dari <span className="text-white font-medium">{deleteModal.suratInfo?.asal_instansi}</span> akan dihapus permanen.
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
                                Hapus Permanen
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

export default AdminDaftarSuratMasuk;