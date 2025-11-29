import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  Award,
  BarChart3,
  Crown,
  Trophy,
  Loader2,
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
      
      // Pastikan response data adalah array
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

  const getRankBadge = (index) => {
    if (index === 0) return { icon: Crown, color: 'text-amber-600', bg: 'bg-white border border-amber-200', shadow: 'shadow-md shadow-amber-100' };
    if (index === 1) return { icon: Trophy, color: 'text-slate-600', bg: 'bg-white border border-slate-200', shadow: 'shadow-md shadow-slate-100' };
    if (index === 2) return { icon: Award, color: 'text-orange-600', bg: 'bg-white border border-orange-200', shadow: 'shadow-md shadow-orange-100' };
    return { icon: null, color: 'text-gray-500', bg: 'bg-white border border-gray-100', shadow: 'shadow-sm' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text='Memuat data peringkat...' />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-red-50 mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Gagal Memuat Data</h3>
          <p className="text-sm text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchLeaderboardData}
            className="px-6 py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl w-full"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-lg border border-gray-100 mb-4 transform hover:scale-105 transition-transform duration-300">
            <BarChart3 className="w-10 h-10 text-teal-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Papan Peringkat Kinerja
          </h1>
          <p className="text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Memantau distribusi beban kerja dan aktivitas disposisi surat di seluruh instansi
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 flex space-x-1">
            <button
              onClick={() => setActiveTab('atasan')}
              className={`flex items-center px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'atasan'
                  ? 'bg-black text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              Kepala Bidang
            </button>
            <button
              onClick={() => setActiveTab('bawahan')}
              className={`flex items-center px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'bawahan'
                  ? 'bg-black text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Staff / Bawahan
            </button>
          </div>
        </div>

        {/* Leaderboard Content */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200/60 overflow-hidden">
          {leaderboardData.length === 0 ? (
            <div className="py-24 text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Belum ada data</h3>
              <p className="text-gray-500">Aktivitas disposisi akan muncul di sini</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {leaderboardData.map((item, index) => {
                const fieldName = getFieldName();
                const maxValue = Math.max(...leaderboardData.map(d => d.jumlah_disposisi));
                const progressWidth = maxValue > 0 ? (item.jumlah_disposisi / maxValue) * 100 : 0;
                const rankBadge = getRankBadge(index);
                const IconComponent = rankBadge.icon;

                return (
                  <div
                    key={index}
                    className="p-6 hover:bg-white transition-colors duration-200 group"
                  >
                    <div className="flex items-center gap-6">
                      {/* Rank Indicator */}
                      <div className={`w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center text-lg font-bold transition-transform group-hover:scale-110 ${rankBadge.bg} ${rankBadge.shadow} ${rankBadge.color}`}>
                        {IconComponent ? <IconComponent className="w-6 h-6" /> : index + 1}
                      </div>

                      {/* Main Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-gray-900 text-base mb-1 truncate">
                              {item[fieldName]}
                            </h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              {item.bidang}
                            </span>
                          </div>
                          
                          <div className="mt-2 sm:mt-0 text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              {item.jumlah_disposisi}
                            </div>
                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                              Disposisi
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-teal-400 to-teal-600"
                            style={{ width: `${progressWidth}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Summary Footer */}
        {leaderboardData.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {leaderboardData.reduce((sum, item) => sum + item.jumlah_disposisi, 0)}
              </div>
              <div className="text-sm font-medium text-gray-500">Total Disposisi</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {Math.round(leaderboardData.reduce((sum, item) => sum + item.jumlah_disposisi, 0) / leaderboardData.length)}
              </div>
              <div className="text-sm font-medium text-gray-500">Rata-rata per User</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {leaderboardData.length}
              </div>
              <div className="text-sm font-medium text-gray-500">Total User Aktif</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;