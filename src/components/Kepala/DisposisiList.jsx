import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Eye, 
  FileText, 
  Clock, 
  Archive, 
  Filter, 
  RotateCcw, 
  Trash2, 
  X, 
  RefreshCcw, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical,
  Calendar,
  Building,
  User,
  Activity
} from 'lucide-react';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../Ui/LoadingSpinner';

// === SUB-COMPONENTS (INLINED FOR STYLE CONSISTENCY) ===

// 1. Dark Glass Badge
const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', // Selesai
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20', // Proses
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20', // Dibaca
    danger: 'bg-red-500/10 text-red-400 border-red-500/20', // Sangat Segera
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20', // Rahasia
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${variants[variant] || variants.default}`}>
      {children}
    </span>
  );
};

// 2. Stat Card (Bento Style)
const StatBox = ({ title, count, icon: Icon, colorClass }) => (
  <div className="relative group overflow-hidden bg-zinc-900/30 border border-white/5 p-5 rounded-2xl hover:bg-white/5 transition-all duration-300">
    <div className={`absolute right-2 top-2 p-2 rounded-xl bg-white/5 ${colorClass} group-hover:scale-110 transition-transform`}>
      <Icon className="w-4 h-4" />
    </div>
    <div className="mt-4">
      <h3 className="text-2xl font-semibold text-white tracking-tight">{count}</h3>
      <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mt-1">{title}</p>
    </div>
  </div>
);

const DisposisiList = () => {
  const [disposisi, setDisposisi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSifat, setSelectedSifat] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDisposisi, setSelectedDisposisi] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6); // Reduced for grid layout

  const fetchDisposisi = async () => {
    try {
      setLoading(true);
      const response = await api.get('/disposisi/kepala');
      setDisposisi(response.data.data || []);
    } catch (err) {
      console.error('Error fetching disposisi:', err);
      toast.error(err.response?.data?.error || 'Gagal memuat data disposisi');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleteLoading(id);
      const response = await api.delete(`/disposisi/kepala/${id}`);
      setDisposisi(prev => prev.filter(item => item.id !== id));
      toast.success(response.data.message || 'Disposisi berhasil dihapus');
      closeDeleteModal();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Gagal menghapus disposisi');
    } finally {
      setDeleteLoading(null);
    }
  };

  const openDeleteModal = (item) => {
    setSelectedDisposisi(item);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedDisposisi(null);
  };

  useEffect(() => {
    fetchDisposisi();
  }, []);

  const filteredDisposisi = disposisi.filter(item => {
    const matchSearch = searchTerm === '' ||
      item.perihal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nomor_surat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.asal_instansi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.disposisi_kepada_jabatan?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSifat = selectedSifat === '' || item.sifat === selectedSifat;
    const matchStatus = selectedStatus === '' || item.status === selectedStatus;
    return matchSearch && matchSifat && matchStatus;
  });

  // Pagination Logic
  const totalItems = filteredDisposisi.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredDisposisi.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedSifat, selectedStatus]);

  // Statistics
  const stats = {
    total: disposisi.length,
    unread: disposisi.filter(i => i.status === 'belum dibaca').length,
    process: disposisi.filter(i => ['dalam proses', 'diproses'].includes(i.status)).length,
    done: disposisi.filter(i => i.status === 'selesai').length
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  // Helper for Badge Styles
  const getStatusVariant = (status) => {
    switch (status) {
      case 'belum dibaca': return 'default'; // Grey/Zinc
      case 'dibaca': return 'info';
      case 'dalam proses':
      case 'diproses': return 'warning';
      case 'selesai': return 'success';
      default: return 'default';
    }
  };

  const getSifatVariant = (sifat) => {
    switch (sifat) {
      case 'Sangat Segera': return 'danger';
      case 'Segera': return 'warning';
      case 'Rahasia': return 'purple';
      case 'Biasa': return 'info';
      default: return 'default';
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><LoadingSpinner /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 1. Top Section: Stats & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Stats Column */}
        <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox title="Total Data" count={stats.total} icon={Archive} colorClass="text-zinc-400" />
          <StatBox title="Belum Dibaca" count={stats.unread} icon={Activity} colorClass="text-red-400" />
          <StatBox title="Diproses" count={stats.process} icon={Clock} colorClass="text-amber-400" />
          <StatBox title="Selesai" count={stats.done} icon={CheckCircle2} colorClass="text-emerald-400" />
        </div>

        {/* Filters Bar */}
        <div className="lg:col-span-4 bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari perihal, instansi..." 
              className="w-full bg-black/20 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 focus:bg-black/40 transition-all"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <div className="relative min-w-[140px]">
              <select 
                value={selectedSifat}
                onChange={(e) => setSelectedSifat(e.target.value)}
                className="w-full appearance-none bg-zinc-800/50 border border-white/5 rounded-xl py-2.5 px-4 text-sm text-zinc-300 focus:outline-none focus:border-white/20 cursor-pointer hover:bg-zinc-800 transition-colors"
              >
                <option value="">Semua Sifat</option>
                <option value="Sangat Segera">Sangat Segera</option>
                <option value="Segera">Segera</option>
                <option value="Rahasia">Rahasia</option>
                <option value="Biasa">Biasa</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
            </div>

            <div className="relative min-w-[140px]">
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full appearance-none bg-zinc-800/50 border border-white/5 rounded-xl py-2.5 px-4 text-sm text-zinc-300 focus:outline-none focus:border-white/20 cursor-pointer hover:bg-zinc-800 transition-colors"
              >
                <option value="">Semua Status</option>
                <option value="belum dibaca">Belum Dibaca</option>
                <option value="dibaca">Dibaca</option>
                <option value="diproses">Dalam Proses</option>
                <option value="selesai">Selesai</option>
              </select>
              <Activity className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
            </div>

            <button 
              onClick={() => { setSearchTerm(''); setSelectedSifat(''); setSelectedStatus(''); }}
              className="p-2.5 bg-zinc-800/50 border border-white/5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Reset Filter"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            
            <button 
              onClick={fetchDisposisi}
              className="p-2.5 bg-zinc-800/50 border border-white/5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Refresh Data"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Disposisi Grid List */}
      {currentItems.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 border border-white/5 rounded-3xl backdrop-blur-sm">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
            <FileText className="w-6 h-6 text-zinc-500" />
          </div>
          <h3 className="text-lg font-light text-white mb-1">Data tidak ditemukan</h3>
          <p className="text-zinc-500 text-sm">Coba sesuaikan filter pencarian Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentItems.map((item) => (
            <div 
              key={item.id} 
              className="group relative flex flex-col bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 hover:border-white/10 hover:bg-zinc-900/60 transition-all duration-300 overflow-hidden"
            >
              {/* Decorative Glow */}
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500" />

              {/* Header */}
              <div className="relative z-10 flex justify-between items-start mb-4">
                <div className="flex-1 pr-4">
                  <h3 className="text-base font-semibold text-white leading-tight mb-1 line-clamp-2 group-hover:text-indigo-200 transition-colors">
                    {item.perihal || 'Tanpa Perihal'}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mt-2">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(item.created_at)}</span>
                    <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                    <span className="font-mono text-zinc-400">{item.nomor_surat || '-'}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={getSifatVariant(item.sifat)}>{item.sifat || 'Biasa'}</Badge>
                </div>
              </div>

              {/* Info Grid */}
              <div className="relative z-10 grid grid-cols-2 gap-3 mb-6 bg-black/20 rounded-xl p-3 border border-white/5">
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Dari Instansi</p>
                   <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                      <Building className="w-3 h-3 text-zinc-500" />
                      <span className="truncate">{item.asal_instansi || '-'}</span>
                   </div>
                </div>
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Kepada</p>
                   <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                      <User className="w-3 h-3 text-zinc-500" />
                      <span className="truncate">{item.disposisi_kepada_jabatan || '-'}</span>
                   </div>
                </div>
              </div>

              {/* Footer / Actions */}
              <div className="relative z-10 mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                <Badge variant={getStatusVariant(item.status)}>{item.status || 'Belum Dibaca'}</Badge>
                
                <div className="flex items-center gap-2">
                  <button 
                     onClick={() => openDeleteModal(item)}
                     disabled={deleteLoading === item.id}
                     className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                     title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button 
                     onClick={() => window.location.href = `/kepala/disposisi/${item.id}`}
                     className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-zinc-200 rounded-lg text-xs font-bold transition-colors shadow-lg shadow-white/5"
                  >
                    <Eye className="w-3 h-3" />
                    Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Minimalist Pagination */}
      {totalItems > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-white/5">
          <p className="text-xs text-zinc-500">
            Menampilkan <span className="text-white font-medium">{startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)}</span> dari <span className="text-white font-medium">{totalItems}</span> data
          </p>
          
          <div className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded-full border border-white/5">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-medium text-zinc-300 px-2">
              Halaman {currentPage}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Delete Modal (Glassmorphism) */}
      {showDeleteModal && selectedDisposisi && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
            onClick={closeDeleteModal}
          />
          <div className="relative bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            
            <h3 className="text-xl font-light text-white mb-2">Hapus Disposisi?</h3>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6">
              Anda akan menghapus disposisi perihal <strong className="text-white">{selectedDisposisi.perihal}</strong>. 
              Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl font-medium transition-colors border border-white/5"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(selectedDisposisi.id)}
                disabled={deleteLoading === selectedDisposisi.id}
                className="flex-1 px-4 py-3 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {deleteLoading === selectedDisposisi.id ? (
                  <LoadingSpinner className="w-4 h-4" />
                ) : (
                  'Ya, Hapus'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisposisiList;