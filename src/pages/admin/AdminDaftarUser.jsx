import { useEffect, useState } from 'react';
import {
  Trash2,
  Key,
  Users,
  Search,
  AlertTriangle,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
  MoreVertical,
  ShieldCheck,
  Briefcase,
  LayoutGrid,
  ArrowUpRight
} from 'lucide-react';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/Ui/LoadingSpinner';

// === UI COMPONENTS (Sesuai Design System Baru) ===

// 1. Reusable Stat Card (Gaya "Secondary Cards" dari referensi)
const StatCard = ({ title, count, icon: Icon, subtitle }) => (
  <div className="group relative bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all duration-500 overflow-hidden">
    {/* Background Glow Effect */}
    <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors duration-500" />

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

// 2. Styled Modal
const Modal = ({ isOpen, onClose, children, maxWidth = 'max-w-md' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      <div className={`relative bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl shadow-black/50 ${maxWidth} w-full transform transition-all animate-in zoom-in-95 duration-200 overflow-hidden`}>
        {children}
      </div>
    </div>
  );
};

// === ACTION MODALS ===

const DeleteModal = ({ isOpen, onClose, onConfirm, userName }) => (
  <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
    <div className="p-8 text-center">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>

      <h3 className="text-2xl font-light text-white mb-2">Hapus Pengguna?</h3>
      <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
        Anda akan menghapus user <strong className="text-white font-semibold">{userName}</strong>.
        Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
      </p>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-2xl font-medium transition-colors border border-white/5"
        >
          Batal
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-3 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold transition-all shadow-lg shadow-white/5"
        >
          Ya, Hapus
        </button>
      </div>
    </div>
  </Modal>
);

const ResetPasswordModal = ({ isOpen, onClose, onConfirm, userName }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validatePasswords = () => {
    const newErrors = {};
    if (!password) newErrors.password = 'Password wajib diisi';
    else if (password.length < 6) newErrors.password = 'Minimal 6 karakter';
    if (!confirmPassword) newErrors.confirmPassword = 'Konfirmasi wajib diisi';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Password tidak cocok';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validatePasswords()) {
      onConfirm(password);
      handleClose();
    }
  };

  const handleClose = () => {
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="max-w-md">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-light text-white">Reset Password</h3>
            <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">Security Action</p>
          </div>
          <div className="p-2 bg-white/5 rounded-xl border border-white/5">
            <Key className="h-5 w-5 text-zinc-400" />
          </div>
        </div>

        <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5 mb-6 flex items-start gap-3">
          <div className="p-1 bg-indigo-500/10 rounded-full mt-0.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-sm text-zinc-400">
            Mengubah password untuk akun <span className="text-white font-semibold">{userName}</span>.
          </p>
        </div>

        <div className="space-y-5 mb-8">
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Password Baru</label>
            <div className="relative group">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 bg-zinc-900 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-xl focus:outline-none focus:border-white/30 text-white placeholder-zinc-600 transition-all`}
                placeholder="Minimal 6 karakter"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Konfirmasi Password</label>
            <div className="relative group">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-3 bg-zinc-900 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/10'} rounded-xl focus:outline-none focus:border-white/30 text-white placeholder-zinc-600 transition-all`}
                placeholder="Ulangi password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-3 bg-transparent hover:bg-zinc-900 text-zinc-500 hover:text-white rounded-2xl font-semibold transition-colors border border-transparent hover:border-white/5"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold transition-all shadow-xl shadow-white/5"
          >
            Simpan
          </button>
        </div>
      </div>
    </Modal>
  );
};

// === MAIN PAGE COMPONENT ===

function AdminDaftarUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBidang, setSelectedBidang] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });
  const [resetPasswordModal, setResetPasswordModal] = useState({ isOpen: false, user: null });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/admin/daftar-user');
      setUsers(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
      toast.error('Gagal memuat data pengguna');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/users/${deleteModal.user.id}`);
      setUsers(users.filter(user => user.id !== deleteModal.user.id));
      toast.success('User berhasil dihapus');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Gagal menghapus user');
    }
    setDeleteModal({ isOpen: false, user: null });
  };

  const handleResetPasswordConfirm = async (newPassword) => {
    try {
      await api.put(`/users/${resetPasswordModal.user.id}`, { newPassword });
      toast.success('Password berhasil direset');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Gagal mereset password');
    }
    setResetPasswordModal({ isOpen: false, user: null });
  };

  const bidangOptions = [...new Set(users.map(user => user.bidang).filter(bidang => bidang))].sort();

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.jabatan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBidang = selectedBidang === '' || user.bidang === selectedBidang;
    return matchesSearch && matchesBidang;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
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
              system access control
            </p>
          </div>
          <h1 className="text-3xl font-light tracking-tight text-white">
            Manajemen <span className="font-semibold text-zinc-400">Pengguna</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-900/50 px-4 py-2 rounded-full border border-white/5">
          <LayoutGrid className="w-3 h-3" />
          <span>Total: {users.length} Akun</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* 2. Stats Grid (Bento Style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Administrator"
            count={users.filter(u => u.role === 'admin').length}
            icon={ShieldCheck}
            subtitle="Full Access Control"
          />
          <StatCard
            title="Kepala Bidang"
            count={users.filter(u => u.role === 'user').length} // Asumsi 'user' adalah kabid sesuai kode lama
            icon={Briefcase}
            subtitle="Department Leads"
          />
          <StatCard
            title="Staff / Pegawai"
            count={users.filter(u => u.role === 'staff').length}
            icon={Users}
            subtitle="Operational Team"
          />
        </div>

        {/* 3. Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Left Column: Filters & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search Card */}
            <div className="bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Filter Data</h3>
              <div className="space-y-4">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                  <input
                    type="text"
                    placeholder="Cari user..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/20 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/10 focus:bg-black/40 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Bidang / Divisi</label>
                  <div className="relative">
                    <select
                      value={selectedBidang}
                      onChange={(e) => setSelectedBidang(e.target.value)}
                      className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-sm text-zinc-300 appearance-none focus:outline-none focus:border-white/10 cursor-pointer"
                    >
                      <option value="">Semua Bidang</option>
                      {bidangOptions.map(bidang => <option key={bidang} value={bidang}>{bidang}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <div className="w-2 h-2 border-r border-b border-zinc-500 rotate-45 transform -translate-y-1"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Refresh Button / Action */}
            <button
              onClick={fetchUsers}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center hover:bg-white hover:border-white transition-all duration-300 shadow-lg cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center mb-3 group-hover:bg-black group-hover:text-white transition-colors">
                <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
              </div>
              <span className="text-sm font-semibold text-zinc-300 group-hover:text-black">Refresh Data</span>
            </button>
          </div>

          {/* Right Column: Table */}
          <div className="lg:col-span-3">
            <div className="bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden min-h-[500px]">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5 bg-black/20">
                      <th className="text-left py-6 px-8 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Profile Info</th>
                      <th className="text-left py-6 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Jabatan</th>
                      <th className="text-left py-6 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Divisi</th>
                      <th className="text-right py-6 px-8 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Menu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="py-5 px-8">
                            <div className="flex items-center gap-4">
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-inner border border-white/5"
                                style={{ backgroundColor: `hsl(${(user.name.length * 50) % 360}, 20%, 20%)` }} // Warna lebih desaturated agar elegan
                              >
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-zinc-200 text-sm group-hover:text-white transition-colors">{user.name}</p>
                                <p className="text-xs text-zinc-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-5 px-6">
                            <span className="text-sm text-zinc-400 font-medium">{user.jabatan}</span>
                          </td>
                          <td className="py-5 px-6">
                            {user.bidang ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-zinc-400">
                                {user.bidang}
                              </span>
                            ) : (
                              <span className="text-zinc-700 text-xs">-</span>
                            )}
                          </td>
                          <td className="py-5 px-8 text-right relative">
                            <button
                              onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                              className={`p-2 rounded-xl transition-all duration-300 ${activeDropdown === user.id ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white hover:bg-white/10'}`}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>

                            {/* Dropdown Menu - Floating Style */}
                            {activeDropdown === user.id && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)}></div>
                                <div className="absolute right-8 top-12 w-48 bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black/50">
                                  <div className="p-1">
                                    <button
                                      onClick={() => { setResetPasswordModal({ isOpen: true, user }); setActiveDropdown(null); }}
                                      className="w-full text-left px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-white/5 hover:text-white rounded-xl flex items-center gap-2 transition-colors mb-1"
                                    >
                                      <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400">
                                        <Key className="h-3 w-3" />
                                      </div>
                                      Reset Password
                                    </button>
                                    <button
                                      onClick={() => { setDeleteModal({ isOpen: true, user }); setActiveDropdown(null); }}
                                      className="w-full text-left px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl flex items-center gap-2 transition-colors"
                                    >
                                      <div className="p-1.5 bg-red-500/10 rounded-lg text-red-500">
                                        <Trash2 className="h-3 w-3" />
                                      </div>
                                      Hapus User
                                    </button>
                                  </div>
                                </div>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-20 text-center text-zinc-500">
                          <div className="flex flex-col items-center justify-center opacity-50">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                              <Users className="w-8 h-8" />
                            </div>
                            <p>Tidak ada pengguna ditemukan</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Render Modals */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        onConfirm={handleDeleteConfirm}
        userName={deleteModal.user?.name || ''}
      />

      <ResetPasswordModal
        isOpen={resetPasswordModal.isOpen}
        onClose={() => setResetPasswordModal({ isOpen: false, user: null })}
        onConfirm={handleResetPasswordConfirm}
        userName={resetPasswordModal.user?.name || ''}
      />
    </div>
  );
}

export default AdminDaftarUser;