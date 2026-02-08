import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  FileText, 
  BarChart3, 
  LayoutGrid, 
  ChevronRight,
  Activity
} from 'lucide-react';
import DisposisiList from '../../components/Kepala/DisposisiList';
import SuratMasukList from '../../components/Kepala/SuratMasukList';
import KepalaStatistikDisposisi from '../../components/Kepala/KepalaStatistikDisposisi';

const KepalaDashboard = () => {
  const [activeTab, setActiveTab] = useState('surat-masuk');
  const [scrolled, setScrolled] = useState(false);

  // Data Tab dengan styling baru
  const tabs = [
    {
      id: 'surat-masuk',
      label: 'Surat Masuk',
      description: 'Review & Tindak Lanjut',
      icon: Mail,
    },
    {
      id: 'disposisi-saya',
      label: 'Disposisi Saya',
      description: 'Riwayat Instruksi',
      icon: FileText,
    },
    {
      id: 'statistik-disposisi',
      label: 'Statistik',
      description: 'Analisis Performa',
      icon: BarChart3,
    }
  ];

  // Efek scroll untuk navbar glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll reset logic
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="min-h-screen text-white font-sans selection:bg-white/20 pb-20 relative overflow-hidden">
      
      {/* Background Ambient Glow (Penyelarasan Style) */}
      <div className="fixed top-0 left-0 w-full h-96 bg-white/5 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 opacity-50" />

      {/* 1. Header Section */}
      <div className="relative z-10 px-6 pt-8 pb-6 md:pt-12 md:pb-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-700">
              <div className="p-2 bg-white/5 rounded-lg border border-white/5 backdrop-blur-sm">
                <LayoutGrid className="w-5 h-5 text-zinc-400" />
              </div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Executive Dashboard
              </p>
            </div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              Portal <span className="font-semibold text-zinc-400">Kepala Dinas</span>
            </h1>
            <p className="text-sm text-zinc-500 max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              Kelola surat masuk, berikan instruksi disposisi, dan pantau kinerja divisi dalam satu tampilan terpusat.
            </p>
          </div>

          {/* Status Indicator (Optional embellishment) */}
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-zinc-900/50 rounded-full border border-white/5 backdrop-blur-md animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <span className="text-xs font-medium text-zinc-400">System Online</span>
          </div>
        </div>
      </div>

      {/* 2. Tabs Navigation (Normal/Static) */}
      <div className="relative py-2">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="p-1.5 bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-x-auto scrollbar-hide">
            <div className="flex md:grid md:grid-cols-3 gap-2 min-w-max md:min-w-0">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      relative group flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 outline-none
                      ${isActive 
                        ? 'bg-white text-black shadow-lg shadow-white/5 scale-[1.01]' 
                        : 'hover:bg-white/5 text-zinc-500 hover:text-zinc-200'
                      }
                    `}
                  >
                    {/* Icon Box */}
                    <div className={`
                      p-2 rounded-lg transition-colors duration-300
                      ${isActive ? 'bg-zinc-100 text-black' : 'bg-white/5 text-zinc-400 group-hover:bg-white/10 group-hover:text-white'}
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Text Content */}
                    <div className="text-left">
                      <p className={`text-sm font-bold tracking-tight transition-colors ${isActive ? 'text-black' : 'text-zinc-300 group-hover:text-white'}`}>
                        {tab.label}
                      </p>
                      <p className={`text-[10px] uppercase tracking-wider font-medium mt-0.5 ${isActive ? 'text-zinc-500' : 'text-zinc-600'}`}>
                        {tab.description}
                      </p>
                    </div>

                    {/* Active Indicator Arrow (Desktop) */}
                    {isActive && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:block opacity-0 animate-in fade-in slide-in-from-left-2 duration-300 fill-mode-forwards">
                        <ChevronRight className="w-4 h-4 text-zinc-400" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-8">
        <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-1 md:p-6 backdrop-blur-sm min-h-[500px] animate-in fade-in zoom-in-95 duration-500">
          
          {/* Content Header per Tab */}
          <div className="flex items-center gap-3 mb-6 px-4 pt-4 md:px-0 md:pt-0">
             <div className="h-8 w-1 bg-white/20 rounded-full" />
             <h2 className="text-lg font-light text-white">
               Tampilan <strong className="font-semibold">{tabs.find(t => t.id === activeTab).label}</strong>
             </h2>
          </div>

          {/* Dynamic Component Rendering */}
          <div className="relative">
             {activeTab === 'surat-masuk' && (
               <div className="">
                 <SuratMasukList />
               </div>
             )}
             
             {activeTab === 'disposisi-saya' && (
               <div className="">
                 <DisposisiList />
               </div>
             )}
             
             {activeTab === 'statistik-disposisi' && (
               <div className="">
                 <KepalaStatistikDisposisi />
               </div>
             )}
          </div>

        </div>
      </div>

      {/* Footer / Copyright area subtle */}
      <div className="mt-12 text-center">
         <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
           Sistem Informasi Manajemen Surat & Disposisi
         </p>
      </div>

    </div>
  );
};

export default KepalaDashboard;