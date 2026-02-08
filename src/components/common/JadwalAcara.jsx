import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  X, 
  LayoutGrid,
  ArrowUpRight,
  Map as MapIcon, // Rename icon agar tidak bentrok
  ExternalLink
} from 'lucide-react';
import api from '../../utils/api';

// === SUB-COMPONENTS ===

const StatusBadge = ({ status }) => {
    const styles = {
        aktif: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        selesai: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        dibatalkan: 'bg-red-500/10 text-red-400 border-red-500/20',
        ditunda: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    };

    const labelMap = {
        aktif: 'Aktif',
        selesai: 'Selesai',
        dibatalkan: 'Dibatalkan',
        ditunda: 'Ditunda',
    };

    const className = styles[status] || 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${className}`}>
            {labelMap[status] || status}
        </span>
    );
};

const PriorityBadge = ({ priority }) => {
    const styles = {
        'sangat penting': 'text-red-400 bg-red-500/10 border-red-500/20',
        'penting': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        'biasa': 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20',
    };
    const style = styles[priority] || styles['biasa'];

    return (
        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border border-dashed ${style}`}>
            <div className={`w-1.5 h-1.5 rounded-full bg-current animate-pulse`} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{priority}</span>
        </div>
    );
};

// === MAIN COMPONENT ===

