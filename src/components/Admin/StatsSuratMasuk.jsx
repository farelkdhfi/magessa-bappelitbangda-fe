import { useState, useEffect } from 'react'
import { Mail, Plus, CheckCircle2, TrendingUp, AlertCircle, Calendar, ArrowUpRight, Inbox, BarChart3, PieChart as PieIcon } from 'lucide-react'
import { api } from '../../utils/api'
import toast from 'react-hot-toast'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts'
import { Link } from 'react-router-dom'
import SuratMasukTerbaru from './SuratMasukTerbaru.jsx'

const StatsSuratMasuk = () => {
    const [loading, setLoading] = useState(true)
    const [suratData, setSuratData] = useState([])
    const [error, setError] = useState('')

    // Fetch data dari API
    useEffect(() => {
        fetchAllData()
    }, [])

    const fetchAllData = async () => {
        try {
            setLoading(true)
            setError('')
            const suratResponse = await api.get('/surat-masuk')
            setSuratData(suratResponse.data?.data || [])
        } catch (err) {
            console.error('Error fetching data:', err)
            const errorMessage = err.response?.data?.error || 'Gagal memuat data'
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    // Calculate statistics
    const totalSurat = suratData.length
    const belumDibaca = suratData.filter(surat => surat.status === 'belum dibaca').length
    const sudahDibaca = suratData.filter(surat => surat.status === 'sudah dibaca').length
    const persentaseBaca = totalSurat > 0 ? ((sudahDibaca / totalSurat) * 100).toFixed(1) : 0

    // ELEGANT PALETTE FOR CHARTS
    const pieData = [
        { name: 'Belum Dibaca', value: belumDibaca, color: '#27272a' }, // Zinc-800
        { name: 'Sudah Dibaca', value: sudahDibaca, color: '#ffffff' }  // White
    ]

    // Calculate monthly data for bar chart
    const getMonthlyData = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
        const currentYear = new Date().getFullYear()
        const monthlyCount = {}

        months.forEach((month, index) => {
            monthlyCount[index] = { month: month, total: 0, belumDibaca: 0, sudahDibaca: 0 }
        })

        suratData.forEach(surat => {
            const suratDate = new Date(surat.created_at)
            if (suratDate.getFullYear() === currentYear) {
                const monthIndex = suratDate.getMonth()
                monthlyCount[monthIndex].total++
                if (surat.status === 'belum dibaca') {
                    monthlyCount[monthIndex].belumDibaca++
                } else {
                    monthlyCount[monthIndex].sudahDibaca++
                }
            }
        })
        return Object.values(monthlyCount)
    }

    const monthlyData = getMonthlyData()

    // --- SUB-COMPONENTS ---

    // 1. Kartu Statistik Sekunder (Secondary Cards)
    const StatCard = ({ title, count, icon: Icon, subtitle, trend, trendUp }) => (
        <div className="group relative bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all duration-500 overflow-hidden">
            {/* Background Glow Effect */}
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors duration-500" />
            
            <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-zinc-800/50 rounded-2xl border border-white/5 text-zinc-400 group-hover:text-white group-hover:bg-zinc-800 transition-colors">
                        <Icon className="w-5 h-5" />
                    </div>
                    {trend && (
                        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${trendUp ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                            <TrendingUp className="w-3 h-3" />
                            {trend}%
                        </div>
                    )}
                </div>
                
                <div>
                    <h3 className="text-3xl font-semibold text-white tracking-tight mb-1">{count}</h3>
                    <p className="text-sm text-zinc-500 font-medium">{title}</p>
                    {subtitle && <p className="text-xs text-zinc-600 mt-2">{subtitle}</p>}
                </div>
            </div>
        </div>
    )

    // 2. Loading Skeleton
    const Skeleton = ({ className }) => (
        <div className={`bg-zinc-800/50 animate-pulse rounded-2xl ${className}`} />
    )

    if (loading) {
        return (
            <div className="space-y-8 p-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <Skeleton className="w-48 h-8" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-48" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                    <Skeleton className="lg:col-span-1" />
                    <Skeleton className="lg:col-span-2" />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen text-white font-sans selection:bg-white/20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div className="space-y-1">
                    <h1 className="text-3xl font-light tracking-tight text-white">
                        Dashboard <span className="font-semibold text-zinc-400">Surat Masuk</span>
                    </h1>
                    <p className="text-sm text-zinc-500 font-medium tracking-wide uppercase">Overview & Analytics</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-900/50 px-4 py-2 rounded-full border border-white/5">
                    <Calendar className="w-3 h-3" />
                    <span>Tahun {new Date().getFullYear()}</span>
                </div>
            </div>

            <div className="space-y-6">
                {/* 1. Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* Primary Card - High Contrast (White) */}
                    <div className="md:col-span-2 lg:col-span-1 bg-white text-black rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between group shadow-xl shadow-white/5">
                        <div className="absolute top-0 right-0 p-6 opacity-10 transform translate-x-4 -translate-y-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500">
                            <Inbox className="w-32 h-32" />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="p-3 bg-black/5 rounded-2xl">
                                    <Inbox className="w-6 h-6 text-black" />
                                </div>
                                <span className="px-3 py-1 bg-black text-white text-xs font-bold rounded-full">TOTAL</span>
                            </div>
                            <div>
                                <h3 className="text-6xl font-bold tracking-tighter mb-2">{totalSurat}</h3>
                                <p className="text-sm font-medium text-zinc-600">Total Semua Surat</p>
                            </div>
                        </div>
                        
                        <div className="relative z-10 mt-6 pt-6 border-t border-black/10">
                            <div className="flex items-center justify-between text-xs font-medium text-zinc-500">
                                <span>Update Terakhir</span>
                                <span>Baru saja</span>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Cards */}
                    <StatCard
                        title="Perlu Tindakan"
                        count={belumDibaca}
                        subtitle="Surat belum dibaca"
                        icon={AlertCircle}
                        trend={belumDibaca > 0 ? "5.2" : "0"}
                        trendUp={false} // Merah jika ada tumpukan
                    />

                    <StatCard
                        title="Selesai"
                        count={sudahDibaca}
                        subtitle="Telah diarsipkan"
                        icon={CheckCircle2}
                        trend="12.5"
                        trendUp={true}
                    />

                    <StatCard
                        title="Efektivitas"
                        count={`${persentaseBaca}%`}
                        subtitle="Completion Rate"
                        icon={TrendingUp}
                        trend={parseFloat(persentaseBaca) > 50 ? "8.4" : "2.1"}
                        trendUp={true}
                    />
                </div>

                {/* 2. Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Pie Chart Card */}
                    <div className="bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50 pointer-events-none"/>
                        
                        <div className="w-full flex justify-between items-start mb-4 z-10">
                            <div>
                                <h3 className="text-lg font-semibold text-white">Distribusi Status</h3>
                                <p className="text-xs text-zinc-500">Rasio Baca vs Belum</p>
                            </div>
                            <div className="p-2 bg-white/5 rounded-lg">
                                <PieIcon className="w-4 h-4 text-zinc-400" />
                            </div>
                        </div>

                        <div className="w-full h-[220px] relative z-10">
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
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#333', color: '#fff', borderRadius: '12px', padding: '10px' }}
                                        itemStyle={{ color: '#fff', fontSize: '12px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Text Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-bold text-white">{totalSurat}</span>
                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Surat</span>
                            </div>
                        </div>

                        <div className="flex w-full justify-center gap-6 mt-4 z-10">
                            {pieData.map((entry, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                    <span className="text-xs text-zinc-400 font-medium">{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bar Chart Card */}
                    <div className="lg:col-span-2 bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl p-8 relative">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-semibold text-white">Analitik Bulanan</h3>
                                <p className="text-xs text-zinc-500">Tren surat masuk sepanjang tahun</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-zinc-400">
                                    <div className="w-2 h-2 rounded-full bg-white"></div> Total
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-zinc-400">
                                    <div className="w-2 h-2 rounded-full bg-zinc-700"></div> Pending
                                </div>
                            </div>
                        </div>

                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData} barGap={8}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                    <XAxis 
                                        dataKey="month" 
                                        tick={{ fontSize: 12, fill: '#71717a' }} 
                                        axisLine={false} 
                                        tickLine={false} 
                                        dy={10}
                                    />
                                    <YAxis 
                                        tick={{ fontSize: 12, fill: '#71717a' }} 
                                        axisLine={false} 
                                        tickLine={false} 
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#ffffff', opacity: 0.05 }}
                                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#333', color: '#fff', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                                    />
                                    <Bar dataKey="total" fill="#ffffff" radius={[4, 4, 0, 0]} maxBarSize={30} activeBar={{ fill: '#e4e4e7' }} />
                                    <Bar dataKey="belumDibaca" fill="#3f3f46" radius={[4, 4, 0, 0]} maxBarSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* 3. Action & List Area */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Action Card - Make it look like a button but styled as a card */}
                    <Link to="/admin-surat-masuk" className="lg:col-span-1 group">
                        <div className="h-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-white hover:border-white transition-all duration-300 shadow-lg cursor-pointer group">
                            <div className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:bg-black group-hover:text-white transition-all duration-300">
                                <Plus className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold text-white group-hover:text-black transition-colors">Input Surat Baru</h3>
                            <p className="text-zinc-500 text-sm mt-2 group-hover:text-zinc-600 transition-colors">
                                Tambahkan data surat masuk ke dalam sistem arsip
                            </p>
                            <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-400">
                                <span>Action</span>
                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </div>
                        </div>
                    </Link>

                    {/* Table / List Container */}
                    <div className="lg:col-span-3 bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden p-1">
                        <div className="bg-zinc-950/50 rounded-[20px] overflow-hidden h-full">
                            <SuratMasukTerbaru />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatsSuratMasuk