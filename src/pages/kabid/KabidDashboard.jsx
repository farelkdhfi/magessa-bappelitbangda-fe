import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Eye,
  Calendar,
  Building,
  Clock,
  CheckCircle,
  AlertCircle,
  Image,
  Search,
  X,
  Building2,
  UserCircle2,
  ChevronLeft,
  ChevronRight,
  Filter,
  LayoutDashboard,
  Briefcase,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';
import { api } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { atasanDisposisiService } from '../../services/atasanDisposisiService';
import LoadingSpinner from '../../components/Ui/LoadingSpinner';

// === UI COMPONENTS (Internal Style Definition) ===

// 1. Reusable Glass Stat Card
const GlassStatCard = ({ title, count, icon: Icon, subtitle, glowColor = "bg-white/5" }) => (
  <div className="group relative bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all duration-500 overflow-hidden">
    {/* Background Glow Effect */}
    <div className={`absolute -right-6 -top-6 w-24 h-24 ${glowColor} rounded-full blur-2xl group-hover:bg-white/10 transition-colors duration-500`} />

    <div className="relative z-10 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-zinc-800/50 rounded-2xl border border-white/5 text-zinc-400 group-hover:text-white group-hover:bg-zinc-800 transition-colors">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div>
        <h3 className="text-3xl font-semibold text-white tracking-tight mb-1">{count}</h3>
        <p className="text-sm text-zinc-500 font-medium">{title}</p>
        {subtitle && <p className="text-xs text-zinc-600 mt-2">{subtitle}</p>}
      </div>
    </div>
  </div>
);

