import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  RefreshCw, 
  Award, 
  Building, 
  LayoutGrid,
  Briefcase,
  ShieldCheck,
  UserCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';
import LoadingSpinner from '../Ui/LoadingSpinner';

// === SUB-COMPONENTS ===

const StatCard = ({ title, count, icon: Icon, subtitle }) => (
  <div className="group relative bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all duration-500 overflow-hidden">
    <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors duration-500 pointer-events-none" />
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

// === MAIN COMPONENT ===

const DaftarUser = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBidang, setFilterBidang] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch users data
  const fetchUsers = async (showLoadingToast = false) => {
    try {
      if (showLoadingToast) {
        setRefreshing(true);
        toast.loading('Sinkronisasi data...');
      }

      const response = await api.get('/users/daftar-user');
      const data = response.data;
      setUsers(data.data || []);

      if (showLoadingToast) {
        toast.dismiss();
        toast.success('Data berhasil diperbarui');
      }

    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(error.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(userData => {
    const matchesSearch = (userData.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (userData.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBidang = !filterBidang || userData.bidang === filterBidang;
    return matchesSearch && matchesBidang;
  });

  const uniqueBidang = [...new Set(users.map(userData => userData.bidang).filter(Boolean))];

  const handleRefresh = () => {
    fetchUsers(true);
  };

  const getUserInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
  };

  // Avatar Logic: Darker, desaturated background for dark mode elegance
  const getAvatarColor = (name) => {
    if (!name) return { bg: 'hsl(0, 0%, 20%)', text: '#fff' };
    const hue = (name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * 137.509) % 360;
    return {
        bg: `hsl(${hue}, 20%, 20%)`, // Dark pastel
        text: `hsl(${hue}, 80%, 90%)` // Light text
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white font-sans selection:bg-white/20 pb-20">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg border border-white/5 backdrop-blur-sm">
              <Users className="w-5 h-5 text-zinc-400" />
            </div>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
              Directory
            </p>
          </div>
          <h1 className="text-3xl font-light tracking-tight text-white">
            Daftar <span className="font-semibold text-zinc-400">Pengguna</span>
          </h1>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="group flex items-center gap-2 px-5 py-3 bg-zinc-900 border border-zinc-800 rounded-full hover:border-white/20 hover:bg-zinc-800 transition-all duration-300"
        >
          <RefreshCw className={`w-4 h-4 text-zinc-400 group-hover:text-white transition-colors ${refreshing ? 'animate-spin' : ''}`} />
          <span className="text-xs font-bold text-zinc-400 group-hover:text-white uppercase tracking-wider">Refresh</span>
        </button>
      </div>

      {/* 2. Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
            title="Total User" 
            count={users.length} 
            icon={Users} 
            subtitle="Akun terdaftar dalam sistem"
        />
        <StatCard 
            title="Divisi / Bidang" 
            count={uniqueBidang.length} 
            icon={Building} 
            subtitle="Unit kerja aktif"
        />
        <StatCard 
            title="Hasil Filter" 
            count={filteredUsers.length} 
            icon={Filter} 
            subtitle="Data ditampilkan saat ini"
        />
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
            
            {/* Search Input */}
            <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                <input
                    type="text"
                    placeholder="Cari nama atau email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/20 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/10 focus:bg-black/40 transition-all"
                />
            </div>

            {/* Filter Dropdown */}
            <div className="w-full md:w-1/3 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
                    <Filter className="h-4 w-4" />
                </div>
                <select
                    value={filterBidang}
                    onChange={(e) => setFilterBidang(e.target.value)}
                    className="w-full bg-black/20 border border-white/5 rounded-xl py-3 pl-10 pr-10 text-sm text-zinc-300 appearance-none focus:outline-none focus:border-white/10 focus:bg-black/40 transition-all cursor-pointer"
                >
                    <option value="">Semua Bidang</option>
                    {uniqueBidang.map(bidang => (
                        <option key={bidang} value={bidang} className="text-black">{bidang}</option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="w-2 h-2 border-r border-b border-zinc-500 rotate-45 transform -translate-y-1"></div>
                </div>
            </div>
        </div>
      </div>

      {/* 4. User Grid List */}
      {filteredUsers.length === 0 ? (
        <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-20 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                <Search className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-xl font-light text-white mb-2">Tidak ada pengguna ditemukan</h3>
            <p className="text-zinc-500 text-sm">Coba sesuaikan kata kunci pencarian atau filter Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((userData) => {
            const avatarStyle = getAvatarColor(userData.name);
            const isCurrentUser = user && userData.id === user.id;

            return (
              <div 
                key={userData.id} 
                className={`group relative bg-zinc-900/50 backdrop-blur-sm border rounded-3xl p-6 transition-all duration-500 flex flex-col h-full hover:-translate-y-1
                    ${isCurrentUser 
                        ? 'border-indigo-500/30 shadow-[0_0_30px_-10px_rgba(99,102,241,0.2)]' 
                        : 'border-white/5 hover:border-white/10'
                    }`}
              >
                {/* Glow Effect */}
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500 pointer-events-none" />

                <div className="relative z-10 flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div 
                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold shadow-inner border border-white/5"
                            style={{ 
                                backgroundColor: avatarStyle.bg, 
                                color: avatarStyle.text 
                            }}
                        >
                            {getUserInitials(userData.name)}
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-white text-base leading-tight group-hover:text-indigo-200 transition-colors">
                                {userData.name}
                            </h3>
                            <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                                {userData.jabatan || 'No Title'}
                            </p>
                        </div>
                    </div>

                    {/* Current User Badge */}
                    {isCurrentUser && (
                        <div className="p-1.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20" title="Akun Anda">
                            <UserCircle className="w-5 h-5 text-indigo-400" />
                        </div>
                    )}
                </div>
                
                {/* Content */}
                <div className="relative z-10 mt-auto space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-black/20 rounded-xl border border-white/5">
                        <Briefcase className="w-4 h-4 text-zinc-600" />
                        <span className="text-xs text-zinc-400 font-medium">
                            {userData.jabatan || '-'}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-black/20 rounded-xl border border-white/5">
                        <Building className="w-4 h-4 text-zinc-600" />
                        <span className="text-xs text-zinc-400 font-medium">
                            {userData.bidang || 'Tidak ada divisi'}
                        </span>
                    </div>
                </div>

                {/* Footer / Decorative Line */}
                <div className={`mt-4 h-0.5 w-full rounded-full ${isCurrentUser ? 'bg-indigo-500/30' : 'bg-white/5'}`} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DaftarUser;