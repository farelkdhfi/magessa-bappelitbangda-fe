import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  LogOut,
  Menu,
  X,
  Users,
  BookPlus,
  LetterText,
  Star,
  TimerIcon,
  BookOpen,
  Camera,
  UserPlus2,
  User2,
  Search,
  ChevronRight
} from 'lucide-react';
import img from '../../assets/img/logobapelit.png';

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Surat Masuk', href: '/admin-surat-masuk', icon: BookPlus },
    { name: 'Surat Keluar', href: '/admin-surat-keluar', icon: LetterText },
    { name: 'Jadwal Acara', href: '/admin-jadwal-acara', icon: TimerIcon },
    { name: 'Buku Tamu', href: '/admin-buku-tamu', icon: BookOpen },
    { name: 'Dokumentasi', href: '/admin-dokumentasi', icon: Camera },
    { name: 'Papan Disposisi', href: '/admin/leaderboard', icon: Star },
    { name: 'Daftar User', href: '/admin-daftar-user', icon: Users },
    { name: 'Buat Akun', href: '/admin-buat-akun', icon: UserPlus2 },
  ];

  const isActive = (path) => location.pathname === path;

  // --- REUSABLE COMPONENTS ---
  
  const BrandLogo = ({ className = "" }) => (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Style disamakan dengan Badge di Landing Page */}
         <img src={img} alt="Magessa Logo" className='h-6 object-contain grayscale-100' />
      <div className='flex flex-col'>
        <h1 className='text-lg font-medium bg-linear-to-r from-white to-neutral-400 bg-clip-text tracking-tight text-transparent py-2 leading-none'>
          Magessa
        </h1>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/20 overflow-x-hidden">
      
      {/* --- DESKTOP HEADER --- */}
      <header className='hidden lg:flex fixed inset-x-0 top-0 z-40 h-20 items-center justify-between px-8 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 transition-all duration-300'>
        
        {/* Left: Logo Area */}
        <div className="w-64 flex-shrink-0"> 
          <BrandLogo />
        </div>

        {/* Center: Search Bar (Glass Capsule Style) */}
        <div className="flex-1 max-w-xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-500 group-focus-within:text-white transition-colors duration-300" />
            </div>
            <input
              type="text"
              placeholder='Search data...'
              className='block w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/5 rounded-full text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:bg-white/10 focus:border-white/10 focus:ring-1 focus:ring-white/5 transition-all duration-300' 
            />
          </div>
        </div>

        {/* Right: User Profile */}
        <div className="w-64 flex justify-end">
          <button className='flex items-center gap-3 pl-1 pr-2 py-1 rounded-full hover:bg-white/5 border border-transparent hover:border-white/5 transition-all group'>
            <div className="text-right hidden xl:block mr-1">
              <p className="text-sm font-medium text-white leading-none">Administrator</p>
              <p className="text-[10px] text-gray-500 mt-1">Super User</p>
            </div>
            <div className='w-9 h-9 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:scale-105 transition-transform'>
              <User2 className='w-4 h-4 text-gray-300' />
            </div>
          </button>
        </div>
      </header>


      {/* --- MOBILE OVERLAY & SIDEBAR --- */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        
        <div className={`absolute inset-y-0 left-0 w-72 bg-[#050505] border-r border-white/5 shadow-2xl transform transition-transform duration-500 cubic-bezier(0.22, 1, 0.36, 1) ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between h-20 px-6 border-b border-white/5">
            <BrandLogo />
            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="p-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                  isActive(item.href)
                    ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.15)]' // Style Active: Identik tombol Login Landing Page
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${isActive(item.href) ? 'text-black' : 'text-gray-500 group-hover:text-white'}`} />
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className='absolute bottom-0 w-full p-4 border-t border-white/5'>
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>


      {/* --- MAIN LAYOUT CONTAINER --- */}
      <div className='flex pt-20 min-h-screen'>

        {/* --- DESKTOP SIDEBAR (Collapsible) --- */}
        <aside
          className="hidden lg:flex flex-col z-30 fixed left-0 h-[calc(100vh-80px)] top-20 border-r border-white/5 bg-[#050505]"
          onMouseEnter={() => setSidebarHovered(true)}
          onMouseLeave={() => setSidebarHovered(false)}
          style={{
            width: sidebarHovered ? '260px' : '88px', // Lebar disesuaikan agar proporsional
            transition: 'width 0.5s cubic-bezier(0.22, 1, 0.36, 1)' // Easing function "Mahal"
          }}
        >
          {/* Navigation Items */}
          <div className="flex-1 flex flex-col py-6 overflow-y-auto overflow-x-hidden custom-scrollbar px-4">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <div key={item.name} className="relative group">
                    <Link
                      to={item.href}
                      className={`flex items-center rounded-xl font-medium transition-all duration-300 overflow-hidden relative ${
                        active
                          ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-[1.02]' // Efek Active High Contrast
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                      style={{
                        padding: '12px',
                        height: '48px'
                      }}
                    >
                      {/* Icon Container */}
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                          <item.icon className={`w-5 h-5 transition-colors ${active ? 'text-black' : 'text-gray-500 group-hover:text-white'}`} />
                      </div>

                      {/* Text Label */}
                      <div
                        className="ml-4 whitespace-nowrap overflow-hidden transition-all duration-300"
                        style={{
                          opacity: sidebarHovered ? 1 : 0,
                          transform: sidebarHovered ? 'translateX(0)' : 'translateX(-10px)',
                          width: sidebarHovered ? 'auto' : '0px',
                        }}
                      >
                        {item.name}
                      </div>

                      {/* Active Indicator Arrow (Optional Detail) */}
                      {active && sidebarHovered && (
                        <ChevronRight className="w-4 h-4 ml-auto text-black/50" />
                      )}
                    </Link>

                    {/* Tooltip for Collapsed State */}
                    {!sidebarHovered && (
                      <div className="absolute left-16 top-1/2 -translate-y-1/2 z-50 ml-2 px-3 py-1.5 bg-white text-black text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-[0_0_15px_rgba(255,255,255,0.2)] whitespace-nowrap">
                        {item.name}
                        {/* Little triangle pointer */}
                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-white rotate-45"></div>
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>

          {/* Logout Button (Desktop) */}
          <div className="p-4 border-t border-white/5">
            <button
              onClick={logout}
              className="group flex items-center w-full rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300"
              style={{ padding: '12px' }}
            >
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              </div>
              <div
                 className="ml-4 whitespace-nowrap overflow-hidden transition-all duration-300 font-medium"
                 style={{
                   opacity: sidebarHovered ? 1 : 0,
                   width: sidebarHovered ? 'auto' : '0px',
                 }}
              >
                Sign Out
              </div>
            </button>
          </div>
        </aside>


        {/* --- MOBILE TOP BAR --- */}
        <div className="fixed top-0 inset-x-0 bg-[#050505]/90 backdrop-blur-md z-30 border-b border-white/5 lg:hidden h-16 px-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <BrandLogo />
          <div className="w-8"></div> {/* Spacer */}
        </div>


        {/* --- PAGE CONTENT AREA --- */}
        <main 
          className="flex-1 bg-[#050505] p-4 lg:p-10 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
             marginLeft: typeof window !== 'undefined' && window.innerWidth >= 1024
               ? (sidebarHovered ? '260px' : '88px')
               : '0px'
          }}
        >
          {/* Container dengan fade-in animation */}
          <div className="max-w-7xl mx-auto min-h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}

export default AdminLayout;