const KabidDashboard = () => {
  const navigate = useNavigate();
  const [allDisposisi, setAllDisposisi] = useState([]);
  const [disposisiList, setDisposisiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchInstansi, setSearchInstansi] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [pagination, setPagination] = useState({
    limit: 10,
    offset: 0,
    total: 0
  });

  const [stats, setStats] = useState({
    total: 0,
    belumDibaca: 0,
    diproses: 0,
    selesai: 0
  });

  const { user } = useAuth();

  // Logic tetap sama 100%
  const applyFiltersAndPagination = () => {
    let filteredData = allDisposisi;

    if (filterStatus) {
      filteredData = filteredData.filter(item => item.status_dari_kabid === filterStatus);
    }

    if (searchInstansi.trim()) {
      filteredData = filteredData.filter(item =>
        item.asal_instansi &&
        item.asal_instansi.toLowerCase().includes(searchInstansi.toLowerCase())
      );
    }

    const startIndex = pagination.offset;
    const endIndex = startIndex + pagination.limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    setDisposisiList(paginatedData);
    setPagination(prev => ({
      ...prev,
      total: filteredData.length
    }));
  };

  const fetchDisposisi = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await atasanDisposisiService.getAtasanDisposisi();
      const result = response.data;
      let allData = [];
      if (result && Array.isArray(result.data)) {
        allData = result.data;
      } else if (result && Array.isArray(result)) {
        allData = result;
      } else {
        allData = [];
      }

      setAllDisposisi(allData);

      const total = allData.length;
      const belumDibaca = allData.filter(item => item.status_dari_kabid === 'belum dibaca').length;
      const diproses = allData.filter(item =>
        item.status_dari_kabid === 'diproses' || item.status_dari_kabid === 'dalam proses'
      ).length;
      const selesai = allData.filter(item => item.status_dari_kabid === 'selesai').length;

      setStats({ total, belumDibaca, diproses, selesai });

    } catch (err) {
      setError(err.message);
      toast.error('Gagal memuat data disposisi');
    } finally {
      setLoading(false);
    }
  };

  const viewDetail = async (item) => {
    if (item.status === 'belum dibaca' && item.status_dari_kabid === 'belum dibaca') {
      try {
        await api.put(`/disposisi/kabid/baca/${item.id}`, {});
        await fetchDisposisi();
        navigate(`/kabid/disposisi/detail/${item.id}`, {
          state: { disposisi: { ...item, status: 'dibaca', status_dari_kabid: 'dibaca' } }
        });
      } catch (error) {
        navigate(`/kabid/disposisi/detail/${item.id}`, {
          state: { disposisi: item }
        });
      }
    } else {
      navigate(`/kabid/disposisi/detail/${item.id}`, {
        state: { disposisi: item }
      });
    }
  };

  // ✅ STYLED BADGE COMPONENTS (Dark Mode Compatible)
  const getStatusBadge = (status_dari_kabid) => {
    const statusConfig = {
      'belum dibaca': {
        className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        icon: AlertCircle,
        text: 'Belum Dibaca'
      },
      'dibaca': {
        className: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        icon: Eye,
        text: 'Sudah Dibaca'
      },
      'diteruskan': {
        className: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        icon: ArrowUpRight,
        text: 'Diteruskan'
      },
      'diterima': {
        className: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        icon: CheckCircle,
        text: 'Diterima'
      },
      'diproses': {
        className: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        icon: Clock,
        text: 'Sedang Diproses'
      },
      'selesai': {
        className: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
        icon: CheckCircle,
        text: 'Selesai'
      }
    };

    const config = statusConfig[status_dari_kabid] || statusConfig['belum dibaca'];
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium border ${config.className}`}>
        <IconComponent className="w-3 h-3 mr-1.5" />
        <span className="uppercase tracking-wide">{config.text}</span>
      </span>
    );
  };

  const SifatBadge = ({ sifat }) => {
    const getSifatColor = (sifat) => {
      switch (sifat) {
        case 'Sangat Segera': return 'bg-red-500/10 text-red-400 border-red-500/20';
        case 'Segera': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
        case 'Rahasia': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
        default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
      }
    };

    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wide font-medium border ${getSifatColor(sifat)}`}>
        {sifat || '-'}
      </span>
    );
  };

  // Handlers
  const handlePageChange = (newOffset) => setPagination(prev => ({ ...prev, offset: newOffset }));
  const handleFilterChange = (newStatus) => {
    setFilterStatus(newStatus);
    setPagination(prev => ({ ...prev, offset: 0 }));
  };
  const handleSearchInput = (value) => {
    setSearchInput(value);
    setSearchInstansi(value);
    setPagination(prev => ({ ...prev, offset: 0 }));
  };
  const clearSearch = () => {
    setSearchInstansi('');
    setSearchInput('');
    setPagination(prev => ({ ...prev, offset: 0 }));
  };

  useEffect(() => { fetchDisposisi(); }, []);
  useEffect(() => {
    if (allDisposisi.length > 0) applyFiltersAndPagination();
  }, [filterStatus, searchInstansi, pagination.offset, allDisposisi]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen text-white font-sans selection:bg-white/20 pb-20">
      
      {/* 1. HEADER SECTION (Minimalist & Modern) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg border border-white/5 backdrop-blur-sm">
              <UserCircle2 className="w-5 h-5 text-zinc-400" />
            </div>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
              {user?.jabatan || 'Kepala Bidang'}
            </p>
          </div>
          <h1 className="text-3xl font-light tracking-tight text-white">
            Dashboard <span className="font-semibold text-zinc-400">Disposisi</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-900/50 px-4 py-2 rounded-full border border-white/5">
          <LayoutDashboard className="w-3 h-3" />
          <span>Selamat datang, <span className="text-zinc-300 font-medium">{user?.name}</span></span>
        </div>
      </div>

      {/* 2. STATS GRID (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <GlassStatCard
          title="Total Disposisi"
          count={stats.total}
          icon={FileText}
          subtitle="Semua surat masuk"
        />
        <GlassStatCard
          title="Belum Dibaca"
          count={stats.belumDibaca}
          icon={AlertCircle}
          subtitle="Perlu perhatian"
          glowColor="bg-emerald-500/20"
        />
        <GlassStatCard
          title="Sedang Diproses"
          count={stats.diproses}
          icon={Clock}
          subtitle="Dalam pengerjaan"
          glowColor="bg-amber-500/20"
        />
        <GlassStatCard
          title="Selesai"
          count={stats.selesai}
          icon={CheckCircle}
          subtitle="Arsip disposisi"
        />
      </div>

      {/* 3. MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Filters (Sticky Sidebar Look) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Filter & Pencarian</h3>
            <div className="space-y-4">
              {/* Search */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                <input
                  type="text"
                  placeholder="Cari instansi..."
                  value={searchInput}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  className="w-full bg-black/20 border border-white/5 rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/10 focus:bg-black/40 transition-all"
                />
                {searchInput && (
                  <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Status Select */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Status Disposisi</label>
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-sm text-zinc-300 appearance-none focus:outline-none focus:border-white/10 cursor-pointer"
                  >
                    <option value="">Semua Status</option>
                    <option value="belum dibaca">Belum Dibaca</option>
                    <option value="diproses">Sedang Diproses</option>
                    <option value="selesai">Selesai</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Filter className="w-4 h-4 text-zinc-500" />
                  </div>
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                    setFilterStatus('');
                    setSearchInstansi('');
                    setSearchInput('');
                    setPagination(prev => ({ ...prev, offset: 0 }));
                }}
                className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold uppercase tracking-wide transition-all border border-white/5"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: List Content */}
        <div className="lg:col-span-3 space-y-4">
          {disposisiList.length === 0 ? (
             <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-12 text-center">
               <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                 <FileText className="w-8 h-8 text-zinc-500" />
               </div>
               <h3 className="text-white font-medium mb-1">Tidak ada data ditemukan</h3>
               <p className="text-zinc-500 text-sm">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
             </div>
          ) : (
            disposisiList.map((item) => (
              <div 
                key={item.id} 
                className="group bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-3xl p-6 hover:bg-zinc-900/60 hover:border-white/10 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Icon / Visual Identifier */}
                  <div className="hidden md:flex flex-col items-center justify-center w-16 space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-zinc-700 transition-colors">
                      <FileText className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white group-hover:text-indigo-200 transition-colors mb-2">
                            {item.perihal || 'Tanpa Perihal'}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                           <span className="flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5" />
                              {item.asal_instansi || '-'}
                           </span>
                           <span className="w-1 h-1 rounded-full bg-zinc-600" />
                           <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {item.tanggal_surat || '-'}
                           </span>
                        </div>
                      </div>
                      
                      {/* Status Badges */}
                      <div className="flex flex-col items-end gap-2">
                         {getStatusBadge(item.status_dari_kabid)}
                         <SifatBadge sifat={item.sifat} />
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full bg-white/5" />

                    {/* Footer / Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono">
                            <span>NO. SURAT: {item.nomor_surat}</span>
                            <span>•</span>
                            <span>AGENDA: {item.nomor_agenda}</span>
                        </div>
                        
                        <button
                           onClick={() => viewDetail(item)}
                           className="w-full sm:w-auto px-6 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-xl text-sm font-bold transition-all shadow-lg shadow-white/5 flex items-center justify-center gap-2 group/btn"
                        >
                           Lihat Detail
                           <ArrowUpRight className="w-4 h-4 group-hover/btn:rotate-45 transition-transform" />
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Pagination */}
          {disposisiList.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-white/5">
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4 sm:mb-0">
                    Menampilkan {pagination.offset + 1}-{Math.min(pagination.offset + pagination.limit, pagination.total)} dari {pagination.total} Data
                </p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handlePageChange(Math.max(0, pagination.offset - pagination.limit))}
                        disabled={pagination.offset === 0}
                        className="p-3 rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handlePageChange(pagination.offset + pagination.limit)}
                        disabled={pagination.offset + pagination.limit >= pagination.total}
                        className="p-3 rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default KabidDashboard;