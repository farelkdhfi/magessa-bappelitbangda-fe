import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCcw, 
  Activity, 
  Eye, 
  Archive, 
  PieChart as PieChartIcon,
  BarChart3
} from 'lucide-react';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../Ui/LoadingSpinner';

// === SUB-COMPONENTS FOR STYLE CONSISTENCY ===

// 1. Stat Box (Bento Style - Reused)
const StatBox = ({ title, count, icon: Icon, colorClass, gradientInfo }) => (
  <div className="relative group overflow-hidden bg-zinc-900/30 border border-white/5 p-5 rounded-2xl hover:bg-white/5 transition-all duration-300">
    {/* Background Glow */}
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 ${gradientInfo}`} />
    
    <div className={`absolute right-2 top-2 p-2 rounded-xl bg-white/5 ${colorClass} group-hover:scale-110 transition-transform z-10`}>
      <Icon className="w-4 h-4" />
    </div>
    
    <div className="mt-4 relative z-10">
      <h3 className="text-2xl font-semibold text-white tracking-tight">{count}</h3>
      <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mt-1">{title}</p>
    </div>
  </div>
);

const KepalaStatistikDisposisi = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStatistik = async () => {
        try {
            setLoading(true);
            const response = await api.get('/disposisi/statistik');
            setStats(response.data.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching statistics:', err);
            setError(err.response?.data?.error || 'Gagal memuat statistik');
            toast.error(err.response?.data?.error || 'Gagal memuat statistik');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatistik();
    }, []);

    // === KONFIGURASI WARNA & TEMA (NEON DARK MODE) ===
    const statusConfig = {
        belum_dibaca: {
            color: '#f43f5e', // Rose-500
            label: 'Belum Dibaca',
            icon: AlertCircle,
            twText: 'text-rose-400',
            twBg: 'bg-rose-500'
        },
        diproses: {
            color: '#f59e0b', // Amber-500
            label: 'Diproses',
            icon: Activity,
            twText: 'text-amber-400',
            twBg: 'bg-amber-500'
        },
        selesai: {
            color: '#10b981', // Emerald-500
            label: 'Selesai',
            icon: CheckCircle2,
            twText: 'text-emerald-400',
            twBg: 'bg-emerald-500'
        },
        sudah_dibaca: {
            color: '#3b82f6', // Blue-500
            label: 'Sudah Dibaca',
            icon: Eye,
            twText: 'text-blue-400',
            twBg: 'bg-blue-500'
        }
    };

    // Custom Tooltip untuk Recharts (Dark Glass Style)
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-zinc-950/90 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-4">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div 
                                className="w-2 h-2 rounded-full" 
                                style={{ backgroundColor: entry.payload.color }} 
                            />
                            <p className="text-sm font-semibold text-white">
                                {entry.value} <span className="text-zinc-500 font-normal">Surat</span>
                            </p>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (loading) return <div className="py-20 flex justify-center"><LoadingSpinner /></div>;

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/30 border border-white/5 rounded-3xl backdrop-blur-sm">
                <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
                <p className="text-white font-medium mb-1">Gagal memuat data</p>
                <p className="text-zinc-500 text-sm mb-6">{error}</p>
                <button
                    onClick={fetchStatistik}
                    className="px-6 py-2 bg-white text-black hover:bg-zinc-200 rounded-full text-sm font-bold transition-colors"
                >
                    Coba Lagi
                </button>
            </div>
        );
    }

    if (!stats) return null;

    // Persiapan Data Chart
    const chartData = Object.entries(stats.statistik_status)
        .filter(([key]) => key !== 'total' && key !== 'diteruskan')
        .map(([key, value]) => ({
            name: statusConfig[key]?.label || key,
            value,
            key,
            color: statusConfig[key]?.color || '#71717a'
        }));

    const pieData = chartData.filter(item => item.value > 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            
            {/* 1. Header & Controls */}
            <div className="flex items-center justify-end">
                <button
                    onClick={fetchStatistik}
                    className="p-2.5 bg-zinc-800/50 border border-white/5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                >
                    <RefreshCcw className="w-4 h-4" /> Refresh Data
                </button>
            </div>

            {/* 2. Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatBox 
                    title="Total Disposisi" 
                    count={stats.statistik_status.total.toLocaleString('id-ID')} 
                    icon={Archive} 
                    colorClass="text-zinc-300" 
                    gradientInfo="bg-white"
                />
                <StatBox 
                    title="Belum Dibaca" 
                    count={stats.statistik_status.belum_dibaca || 0} 
                    icon={AlertCircle} 
                    colorClass="text-rose-400" 
                    gradientInfo="bg-rose-500"
                />
                <StatBox 
                    title="Diproses" 
                    count={stats.statistik_status.diproses || 0} 
                    icon={Activity} 
                    colorClass="text-amber-400" 
                    gradientInfo="bg-amber-500"
                />
                <StatBox 
                    title="Selesai" 
                    count={stats.statistik_status.selesai || 0} 
                    icon={CheckCircle2} 
                    colorClass="text-emerald-400" 
                    gradientInfo="bg-emerald-500"
                />
            </div>

            {/* 3. Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                
                {/* Bar Chart Container */}
                <div className="bg-zinc-900/40 backdrop-blur-md rounded-3xl border border-white/5 p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
                            <BarChart3 className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-white">Distribusi Status</h3>
                            <p className="text-xs text-zinc-500">Volume disposisi berdasarkan kategori</p>
                        </div>
                    </div>
                    
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    {chartData.map((entry, index) => (
                                        <linearGradient key={index} id={`gradient-${entry.key}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                                            <stop offset="100%" stopColor={entry.color} stopOpacity={0.3} />
                                        </linearGradient>
                                    ))}
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis 
                                    dataKey="name" 
                                    tick={{ fontSize: 10, fill: '#71717a' }} 
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />
                                <YAxis 
                                    tick={{ fontSize: 10, fill: '#71717a' }} 
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={`url(#gradient-${entry.key})`} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart Container */}
                <div className="bg-zinc-900/40 backdrop-blur-md rounded-3xl border border-white/5 p-6 shadow-xl flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400 border border-pink-500/20">
                            <PieChartIcon className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-white">Proporsi Data</h3>
                            <p className="text-xs text-zinc-500">Persentase status disposisi</p>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col md:flex-row items-center gap-8">
                        {/* Chart */}
                        <div className="h-[250px] w-full md:w-1/2 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Inner Circle Text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-bold text-white">{stats.statistik_status.total}</span>
                                <span className="text-[10px] uppercase text-zinc-500 tracking-widest">Total</span>
                            </div>
                        </div>

                        {/* Custom Legend / Summary */}
                        <div className="w-full md:w-1/2 space-y-4">
                            {Object.entries(stats.persentase_status)
                                .filter(([key]) => key !== 'total' && key !== 'diteruskan')
                                .map(([key, percentage]) => {
                                    const config = statusConfig[key];
                                    if (!config) return null;
                                    return (
                                        <div key={key} className="group">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${config.twBg}`} />
                                                    <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">{config.label}</span>
                                                </div>
                                                <span className={`text-sm font-bold ${config.twText}`}>{percentage}%</span>
                                            </div>
                                            {/* Progress Bar */}
                                            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${config.twBg} opacity-80`} 
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KepalaStatistikDisposisi;