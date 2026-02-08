import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Canvas } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { Mail, Lock, X, Shield, Building2, CheckCircle2, Eye, EyeOff, ArrowRight } from 'lucide-react';
import img from '../assets/img/logobapelit.png';

// --- COMPONENT BACKGROUND 3D ---
const AtmosphericBackground = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas 
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 1.5]} // Optimasi DPI agar tidak terlalu berat saat transisi
        gl={{ antialias: false, alpha: true }} 
      >
        <Suspense fallback={null}>
          <Sparkles 
            count={80}           
            scale={6}             
            size={1.5} 
            speed={0.3}           
            opacity={0.5} 
            color="#9ca3af"       
          />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_95%)] pointer-events-none"></div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function LoginPopup({ onClose }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // STATE
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // ANIMATION STATES
  const [isVisible, setIsVisible] = useState(false);   // Untuk fade-in CSS Container
  const [mount3D, setMount3D] = useState(false);       // Untuk menunda loading 3D Canvas

  // EFFECT: INITIALIZATION SEQUENCE
  useEffect(() => {
    // Langkah 1: Tampilkan Container Hitam (Instant)
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    // Langkah 2: Load 3D Canvas setelah 500ms (Setelah animasi CSS selesai/stabil)
    // Ini adalah KUNCI untuk menghilangkan glitch.
    const timer = setTimeout(() => {
      setMount3D(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // HANDLER: CLOSE SEQUENCE
  const handleClose = () => {
    setIsVisible(false); // Fade out CSS
    setTimeout(onClose, 500); // Tunggu animasi selesai baru unmount dari React Tree
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const loggedInUser = await login(form.email, form.password);
      const roleMap = {
        'admin': '/admin',
        'kepala': '/kepala',
        'sekretaris': '/sekretaris',
        'user': '/kabid',
        'staff': '/staff'
      };

      if (roleMap[loggedInUser.role]) {
        navigate(roleMap[loggedInUser.role]);
      } else {
        setError('Role tidak dikenali');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    // WRAPPER FIXED dengan Z-INDEX TERTINGGI (9999) dan Background HARD COLOR
    // Transition opacity menangani fade-in/fade-out halus
    <div className={`fixed inset-0 z-[9999] w-full h-screen bg-[#050505] text-white font-sans overflow-hidden flex transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* CLOSE BUTTON */}
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 z-[60] group flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-md"
      >
        <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">Close Access</span>
        <X className="w-4 h-4 text-gray-400 group-hover:text-white transition-transform group-hover:rotate-90" />
      </button>

      {/* --- LEFT COLUMN: FORM --- */}
      <div className={`w-full lg:w-[45%] h-full flex flex-col justify-center px-8 sm:px-16 xl:px-24 relative z-20 bg-[#050505] border-r border-white/5 shadow-[20px_0_50px_rgba(0,0,0,0.8)] transition-transform duration-700 delay-100 ${isVisible ? 'translate-x-0' : '-translate-x-10'}`}>
        
        {/* Logo */}
        <div className="absolute top-8 left-8 sm:left-16 xl:left-24 flex items-center gap-3 opacity-80">
          <img src={img} alt="Logo" className="w-8 h-8 object-contain grayscale opacity-80" />
          <div className="h-8 w-[1px] bg-white/10"></div>
          <span className="text-xs tracking-[0.2em] text-gray-500 uppercase font-medium">Internal Portal</span>
        </div>

        {/* Header Text */}
        <div className="mb-12">
          <h2 className="text-5xl lg:text-6xl xl:text-7xl font-normal tracking-tight text-white leading-[0.95] mb-6">
            Welcome <br />
            <span className="bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 bg-clip-text text-transparent">
              Back.
            </span>
          </h2>
          <p className="text-gray-400 text-base font-light leading-relaxed max-w-md">
            Silakan otentikasi identitas Anda untuk mengakses dashboard data perencanaan daerah.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center gap-3 text-red-400 text-sm font-light animate-pulse">
             <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            {error}
          </div>
        )}

        {/* Form */}
        <form className="space-y-6 max-w-md" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
              Email Internal
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-600 group-focus-within:text-white transition-colors duration-500" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="block w-full pl-11 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-gray-200 placeholder-gray-700 focus:outline-none focus:bg-white/[0.07] focus:border-white/20 transition-all duration-300 text-sm font-light tracking-wide"
                placeholder="identity@bapelitbangda.go.id"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
              Security Key
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-600 group-focus-within:text-white transition-colors duration-500" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={form.password}
                onChange={handleChange}
                className="block w-full pl-11 pr-12 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-gray-200 placeholder-gray-700 focus:outline-none focus:bg-white/[0.07] focus:border-white/20 transition-all duration-300 text-sm font-light tracking-wide"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-600 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center px-6 py-4 bg-white text-black font-medium text-sm rounded-xl hover:bg-gray-200 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-black/80 tracking-wide">Authenticating...</span>
                </div>
              ) : (
                <span className="flex items-center gap-3 tracking-wide">
                  Initialize Session
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="absolute bottom-8 left-8 sm:left-16 xl:left-24 text-[10px] text-gray-600 font-mono">
          SYSTEM_ID: BPL-2026 • SECURE_CONNECTION_ESTABLISHED
        </div>
      </div>

      {/* --- RIGHT COLUMN: VISUAL/ART --- */}
      <div className="hidden lg:flex w-[55%] h-full relative bg-[#050505] flex-col justify-end p-16 overflow-hidden">
        
        {/* HANYA RENDER 3D JIKA SUDAH MOUNTED (Setelah 500ms) */}
        {mount3D && (
          <div className="animate-fade-in duration-1000">
             <AtmosphericBackground />
          </div>
        )}

        <div className="absolute top-0 right-24 w-[1px] h-full bg-gradient-to-b from-white/0 via-white/5 to-white/0 z-20"></div>

        <div className="relative z-20 max-w-lg mb-12 pointer-events-none">
          <h3 className="text-3xl font-normal text-white leading-tight mb-6">
            Data-Driven <br />
            <span className="text-gray-500">Governance.</span>
          </h3>
          
          <div className="space-y-5 border-l border-white/10 pl-6">
            <FeatureItem icon={<Shield className="w-4 h-4" />} title="End-to-End Encryption" desc="Protokol keamanan standar AES-256." />
            <FeatureItem icon={<Building2 className="w-4 h-4" />} title="Restricted Access" desc="Hanya dapat diakses melalui akun yang terdaftar." />
            <FeatureItem icon={<CheckCircle2 className="w-4 h-4" />} title="Real-time Logging" desc="Pencatatan aktivitas user secara presisi." />
          </div>
        </div>
      </div>

    </div>
  );
}

function FeatureItem({ icon, title, desc }) {
  return (
    <div className="group">
      <div className="flex items-center gap-3 mb-1">
        <div className="text-gray-500 group-hover:text-white transition-colors duration-300">
          {icon}
        </div>
        <span className="text-sm text-gray-300 font-medium tracking-wide">
          {title}
        </span>
      </div>
      <p className="text-xs text-gray-600 font-light group-hover:text-gray-500 transition-colors">
        {desc}
      </p>
    </div>
  );
}