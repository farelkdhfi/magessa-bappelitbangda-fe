import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  Award,
  BarChart3,
  Crown,
  Trophy,
  Medal,
  LayoutGrid,
  ArrowUpRight,
  Target,
  Zap
} from 'lucide-react';
import { api } from '../../utils/api';
import LoadingSpinner from '../../components/Ui/LoadingSpinner';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('atasan');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboardData();
  }, [activeTab]);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/disposisi/leaderboard/${activeTab}`);
      const data = Array.isArray(response.data) ? response.data : [];
      setLeaderboardData(data);
    } catch (err) {
      setError('Gagal memuat data leaderboard');
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFieldName = () => {
    return activeTab === 'atasan' ? 'jabatan' : 'name';
  };

  // Helper untuk styling Top 3
  const getRankStyle = (index) => {
    if (index === 0) return { 
        icon: Crown, 
        color: 'text-amber-400', 
        bg: 'bg-amber-400/10 border-amber-400/20', 
        glow: 'shadow-[0_0_30px_-5px_rgba(251,191,36,0.3)]',
        barColor: 'bg-amber-400'
    };
    if (index === 1) return { 
        icon: Trophy, 
        color: 'text-zinc-300', 
        bg: 'bg-zinc-300/10 border-zinc-300/20', 
        glow: 'shadow-[0_0_30px_-5px_rgba(212,212,216,0.2)]',
        barColor: 'bg-zinc-300'
    };
    if (index === 2) return { 
        icon: Medal, 
        color: 'text-orange-400', 
        bg: 'bg-orange-400/10 border-orange-400/20', 
        glow: 'shadow-[0_0_30px_-5px_rgba(251,146,60,0.2)]',
        barColor: 'bg-orange-400'
    };
    return { 
        icon: null, 
        color: 'text-zinc-500', 
        bg: 'bg-zinc-800/50 border-white/5', 
        glow: '',
        barColor: 'bg-zinc-600'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <LoadingSpinner text='Sinkronisasi data...' />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-black">
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-red-500/10 border border-red-500/20 mx-auto mb-6">
            <BarChart3 className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-light text-white mb-2">Gagal Memuat Data</h3>
          <p className="text-sm text-zinc-500 mb-8">{error}</p>
          <button
            onClick={fetchLeaderboardData}
            className="w-full px-6 py-3 bg-white hover:bg-zinc-200 text-black rounded-xl font-bold transition-all shadow-lg shadow-white/5"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Calculate Stats
  const totalDisposisi = leaderboardData.reduce((sum, item) => sum + item.jumlah_disposisi, 0);
  const totalUsers = leaderboardData.length;
  const avgDisposisi = totalUsers > 0 ? Math.round(totalDisposisi / totalUsers) : 0;

  return (
    <div className="min-h-screen text-white font-sans selection:bg-white/20 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="p-4 bg-zinc-900/50 rounded-3xl border border-white/5 mb-6 relative group">
                <div className="absolute inset-0 bg-white/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <Award className="w-10 h-10 text-white relative z-10" />
            </div>
            <h1 className="text-4xl md:text-4xl font-light tracking-tight text-white mb-4">
                Papan <span className="font-semibold text-zinc-400">Peringkat</span>
            </h1>
            <p className="text-zinc-500 max-w-xl mx-auto text-sm leading-relaxed">
                Analisis kinerja dan distribusi beban kerja tim secara real-time.
                Pantau efektivitas disposisi di seluruh divisi.
            </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-zinc-900/80 p-1.5 rounded-2xl border border-white/5 flex gap-1 relative backdrop-blur-md">
            <button
              onClick={() => setActiveTab('atasan')}
              className={`flex items-center px-8 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === 'atasan'
                  ? 'bg-zinc-800 text-white shadow-lg shadow-black/50 border border-white/5'
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <Target className="w-4 h-4 mr-2" />
              Kepala Bidang
            </button>
            <button
              onClick={() => setActiveTab('bawahan')}
              className={`flex items-center px-8 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === 'bawahan'
                  ? 'bg-zinc-800 text-white shadow-lg shadow-black/50 border border-white/5'
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              Staff & Bawahan
            </button>
          </div>
        </div>

        {/* Stats Summary (Bento Grid Style) */}
        {leaderboardData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
             <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-3xl flex items-center justify-between group hover:border-white/10 transition-colors">
                <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Aktivitas</p>
                    <p className="text-3xl font-bold text-white">{totalDisposisi}</p>
                </div>
                <div className="p-3 bg-zinc-800/50 rounded-2xl text-zinc-400 group-hover:text-white transition-colors">
                    <Zap className="w-5 h-5" />
                </div>
             </div>
             
             <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-3xl flex items-center justify-between group hover:border-white/10 transition-colors">
                <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Rata-rata User</p>
                    <p className="text-3xl font-bold text-white">{avgDisposisi}</p>
                </div>
                <div className="p-3 bg-zinc-800/50 rounded-2xl text-zinc-400 group-hover:text-white transition-colors">
                    <TrendingUp className="w-5 h-5" />
                </div>
             </div>

             <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-3xl flex items-center justify-between group hover:border-white/10 transition-colors">
                <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">User Aktif</p>
                    <p className="text-3xl font-bold text-white">{totalUsers}</p>
                </div>
                <div className="p-3 bg-zinc-800/50 rounded-2xl text-zinc-400 group-hover:text-white transition-colors">
                    <Users className="w-5 h-5" />
                </div>
             </div>
          </div>
        )}

        {/* Leaderboard List */}
        <div className="bg-zinc-900/30 backdrop-blur-sm rounded-[32px] border border-white/5 overflow-hidden min-h-[400px]">
          {leaderboardData.length === 0 ? (
            <div className="py-32 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mb-6 border border-white/5">
                <BarChart3 className="w-8 h-8 text-zinc-600" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">Data Kosong</h3>
              <p className="text-zinc-500 text-sm">Belum ada aktivitas disposisi tercatat.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {leaderboardData.map((item, index) => {
                const fieldName = getFieldName();
                const maxValue = Math.max(...leaderboardData.map(d => d.jumlah_disposisi));
                const progressWidth = maxValue > 0 ? (item.jumlah_disposisi / maxValue) * 100 : 0;
                const rankStyle = getRankStyle(index);
                const IconComponent = rankStyle.icon;

                return (
                  <div
                    key={index}
                    className="p-6 hover:bg-white/[0.02] transition-colors duration-300 group relative overflow-hidden"
                  >
                    {/* Subtle Top 3 Gradient Background */}
                    {index < 3 && (
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${rankStyle.barColor} opacity-50`}></div>
                    )}

                    <div className="flex items-center gap-6">
                      {/* Rank Badge */}
                      <div className={`w-14 h-14 flex-shrink-0 rounded-2xl flex items-center justify-center text-lg font-bold transition-all duration-500 group-hover:scale-105 ${rankStyle.bg} ${rankStyle.color} ${rankStyle.glow}`}>
                        {IconComponent ? <IconComponent className="w-6 h-6" /> : <span className="font-mono">{index + 1}</span>}
                      </div>

                      {/* Main Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-3">
                          <div>
                            <h3 className={`font-semibold text-lg mb-1 truncate ${index < 3 ? 'text-white' : 'text-zinc-300'}`}>
                              {item[fieldName]}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                    {item.bidang}
                                </span>
                            </div>
                          </div>
                          
                          <div className="mt-2 sm:mt-0 text-right">
                            <div className={`text-2xl font-bold tracking-tight ${index < 3 ? 'text-white' : 'text-zinc-400'}`}>
                              {item.jumlah_disposisi}
                            </div>
                            <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                              Disposisi
                            </div>
                          </div>
                        </div>

                        {/* Custom Progress Bar */}
                        <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${rankStyle.barColor}`}
                            style={{ width: `${progressWidth}%`, opacity: index < 3 ? 1 : 0.4 }}
                          />
                        </div>
                      </div>
                      
                      {/* Action Arrow (Visual Only) */}
                      <div className="hidden sm:flex text-zinc-700 group-hover:text-white transition-colors duration-300">
                           <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;