const JadwalAcara = () => {
    const [jadwalList, setJadwalList] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // State filter
    const [filter, setFilter] = useState({
        status: '',
        kategori: '',
        bulan: '',
        tahun: new Date().getFullYear(),
    });

    // State pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 6; 

    const fetchJadwal = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filter.status) params.append('status', filter.status);
            if (filter.kategori) params.append('kategori', filter.kategori);
            if (filter.bulan) params.append('bulan', filter.bulan);
            params.append('tahun', filter.tahun);
            params.append('page', currentPage);
            params.append('limit', limit);

            const response = await api.get(`/jadwal-acara?${params}`);
            setJadwalList(response.data?.data || []);

            const pagination = response.data?.pagination || {};
            setTotalCount(pagination.total || 0);
            setTotalPages(pagination.total ? Math.ceil(pagination.total / limit) : 1);
        } catch (error) {
            console.error('Error fetching data:', error);
            setJadwalList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJadwal();
    }, [filter, currentPage]);

    const resetFilters = () => {
        setFilter({
            status: '',
            kategori: '',
            bulan: '',
            tahun: new Date().getFullYear(),
        });
        setCurrentPage(1);
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        return timeString.split(':').slice(0, 2).join(':');
    };

    return (
        <div className="min-h-screen text-white font-sans selection:bg-white/20 pb-20">
            
            {/* 1. Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/5 rounded-lg border border-white/5 backdrop-blur-sm">
                            <Calendar className="w-5 h-5 text-zinc-400" />
                        </div>
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
                            Company Events
                        </p>
                    </div>
                    <h1 className="text-3xl font-light tracking-tight text-white">
                        Jadwal <span className="font-semibold text-zinc-400">Acara & Kegiatan</span>
                    </h1>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-900/50 px-4 py-2 rounded-full border border-white/5">
                    <LayoutGrid className="w-3 h-3" />
                    <span>Total: {totalCount} Agenda</span>
                </div>
            </div>

            {/* 2. Filter Bar */}
            <div className="bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl p-6 mb-8">
                <div className="flex flex-col lg:flex-row items-end gap-4">
                    
                    {/* Filter Inputs (Same as previous design) */}
                    <div className="w-full lg:w-1/4 space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Status</label>
                        <div className="relative">
                            <select
                                value={filter.status}
                                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-sm text-zinc-300 appearance-none focus:outline-none focus:border-white/10 cursor-pointer"
                            >
                                <option value="">Semua Status</option>
                                <option value="aktif">Aktif</option>
                                <option value="selesai">Selesai</option>
                                <option value="dibatalkan">Dibatalkan</option>
                                <option value="ditunda">Ditunda</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">▼</div>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/4 space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Bulan</label>
                        <div className="relative">
                            <select
                                value={filter.bulan}
                                onChange={(e) => setFilter({ ...filter, bulan: e.target.value })}
                                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-sm text-zinc-300 appearance-none focus:outline-none focus:border-white/10 cursor-pointer"
                            >
                                <option value="">Semua Bulan</option>
                                {[...Array(12)].map((_, i) => (
                                    <option key={i} value={i + 1}>
                                        {new Date(0, i).toLocaleString('id-ID', { month: 'long' })}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">▼</div>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/4 space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Tahun</label>
                        <input
                            type="number"
                            value={filter.tahun}
                            onChange={(e) => setFilter({ ...filter, tahun: parseInt(e.target.value) || '' })}
                            className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-sm text-zinc-300 focus:outline-none focus:border-white/10"
                        />
                    </div>

                    {(filter.status || filter.bulan || filter.tahun !== new Date().getFullYear()) && (
                        <button
                            onClick={resetFilters}
                            className="w-full lg:w-auto px-6 py-3 bg-white/5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 rounded-xl border border-white/5 transition-all flex items-center justify-center gap-2"
                        >
                            <X className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Reset</span>
                        </button>
                    )}
                </div>
            </div>

            {/* 3. Content Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="h-96 bg-zinc-900/50 rounded-3xl border border-white/5 animate-pulse" />
                    ))}
                </div>
            ) : (
                <>
                    {jadwalList.length === 0 ? (
                        <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-20 text-center">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                                <Calendar className="w-10 h-10 text-zinc-600" />
                            </div>
                            <h3 className="text-xl font-light text-white mb-2">Tidak ada jadwal ditemukan</h3>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {jadwalList.map((jadwal) => (
                                <div
                                    key={jadwal.id}
                                    className="group relative bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all duration-500 flex flex-col"
                                >
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex gap-4">
                                            <div className="p-3 h-fit bg-zinc-800/50 rounded-2xl border border-white/5 text-zinc-400 group-hover:text-white transition-colors">
                                                <Calendar className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-white tracking-tight leading-snug mb-1 group-hover:text-indigo-200 transition-colors">
                                                    {jadwal.nama_acara}
                                                </h3>
                                                <StatusBadge status={jadwal.status} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info List */}
                                    <div className="space-y-4 mb-6 flex-1">
                                        <div className="flex items-center gap-3 text-sm text-zinc-400">
                                            <div className="p-1.5 bg-white/5 rounded-lg">
                                                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                                            </div>
                                            <span>{jadwal.tanggal_mulai} • {formatTime(jadwal.waktu_mulai)}</span>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm text-zinc-400">
                                            <div className="p-1.5 bg-white/5 rounded-lg">
                                                <User className="w-3.5 h-3.5 text-zinc-500" />
                                            </div>
                                            <span>{jadwal.pic_nama}</span>
                                        </div>

                                        {jadwal.deskripsi && (
                                            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                                                <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
                                                    {jadwal.deskripsi}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* === MAP SECTION RESTORED & STYLED === */}
                                    {jadwal.lokasi && (
                                        <div className="mt-4 mb-6">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <MapIcon className="w-3 h-3 text-zinc-500" />
                                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Lokasi Acara</span>
                                                </div>
                                                <a 
                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(jadwal.lokasi)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-white transition-colors"
                                                >
                                                    <ExternalLink className="w-3 h-3" />
                                                    Buka Maps
                                                </a>
                                            </div>
                                            
                                            {/* Map Container */}
                                            <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-white/10 group/map">
                                                <iframe
                                                    width="100%"
                                                    height="100%"
                                                    frameBorder="0"
                                                    loading="lazy"
                                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(jadwal.lokasi)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                                    title={`Lokasi ${jadwal.nama_acara}`}
                                                    // Efek: Grayscale saat diam, Warna saat di-hover
                                                    className="w-full h-full grayscale-[0.8] opacity-80 group-hover/map:grayscale-0 group-hover/map:opacity-100 transition-all duration-700 ease-in-out"
                                                />
                                                {/* Overlay Gradient (Optional: adds depth) */}
                                                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]" />
                                            </div>
                                            <p className="mt-2 text-xs text-zinc-400 truncate flex items-center gap-2">
                                                <MapPin className="w-3 h-3 text-indigo-400" />
                                                {jadwal.lokasi}
                                            </p>
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                                        <PriorityBadge priority={jadwal.prioritas} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-10 flex items-center justify-between gap-4 bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-4">
                            <span className="text-xs text-zinc-500 font-medium ml-2">
                                Hal {currentPage} / {totalPages}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => Math.max(prev - 1, 1));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-bold uppercase border border-transparent hover:border-white/5 transition-all"
                                >
                                    Prev
                                </button>
                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-white text-black hover:bg-zinc-200 rounded-xl text-xs font-bold uppercase shadow-lg shadow-white/5 transition-all"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default JadwalAcara;