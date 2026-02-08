import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  X,
  Building2,
  UserCircle2,
  ChevronLeft,
  ChevronRight,
  Filter,
  LayoutGrid,
  MoreVertical,
  Calendar
} from 'lucide-react';
import { staffDisposisiService } from '../../services/staffDisposisiService';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/Ui/LoadingSpinner';

// === UI COMPONENTS (ADAPTED FROM NEW DESIGN SYSTEM) ===

// 1. New Stat Card (Bento Style)
const BentoStatCard = ({ title, count, icon: Icon, subtitle, glowColor = "bg-white/5" }) => (
  <div className="group relative bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all duration-500 overflow-hidden">
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

// 2. Styled Badges (Glassy Look)
const StatusBadge = ({ status }) => {
  const styles = {
    'belum dibaca': { css: 'bg-red-500/10 text-red-400 border-red-500/20', icon: AlertCircle, label: 'Belum Dibaca' },
    'dibaca': { css: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: Eye, label: 'Sudah Dibaca' },
    'diproses': { css: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', icon: Clock, label: 'Diproses' },
    'selesai': { css: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle, label: 'Selesai' }
  };

  const config = styles[status] || styles['belum dibaca'];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${config.css} backdrop-blur-md`}>
      <Icon className="w-3.5 h-3.5" />
      <span className="text-[10px] font-bold uppercase tracking-wide">{config.label}</span>
    </div>
  );
};

const SifatBadge = ({ sifat }) => {
  const getStyle = (s) => {
    switch (s) {
      case 'Sangat Segera': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Segera': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Rahasia': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${getStyle(sifat)}`}>
      {sifat || '-'}
    </span>
  );
};

// === MAIN PAGE ===

const StaffDashboard = () => {
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

  // === LOGIC START (TIDAK DIUBAH) ===
  const applyFiltersAndPagination = () => {
    let filteredData = allDisposisi;

    if (filterStatus) {
      filteredData = filteredData.filter(item => item.status_dari_bawahan === filterStatus);
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

      const response = await staffDisposisiService.getDaftarDisposisi({});
      let allData = [];
      if (response && Array.isArray(response.data)) {
        allData = response.data;
      } else if (response && Array.isArray(response)) {
        allData = response;
      } else {
        allData = [];
      }

      setAllDisposisi(allData);

      const total = allData.length;
      const belumDibaca = allData.filter(item => item.status_dari_bawahan === 'belum dibaca').length;
      const diproses = allData.filter(item =>
        item.status_dari_bawahan === 'diproses' || item.status_dari_bawahan === 'diproses'
      ).length;
      const selesai = allData.filter(item => item.status_dari_bawahan === 'selesai').length;

      setStats({ total, belumDibaca, diproses, selesai });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newOffset) => {
    setPagination(prev => ({ ...prev, offset: newOffset }));
  };

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

  const handleViewDetail = (id) => {
    navigate(`/staff/disposisi/${id}`);
  };

  useEffect(() => {
    fetchDisposisi();
  }, []);

  useEffect(() => {
    if (allDisposisi.length > 0) {
      applyFiltersAndPagination();
    }
  }, [filterStatus, searchInstansi, pagination.offset, allDisposisi]);
  // === LOGIC END ===

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-red-500/20 rounded-3xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-light text-white mb-2">Terjadi Kesalahan</h3>
          <p className="text-zinc-500 text-sm mb-6">{error}</p>
          <button
            onClick={fetchDisposisi}
            className="w-full px-4 py-3 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold transition-all"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white font-sans selection:bg-white/20 pb-20">
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">

        {/* 1. Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-lg border border-white/5 backdrop-blur-sm">
                <UserCircle2 className="w-5 h-5 text-zinc-400" />
              </div>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
                Staff Dashboard &bull; {user?.name}
              </p>
            </div>
            <h1 className="text-4xl font-light tracking-tight text-white">
              Disposisi <span className="font-semibold text-zinc-500">Masuk</span>
            </h1>
            <div className="flex items-center gap-2 text-zinc-500">
              <Building2 className="w-4 h-4" />
              <span className="text-sm">{user?.jabatan || 'Staff Pegawai'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-900/50 px-4 py-2 rounded-full border border-white/5">
            <LayoutGrid className="w-3 h-3" />
            <span>Total: {stats.total} Dokumen</span>
          </div>
        </div>

        {/* 2. Stats Grid (Bento Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <BentoStatCard
            title="Total Disposisi"
            count={stats.total}
            icon={FileText}
            subtitle="Semua surat masuk"
          />
          <BentoStatCard
            title="Belum Dibaca"
            count={stats.belumDibaca}
            icon={AlertCircle}
            subtitle="Perlu perhatian segera"
            glowColor="bg-red-500/20"
          />
          <BentoStatCard
            title="Sedang Diproses"
            count={stats.diproses}
            icon={Clock}
            subtitle="Dalam pengerjaan"
            glowColor="bg-yellow-500/20"
          />
          <BentoStatCard
            title="Selesai"
            count={stats.selesai}
            icon={CheckCircle}
            subtitle="Telah ditindaklanjuti"
            glowColor="bg-emerald-500/20"
          />
        </div>

        {/* 3. Filter & Search Bar */}
        <div className="bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">

            {/* Search */}
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
              <input
                type="text"
                placeholder="Cari asal instansi..."
                value={searchInput}
                onChange={(e) => handleSearchInput(e.target.value)}
                className="w-full bg-black/20 border border-white/5 rounded-2xl py-3 pl-10 pr-10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/10 focus:bg-black/40 transition-all"
              />
              {searchInput && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter Dropdown */}
            <div className="relative min-w-[200px] w-full lg:w-auto">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                <Filter className="h-4 w-4" />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="w-full bg-black/20 border border-white/5 rounded-2xl py-3 pl-10 pr-8 text-sm text-zinc-300 appearance-none focus:outline-none focus:border-white/10 cursor-pointer hover:bg-black/30 transition-colors"
              >
                <option value="">Semua Status</option>
                <option value="belum dibaca">Belum Dibaca</option>
                <option value="diproses">Diproses</option>
                <option value="selesai">Selesai</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-1.5 h-1.5 border-r border-b border-zinc-500 rotate-45 transform -translate-y-1"></div>
              </div>
            </div>

            {/* Reset Button */}
            {(filterStatus || searchInput) && (
              <button
                onClick={() => {
                  setFilterStatus('');
                  clearSearch();
                }}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-2xl text-sm font-medium transition-colors border border-white/5"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* 4. Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {disposisiList.length === 0 ? (
            <div className="col-span-full py-20 text-center text-zinc-500 bg-zinc-900/30 rounded-3xl border border-white/5 border-dashed">
              <div className="flex flex-col items-center justify-center opacity-50">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8" />
                </div>
                <p>Tidak ada data disposisi ditemukan</p>
              </div>
            </div>
          ) : (
            disposisiList.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col justify-between bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl p-6 hover:bg-zinc-900/50 hover:border-white/10 transition-all duration-300"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                          {item.nomor_surat || 'No Reg'}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                        <span className="text-[10px] text-zinc-500">
                          {item.tanggal_surat}
                        </span>
                      </div>
                      <h3 className="text-xl font-medium text-white group-hover:text-indigo-200 transition-colors line-clamp-2">
                        {item.perihal || 'Tanpa Perihal'}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Building2 className="w-3.5 h-3.5" />
                        {item.asal_instansi || '-'}
                      </div>
                    </div>
                    <SifatBadge sifat={item.sifat} />
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                      <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Agenda</p>
                      <p className="text-sm text-white font-mono">{item.nomor_agenda || '-'}</p>
                    </div>
                    <div className="bg-black/20 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                      <p className="text-[10px] text-zinc-500 uppercase font-bold">Status</p>
                      <StatusBadge status={item.status_dari_bawahan} />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {/* Decorative avatars placeholders if needed, or just standard text */}
                    <div className="h-8 w-8 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-[10px] text-zinc-500">
                      <UserCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewDetail(item.id)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-xl text-sm font-bold transition-all shadow-lg shadow-white/5"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Detail</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 5. Pagination */}
        {disposisiList.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-white/5 text-zinc-500 text-sm">
            <div>
              Menampilkan <span className="text-white font-medium">{pagination.offset + 1}</span> - <span className="text-white font-medium">{Math.min(pagination.offset + pagination.limit, pagination.total)}</span> dari {pagination.total} data
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(0, pagination.offset - pagination.limit))}
                disabled={pagination.offset === 0}
                className="p-2.5 rounded-xl border border-white/5 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="px-4 py-2 rounded-xl bg-zinc-900 border border-white/5 text-xs font-bold uppercase tracking-wider text-zinc-300">
                Halaman {Math.floor(pagination.offset / pagination.limit) + 1}
              </div>

              <button
                onClick={() => handlePageChange(pagination.offset + pagination.limit)}
                disabled={pagination.offset + pagination.limit >= pagination.total}
                className="p-2.5 rounded-xl border border-white/5 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default StaffDashboard;