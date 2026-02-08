import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Shield,
  User,
  X,
  Plus,
  Check,
  Loader2,
  CheckCircle2,
  Pencil, 
  ListFilter,
  UserPlus,
  Briefcase,
  LayoutGrid,
  ChevronRight
} from 'lucide-react';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';
// Import Three.js dependencies
import { Canvas } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';

function AdminTambahUser() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  
  // State untuk menangani mode input custom
  const [isCustomBidang, setIsCustomBidang] = useState(false);
  const [isCustomJabatan, setIsCustomJabatan] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    jabatan: '',
    role: '',
    bidang: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openModal = (role) => {
    setSelectedRole(role);
    setForm({
      name: '',
      email: '',
      password: '',
      jabatan: '',
      role: role,
      bidang: ''
    });
    setIsCustomBidang(false);
    setIsCustomJabatan(false);
    setShowModal(true);
    setSuccess(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRole(null);
    setForm({
      name: '',
      email: '',
      password: '',
      jabatan: '',
      role: '',
      bidang: ''
    });
    setSuccess(false);
    setIsCustomBidang(false);
    setIsCustomJabatan(false);
  };

  const toggleCustomBidang = () => {
    setIsCustomBidang(!isCustomBidang);
    setForm(prev => ({ ...prev, bidang: '' }));
  };

  const toggleCustomJabatan = () => {
    setIsCustomJabatan(!isCustomJabatan);
    setForm(prev => ({ ...prev, jabatan: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const response = await api.post('/users', form);

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        toast.success('Akun berhasil dibuat!');

        setTimeout(() => {
          closeModal();
          navigate('/admin-daftar-user');
        }, 1500);
      } else {
        throw new Error('Unexpected response status: ' + response.status);
      }
    } catch (err) {
      console.error('Error creating user:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Gagal membuat user';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getRoleOptions = () => {
    // Data dummy disederhanakan untuk UI
    switch (selectedRole) {
      case 'kepala': return { bidang: ['Pimpinan'], jabatan: ['Kepala Bepelitbangda'] };
      case 'sekretaris': return { bidang: ['Sekretariat'], jabatan: ['Sekretaris'] };
      case 'user': return {
          bidang: ['Sekretariat', 'Pendanaan, Pengendalian, dan Evaluasi', 'Pemerintahan dan Pengembangan Manusia', 'Perekonomian, Infrastruktur, dan Kewilayahan', 'Penelitian dan Pengembangan'],
          jabatan: ['Kasubag Umum', 'Kasubag Keuangan', 'Kabid PPE', 'Kabid PPM', 'Kabid PIK', 'Kabid Litbang']
        };
      case 'staff': return {
          bidang: ['Sekretariat', 'Pendanaan, Pengendalian, dan Evaluasi', 'Pemerintahan dan Pengembangan Manusia', 'Perekonomian, Infrastruktur, dan Kewilayahan', 'Penelitian dan Pengembangan'],
          jabatan: []
        };
      default: return { bidang: [], jabatan: [] };
    }
  };

  const roleOptions = getRoleOptions();

  return (
    <div className="min-h-screen text-white font-sans selection:bg-white/20 pb-20">
      <div className="max-w-6xl w-full mx-auto px-6 pt-12">

        {/* Header Section */}
        <div className="mb-12 space-y-3">
          <div className='flex gap-1 items-center'>

          <div className="p-2 bg-white/5 w-fit rounded-lg border border-white/5 backdrop-blur-sm">
              <UserPlus className="w-5 h-5 text-zinc-400" />
            </div>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
              Tambahkan anggota baru
            </p>
          </div>
            <h1 className="text-4xl font-light tracking-tight text-white mb-2">
                Registrasi <span className="font-semibold text-zinc-400">Pengguna Baru</span>
            </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Action Card */}
          <div className="lg:col-span-2">
             <div className="group relative bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-[32px] p-8 hover:border-white/10 transition-all duration-500 overflow-hidden h-full flex flex-col justify-between">
                
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none group-hover:bg-white/10 transition-colors duration-500"></div>

                <div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-4 bg-zinc-800 rounded-2xl border border-white/5 shadow-inner">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold text-white">Buat Akun Staff</h3>
                            <p className="text-zinc-500 text-sm">Akses standar operasional</p>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-start gap-3 p-4 bg-black/20 rounded-2xl border border-white/5">
                            <Briefcase className="w-5 h-5 text-zinc-400 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-white">Fleksibilitas Jabatan</p>
                                <p className="text-xs text-zinc-500 mt-1">Dapat ditempatkan di semua bidang dengan input jabatan manual.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-black/20 rounded-2xl border border-white/5">
                             <LayoutGrid className="w-5 h-5 text-zinc-400 mt-0.5" />
                             <div>
                                <p className="text-sm font-medium text-white">Akses Modul</p>
                                <p className="text-xs text-zinc-500 mt-1">Disposisi masuk, arsip surat, dan dashboard personal.</p>
                             </div>
                        </div>
                    </div>
                </div>

                <button
                  onClick={() => openModal('staff')}
                  className="w-full group/btn relative flex items-center justify-center gap-3 py-4 px-6 bg-white text-black rounded-2xl font-bold transition-all hover:bg-zinc-200 hover:scale-[1.01] active:scale-[0.99] shadow-xl shadow-white/5"
                >
                  <Plus className="w-5 h-5" />
                  <span>Mulai Registrasi</span>
                  <ChevronRight className="w-4 h-4 opacity-0 -ml-2 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all" />
                </button>
             </div>
          </div>

          {/* Right Column: ThreeJS Sparkles Illustration */}
          <div className="lg:col-span-1 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 lg:hidden"></div>
            <div className="relative w-full h-full min-h-[300px] bg-zinc-900/30 border border-white/5 rounded-[32px] overflow-hidden group">
                {/* Static Background Radial Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/30 via-black to-black pointer-events-none"></div>
                
                {/* 3D Canvas */}
                <div className="absolute inset-0 z-0">
                    <Canvas camera={{ position: [0, 0, 1] }}>
                        <Sparkles 
                            count={150} 
                            scale={1.8} 
                            size={3} 
                            speed={0.4} 
                            opacity={0.6} 
                            color="#ffffff"
                        />
                    </Canvas>
                </div>
                
                {/* Optional: Subtle Overlay text or simple empty decorative element */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="w-32 h-32 bg-white/5 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                </div>
            </div>
          </div>

        </div>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
             {/* Backdrop */}
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300" onClick={closeModal} />
            
            <div className="relative bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl shadow-black/50 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-zinc-900/50">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-zinc-800 rounded-xl border border-white/5 text-white">
                     <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      Registrasi {selectedRole === 'staff' ? 'Staff' : 'User'}
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">
                        Create New Account
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="p-8 overflow-y-auto custom-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Success Banner */}
                  {success && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">Akun berhasil dibuat! Mengalihkan...</span>
                    </div>
                  )}

                  {/* Account Info Group */}
                  <div className="space-y-4">
                      <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest border-b border-white/5 pb-2 mb-4">Informasi Akun</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                            <input
                                name="name"
                                type="text"
                                placeholder="Cth: Ahmad Fulan"
                                value={form.name}
                                onChange={handleChange}
                                required
                                disabled={loading || success}
                                className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-white placeholder-zinc-600 transition-all text-sm"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Email</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="email@instansi.go.id"
                                value={form.email}
                                onChange={handleChange}
                                required
                                disabled={loading || success}
                                className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-white placeholder-zinc-600 transition-all text-sm"
                            />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Password</label>
                         <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                            disabled={loading || success}
                            className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-white placeholder-zinc-600 transition-all text-sm"
                        />
                      </div>
                  </div>

                  {/* Position Info Group */}
                  <div className="space-y-4 pt-2">
                      <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest border-b border-white/5 pb-2 mb-4">Posisi & Jabatan</p>
                      
                      <div className="grid grid-cols-1 gap-5">
                        
                        {/* BIDANG INPUT */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Bidang / Divisi</label>
                                <button type="button" onClick={toggleCustomBidang} className="text-[10px] flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors py-1 px-2 rounded-lg hover:bg-white/5">
                                    {isCustomBidang ? <><ListFilter className="w-3 h-3" /> Pilih List</> : <><Pencil className="w-3 h-3" /> Input Manual</>}
                                </button>
                            </div>
                            
                            {isCustomBidang ? (
                                <input
                                    name="bidang"
                                    type="text"
                                    placeholder="Nama bidang kustom..."
                                    value={form.bidang}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-white placeholder-zinc-600 transition-all text-sm"
                                />
                            ) : (
                                <div className="relative">
                                    <select
                                        name="bidang"
                                        value={form.bidang}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-white appearance-none cursor-pointer text-sm"
                                    >
                                        <option value="">Pilih Bidang...</option>
                                        {roleOptions.bidang.map((b) => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <div className="w-1.5 h-1.5 border-r border-b border-zinc-500 rotate-45 mb-0.5"></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* JABATAN INPUT */}
                        <div className="space-y-2">
                             <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Jabatan</label>
                                {selectedRole !== 'staff' && (
                                    <button type="button" onClick={toggleCustomJabatan} className="text-[10px] flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors py-1 px-2 rounded-lg hover:bg-white/5">
                                        {isCustomJabatan ? <><ListFilter className="w-3 h-3" /> Pilih List</> : <><Pencil className="w-3 h-3" /> Input Manual</>}
                                    </button>
                                )}
                            </div>

                            {selectedRole === 'staff' || isCustomJabatan ? (
                                <input
                                    name="jabatan"
                                    type="text"
                                    placeholder="Cth: Staff Administrasi Umum"
                                    value={form.jabatan}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-white placeholder-zinc-600 transition-all text-sm"
                                />
                            ) : (
                                <div className="relative">
                                    <select
                                        name="jabatan"
                                        value={form.jabatan}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-white appearance-none cursor-pointer text-sm"
                                    >
                                        <option value="">Pilih Jabatan...</option>
                                        {roleOptions.jabatan.map((j) => <option key={j} value={j}>{j}</option>)}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <div className="w-1.5 h-1.5 border-r border-b border-zinc-500 rotate-45 mb-0.5"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                      </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex gap-4 pt-6 mt-4 border-t border-white/5">
                    <button
                      type="button"
                      onClick={closeModal}
                      disabled={loading}
                      className="flex-1 py-3.5 px-6 bg-transparent text-zinc-400 border border-white/5 rounded-xl font-semibold transition-colors duration-200 hover:bg-white/5 hover:text-white"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={loading || success}
                      className={`flex-1 py-3.5 px-6 rounded-xl font-bold transition-all duration-200 flex items-center justify-center shadow-lg shadow-white/5 ${loading || success
                          ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                          : 'bg-white text-black hover:bg-zinc-200'
                        }`}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Menyimpan...
                        </>
                      ) : success ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Tersimpan
                        </>
                      ) : (
                        'Simpan Akun'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminTambahUser;