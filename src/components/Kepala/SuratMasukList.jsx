import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // Import createPortal
import api from '../../utils/api';
import { 
  Calendar, 
  FileText, 
  CheckCircle2, 
  File as FileIcon, 
  Search, 
  Filter, 
  Clock, 
  Mail, 
  Image as ImageIcon,
  MoreVertical,
  RotateCcw,
  Building,
  Hash,
  Inbox
} from 'lucide-react';
import LoadingSpinner from '../Ui/LoadingSpinner';
import CreateDisposisiModal from './CreateDisposisiModal';
import isImageFile from '../../utils/isImageFile';
import ImageModal from '../Ui/ImageModal';

// === SUB-COMPONENTS FOR STYLE CONSISTENCY ===

// 1. Neon Badge
const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    unread: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', // Belum Dibaca
    read: 'bg-blue-500/10 text-blue-400 border-blue-500/20', // Sudah Dibaca
    disabled: 'bg-zinc-800/50 text-zinc-500 border-zinc-800' // Disposisi done
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${variants[variant] || variants.default}`}>
      {children}
    </span>
  );
};

// 2. Stat Box (Bento Style)
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

const SuratMasukList = () => {
  const [suratMasuk, setSuratMasuk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSurat, setSelectedSurat] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchSuratMasuk = async () => {
      try {
        setLoading(true);
        const response = await api.get('/surat-masuk/kepala');
        setSuratMasuk(response.data.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Gagal mengambil data surat masuk');
        setLoading(false);
      }
    };
    fetchSuratMasuk();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const response = await api.put(`/surat-masuk/kepala/${id}`);
      setSuratMasuk(prev =>
        prev.map(surat =>
          surat.id === id ? { ...surat, ...response.data.data } : surat
        )
      );
    } catch (err) {
      console.error('Gagal update status:', err);
    }
  };

  const handleBuatDisposisi = (surat) => {
    setSelectedSurat(surat);
    setShowModal(true);
  };

  const handleDisposisiSuccess = () => {
    setSuratMasuk(prev =>
      prev.map(surat =>
        surat.id === selectedSurat.id ? { ...surat, has_disposisi: true } : surat
      )
    );
    setShowModal(false);
    setSelectedSurat(null);
  };

  // Stats Logic
  const stats = {
    total: suratMasuk.length,
    unread: suratMasuk.filter(s => s.status === 'belum dibaca').length,
    read: suratMasuk.filter(s => s.status === 'sudah dibaca').length
  };

  // Filter Logic
  const filteredSuratMasuk = suratMasuk.filter(surat => {
    const matchesSearch =
      surat.asal_instansi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (surat.nomor_surat && surat.nomor_surat.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (surat.nomor_agenda && surat.nomor_agenda.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || surat.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="py-20 flex justify-center"><LoadingSpinner /></div>;
  if (error) return <div className="text-center py-20 text-red-400 bg-zinc-900/30 rounded-3xl border border-white/5 mx-4">{error}</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 1. Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatBox title="Total Surat Masuk" count={stats.total} icon={Inbox} colorClass="text-zinc-400" />
        <StatBox title="Belum Dibaca" count={stats.unread} icon={Mail} colorClass="text-emerald-400" />
        <StatBox title="Sudah Dibaca" count={stats.read} icon={CheckCircle2} colorClass="text-blue-400" />
      </div>

      {/* 2. Filter & Search Bar */}
      <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl shadow-black/20">
        
        {/* Search */}
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
          <input
            type="text"
            placeholder="Cari instansi, nomor surat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/20 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 focus:bg-black/40 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none md:min-w-[180px]">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full appearance-none bg-zinc-800/50 border border-white/5 rounded-xl py-2.5 px-4 text-sm text-zinc-300 focus:outline-none focus:border-white/20 cursor-pointer hover:bg-zinc-800 transition-colors"
            >
              <option value="all">Semua Status</option>
              <option value="belum dibaca">Belum Dibaca</option>
              <option value="sudah dibaca">Sudah Dibaca</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
          </div>

          <button 
             onClick={() => {setSearchTerm(''); setFilterStatus('all');}}
             className="p-2.5 bg-zinc-800/50 border border-white/5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
             title="Reset Filter"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Surat Grid List */}
      {filteredSuratMasuk.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 border border-white/5 rounded-3xl backdrop-blur-sm">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
            <Search className="w-6 h-6 text-zinc-500" />
          </div>
          <h3 className="text-lg font-light text-white mb-1">Tidak ada surat ditemukan</h3>
          <p className="text-zinc-500 text-sm">Coba ubah kata kunci atau filter status.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSuratMasuk.map((surat) => (
            <div
              key={surat.id}
              className="group relative flex flex-col bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 hover:border-white/10 hover:bg-zinc-900/60 transition-all duration-300 overflow-hidden"
            >
              {/* Header Card */}
              <div className="relative z-10 flex justify-between items-start mb-4">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={surat.status === 'belum dibaca' ? 'unread' : 'read'}>
                      {surat.status}
                    </Badge>
                    <span className="text-[10px] text-zinc-500 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(surat.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white leading-tight group-hover:text-indigo-200 transition-colors line-clamp-2">
                    {surat.asal_instansi}
                  </h3>
                </div>
              </div>

              {/* Detail Info */}
              <div className="relative z-10 grid grid-cols-2 gap-3 mb-4 bg-black/20 rounded-xl p-3 border border-white/5">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Nomor Surat</p>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                    <Hash className="w-3 h-3 text-zinc-500" />
                    <span className="truncate">{surat.nomor_surat || '-'}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Tgl Surat</p>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                    <Calendar className="w-3 h-3 text-zinc-500" />
                    <span>{surat.tanggal_surat || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Attachments (Gallery) */}
              {surat.photos && surat.photos.length > 0 && (
                <div className="relative z-10 mb-4">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2 flex items-center gap-1">
                      <FileIcon className="w-3 h-3" /> Lampiran ({surat.photos.length})
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {surat.photos.map((photo) => {
                        const isImage = isImageFile(photo);
                        return (
                          <div 
                            key={photo.id}
                            onClick={() => isImage ? setSelectedImage(photo.url) : window.open(photo.url, '_blank')}
                            className="flex-shrink-0 cursor-pointer group/img"
                          >
                             {isImage ? (
                               <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 relative">
                                  <img src={photo.url} alt="lampiran" className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500" />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                     <ImageIcon className="w-4 h-4 text-white" />
                                  </div>
                               </div>
                             ) : (
                               <div className="w-16 h-16 rounded-lg bg-zinc-800 border border-white/10 flex flex-col items-center justify-center text-zinc-500 group-hover/img:text-white group-hover/img:bg-zinc-700 transition-colors">
                                  <FileText className="w-6 h-6 mb-1" />
                                  <span className="text-[8px] uppercase">{photo.filename.split('.').pop()}</span>
                               </div>
                             )}
                          </div>
                        )
                      })}
                    </div>
                </div>
              )}

              {/* Actions Footer */}
              <div className="relative z-10 mt-auto pt-4 border-t border-white/5 flex gap-2">
                {surat.has_disposisi ? (
                  <button disabled className="flex-1 py-2.5 rounded-xl bg-zinc-800/50 border border-white/5 text-zinc-500 text-xs font-medium cursor-not-allowed flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Disposisi Selesai
                  </button>
                ) : (
                  <button 
                    onClick={() => handleBuatDisposisi(surat)}
                    className="flex-1 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-bold transition-all shadow-lg shadow-white/5 flex items-center justify-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Buat Disposisi
                  </button>
                )}

                {surat.status === 'belum dibaca' && (
                  <button 
                    onClick={() => handleMarkAsRead(surat.id)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                    title="Tandai Sudah Dibaca"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Dibaca</span>
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modals with React Portal */}
      {showModal && selectedSurat && createPortal(
        <CreateDisposisiModal
          surat={selectedSurat}
          onClose={() => setShowModal(false)}
          onSuccess={handleDisposisiSuccess}
        />,
        document.body
      )}

      {createPortal(
        <ImageModal
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />,
        document.body
      )}
    </div>
  );
};

export default SuratMasukList;