import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, ArrowLeft, LogIn, Lock } from 'lucide-react';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // --- LOGIC (Tidak Dirubah) ---
  const handleGoBack = () => {
    // Redirect berdasarkan role user
    if (user?.role === 'admin') {
      navigate('/admin');
    } else if (user?.role === 'kepala') {
      navigate('/kepala');
    } else if (user?.role === 'sekretaris') {
      navigate('/sekretaris');
    } else if (user?.role === 'staff') {
      navigate('/staff');
    } else if (user?.role === 'user') {
      navigate('/kabid');
    } else {
      navigate('/');
    }
  };
  // ---------------------------

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-red-500/30">
      
      {/* Ambient Background Glow (Red Warning Tone) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      {/* Main Card */}
      <div className="relative w-full max-w-md z-10">
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center shadow-2xl shadow-black/50 animate-in zoom-in-95 duration-500">
          
          {/* Icon Section */}
          <div className="relative mb-8">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-500/5 border border-red-500/20 shadow-[0_0_40px_-10px_rgba(239,68,68,0.3)] group">
              <Shield className="h-10 w-10 text-red-500 transition-transform duration-500 group-hover:scale-110" strokeWidth={1.5} />
              
              {/* Floating Lock Icon Decoration */}
              <div className="absolute -bottom-1 -right-1 bg-zinc-900 border border-white/10 p-2 rounded-full shadow-lg">
                <Lock className="h-4 w-4 text-zinc-400" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 mb-10">
            <div>
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                Security Restriction
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              </p>
              <h1 className="text-3xl font-light text-white tracking-tight mb-4">
                Akses <span className="font-semibold text-red-500">Ditolak</span>
              </h1>
              <p className="text-zinc-400 text-sm leading-relaxed px-4">
                Anda tidak memiliki izin (Permission Level) yang cukup untuk mengakses halaman ini. Silakan hubungi administrator sistem.
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoBack}
              className="group w-full bg-white text-black hover:bg-zinc-200 font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-xl shadow-white/5 flex items-center justify-center gap-3"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="uppercase tracking-widest text-xs">Kembali ke Dashboard</span>
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="group w-full bg-transparent hover:bg-white/5 text-zinc-500 hover:text-white font-semibold py-4 px-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <LogIn className="h-4 w-4 group-hover:text-zinc-300 transition-colors" />
              <span className="text-xs uppercase tracking-widest">Login Ulang</span>
            </button>
          </div>

        </div>

        {/* Footer Meta */}
        <div className="mt-6 text-center">
            <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
                Error Code: 403 Forbidden
            </p>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;