import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Eye,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  LayoutGrid,
  Filter,
  ArrowUpRight,
  MoreVertical,
  Briefcase,
  Building2,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { api } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { atasanDisposisiService } from '../../services/atasanDisposisiService';
import LoadingSpinner from '../../components/Ui/LoadingSpinner';

// === UI COMPONENTS (Design System Zinc) ===

const StatCard = ({ title, count, icon: Icon, subtitle, trend }) => (
  <div className="group relative bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all duration-500 overflow-hidden">
    <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors duration-500" />
    <div className="relative z-10 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-zinc-800/50 rounded-2xl border border-white/5 text-zinc-400 group-hover:text-white group-hover:bg-zinc-800 transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
            <span className="text-[10px] font-bold px-2 py-1 bg-white/5 rounded-full text-zinc-400 border border-white/5">
                {trend}
            </span>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-semibold text-white tracking-tight mb-1">{count}</h3>
        <p className="text-sm text-zinc-500 font-medium">{title}</p>
        {subtitle && <p className="text-xs text-zinc-600 mt-2">{subtitle}</p>}
      </div>
    </div>
  </div>
);

const Badge = ({ children, color = 'zinc' }) => {
    const styles = {
        zinc: 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50',
        green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        yellow: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        red: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        purple: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
        blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${styles[color] || styles.zinc} uppercase tracking-wide`}>
            {children}
        </span>
    );
};

// === MAIN COMPONENT ===

const SekretarisDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State Management
  const [allDisposisi, setAllDisposisi] = useState([]);
  const [disposisiList, setDisposisiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchInstansi, setSearchInstansi] = useState('');
  const [pagination, setPagination] = useState({ limit: 10, offset: 0, total: 0 });
  const [stats, setStats] = useState({ total: 0, belumDibaca: 0, diproses: 0, selesai: 0 });

  // === LOGIC (Dipertahankan dari kode asli, disederhanakan) ===

  const applyFiltersAndPagination = () => {
    let filteredData = allDisposisi;

    if (filterStatus) {
      filteredData = filteredData.filter(item => item.status_dari_sekretaris === filterStatus);
    }

    if (searchInstansi.trim()) {
      filteredData = filteredData.filter(item =>
        (item.asal_instansi && item.asal_instansi.toLowerCase().includes(searchInstansi.toLowerCase())) ||
        (item.perihal && item.perihal.toLowerCase().includes(searchInstansi.toLowerCase()))
      );
    }

    const startIndex = pagination.offset;
    const endIndex = startIndex + pagination.limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    setDisposisiList(paginatedData);
    setPagination(prev => ({ ...prev, total: filteredData.length }));
  };

  const fetchDisposisi = async () => {
    try {
      setLoading(true);
      const response = await atasanDisposisiService.getAtasanDisposisi();
      if (!response) throw new Error("No response from server");
      
      const result = response.data;
      let allData = Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : []);
      
      setAllDisposisi(allData);

      // Kalkulasi Stats
      setStats({
        total: allData.length,
        belumDibaca: allData.filter(item => item?.status_dari_sekretaris === 'belum dibaca').length,
        diproses: allData.filter(item => ['diproses', 'dalam proses'].includes(item?.status_dari_sekretaris)).length,
        selesai: allData.filter(item => item?.status_dari_sekretaris === 'selesai').length
      });

    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data disposisi");
    } finally {
      setLoading(false);
    }
  };

  const viewDetail = async (item) => {
    if (item.status === 'belum dibaca' && item.status_dari_sekretaris === 'belum dibaca') {
      try {
        await api.put(`/disposisi/sekretaris/baca/${item.id}`, {});
        await fetchDisposisi(); 
        navigate(`/sekretaris/disposisi/detail/${item.id}`, {
          state: { disposisi: { ...item, status: 'dibaca', status_dari_sekretaris: 'dibaca' } }
        });
      } catch (error) {
        navigate(`/sekretaris/disposisi/detail/${item.id}`, { state: { disposisi: item } });
      }
    } else {
      navigate(`/sekretaris/disposisi/detail/${item.id}`, { state: { disposisi: item } });
    }
  };

  // Helper untuk Warna Status (Updated Style)
  const getStatusColor = (status) => {
      switch(status) {
          case 'belum dibaca': return 'red';
          case 'dibaca': return 'yellow';
          case 'diproses': return 'blue';
          case 'selesai': return 'green';
          default: return 'zinc';
      }
  };

  const getSifatColor = (sifat) => {
      switch(sifat) {
          case 'Sangat Segera': return 'red';
          case 'Segera': return 'yellow';
          case 'Rahasia': return 'purple';
          default: return 'zinc';
      }
  };

  // Effects
  useEffect(() => { fetchDisposisi(); }, []);
  
  useEffect(() => {
    if (allDisposisi.length > 0 || searchInstansi || filterStatus) {
      applyFiltersAndPagination();
    }
  }, [filterStatus, searchInstansi, pagination.offset, allDisposisi]);


  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

  // === RENDER ===
  return (
    <div className="min-h-screen text-white font-sans selection:bg-white/20 pb-20">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 px-1 pt-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg border border-white/5 backdrop-blur-sm">
              <LayoutGrid className="w-5 h-5 text-zinc-400" />
            </div>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
              Workspace
            </p>
          </div>
          <h1 className="text-3xl font-light tracking-tight text-white">
            Dashboard <span className="font-semibold text-zinc-400">Sekretaris</span>
          </h1>
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center gap-4 bg-zinc-900/50 pr-6 pl-2 py-2 rounded-full border border-white/5">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10 text-zinc-300">
                <User className="w-5 h-5" />
            </div>
            <div>
                <p className="text-sm font-semibold text-white">{user?.name || 'User'}</p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">{user?.jabatan || 'Sekretaris'}</p>
            </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* 2. Stats Grid (Bento Style) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Disposisi"
            count={stats.total}
            icon={FileText}
            subtitle="Semua surat masuk"
          />
          <StatCard
            title="Belum Dibaca"
            count={stats.belumDibaca}
            icon={AlertCircle}
            subtitle="Perlu perhatian"
            trend={stats.belumDibaca > 0 ? "Urgent" : null}
          />
          <StatCard
            title="Sedang Diproses"
            count={stats.diproses}
            icon={Clock}
            subtitle="Dalam pengerjaan"
          />
          <StatCard
            title="Selesai"
            count={stats.selesai}
            icon={CheckCircle2}
            subtitle="Arsip disposisi"
          />
        </div>

        {/* 3. Main Content Area (Split 1:3) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Left Column: Filters & Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-white mb-4">Filter Data</h3>
              
              <div className="space-y-4">
                {/* Search */}
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                  <input
                    type="text"
                    placeholder="Cari perihal / instansi..."
                    value={searchInstansi}
                    onChange={(e) => { setSearchInstansi(e.target.value); setPagination(p => ({...p, offset: 0})); }}
                    className="w-full bg-black/20 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/10 focus:bg-black/40 transition-all"
                  />
                </div>

                {/* Dropdown Filter */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Status Pengerjaan</label>
                  <div className="relative">
                    <select
                      value={filterStatus}
                      onChange={(e) => { setFilterStatus(e.target.value); setPagination(p => ({...p, offset: 0})); }}
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

                {/* Refresh Button */}
                <button
                  onClick={fetchDisposisi}
                  className="w-full mt-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-center gap-2 hover:bg-white hover:text-black hover:border-white transition-all duration-300 shadow-lg cursor-pointer group"
                >
                  <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                  <span className="text-sm font-semibold">Refresh Data</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Table List */}
          <div className="lg:col-span-3">
            <div className="bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden min-h-[500px] flex flex-col">
              
              {/* Table Wrapper */}
              <div className="overflow-x-auto flex-1">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5 bg-black/20">
                      <th className="text-left py-6 px-8 text-[10px] font-bold text-zinc-500 uppercase tracking-widest w-1/3">Detail Surat</th>
                      <th className="text-left py-6 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Asal Instansi</th>
                      <th className="text-left py-6 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Sifat & Status</th>
                      <th className="text-right py-6 px-8 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {disposisiList.length > 0 ? (
                      disposisiList.map((item) => (
                        <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="py-5 px-8">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-zinc-500 font-mono">{item.nomor_surat || 'No. -'}</span>
                                <p className="font-semibold text-zinc-200 text-sm group-hover:text-white transition-colors line-clamp-2">
                                    {item.perihal || 'Tanpa Perihal'}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Calendar className="w-3 h-3 text-zinc-600" />
                                    <span className="text-xs text-zinc-500">{item.tanggal_surat || '-'}</span>
                                </div>
                            </div>
                          </td>
                          <td className="py-5 px-6 align-top">
                            <div className="flex items-start gap-3">
                                <div className="p-1.5 bg-white/5 rounded-lg text-zinc-400 mt-0.5">
                                    <Building2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-300 font-medium">{item.asal_instansi || '-'}</p>
                                    <p className="text-xs text-zinc-600 mt-0.5">Agenda: {item.nomor_agenda || '-'}</p>
                                </div>
                            </div>
                          </td>
                          <td className="py-5 px-6 align-top">
                            <div className="flex flex-col gap-2 items-start">
                                <Badge color={getSifatColor(item.sifat)}>{item.sifat || 'Biasa'}</Badge>
                                <Badge color={getStatusColor(item.status_dari_sekretaris)}>
                                    {item.status_dari_sekretaris || 'Unknown'}
                                </Badge>
                            </div>
                          </td>
                          <td className="py-5 px-8 text-right align-middle">
                            <button
                                onClick={() => viewDetail(item)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-zinc-200 rounded-xl text-xs font-bold transition-all shadow-lg shadow-white/5"
                            >
                                <Eye className="w-3 h-3" />
                                <span>Detail</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-20 text-center text-zinc-500">
                          <div className="flex flex-col items-center justify-center opacity-50">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/5">
                              <FileText className="w-8 h-8" />
                            </div>
                            <p>Tidak ada data disposisi ditemukan</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Bar (Integrated in Table Footer) */}
              {disposisiList.length > 0 && (
                  <div className="border-t border-white/5 p-4 bg-black/20 flex items-center justify-between">
                      <p className="text-xs text-zinc-500">
                          Total <span className="text-white font-semibold">{pagination.total}</span> Data
                      </p>
                      <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setPagination(prev => ({...prev, offset: Math.max(0, prev.offset - prev.limit)}))}
                            disabled={pagination.offset === 0}
                            className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                          >
                              <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="text-xs font-mono text-zinc-400">
                            Page {Math.floor(pagination.offset / pagination.limit) + 1}
                          </span>
                          <button 
                            onClick={() => setPagination(prev => ({...prev, offset: prev.offset + prev.limit}))}
                            disabled={pagination.offset + pagination.limit >= pagination.total}
                            className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                          >
                              <ChevronRight className="w-4 h-4" />
                          </button>
                      </div>
                  </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SekretarisDashboard;