import React from 'react';
import { TrendingUp, Plus, Home, User, Compass } from 'lucide-react';

const Navbar = ({
    user,
    currentPage,
    setCurrentPage,
    setFeedFilters,
    setShowCreatePost,
    loadUserProfile,
}) => {
    
    // Helper untuk tombol navigasi agar kode lebih rapi
    const NavItem = ({ active, onClick, icon: Icon, label, accentColor = "text-white" }) => (
        <button
            onClick={onClick}
            className={`relative group p-3 rounded-2xl transition-all duration-300 flex items-center justify-center ${
                active 
                ? 'bg-white/10 shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]' 
                : 'hover:bg-white/5'
            }`}
        >
            <div className={`transition-transform duration-300 group-hover:scale-110 group-active:scale-95 ${
                active ? accentColor : 'text-zinc-500 group-hover:text-zinc-300'
            }`}>
                <Icon className={`w-6 h-6 ${active ? 'fill-current opacity-20' : ''} absolute`} strokeWidth={0} />
                <Icon className="w-6 h-6 relative z-10" strokeWidth={active ? 2.5 : 2} />
            </div>
            
            {/* Active Dot Indicator (Mobile Only) */}
            {active && (
                <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full md:hidden" />
            )}
            
            {/* Tooltip (Desktop Only) */}
            <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform duration-200 px-2 py-1 bg-zinc-800 border border-white/10 rounded-lg text-[10px] font-bold text-zinc-300 uppercase tracking-widest hidden md:block pointer-events-none">
                {label}
            </span>
        </button>
    );

    const CreateButton = ({ onClick }) => (
        <button
            onClick={onClick}
            className="relative group p-3 mx-2"
        >
            <div className="absolute inset-0 bg-white/10 rounded-2xl blur-md group-hover:bg-white/20 transition-colors duration-300" />
            <div className="relative bg-zinc-800 border border-white/10 text-white p-2.5 rounded-xl group-hover:scale-110 group-active:scale-95 transition-all duration-300 shadow-xl shadow-black/50">
                <Plus className="w-6 h-6" />
            </div>
        </button>
    );

    return (
        <>
            {/* === MOBILE BOTTOM NAVIGATION (Fixed) === */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-t border-white/5 md:hidden pb-safe">
                <div className="flex items-center justify-around px-4 py-3">
                    <NavItem 
                        active={currentPage === 'feed'}
                        onClick={() => {
                            setCurrentPage('feed');
                            setFeedFilters(prev => ({ ...prev, search: '', page: 1 }))
                        }}
                        icon={Home}
                        label="Home"
                    />

                    <NavItem 
                        active={currentPage === 'trending'}
                        onClick={() => setCurrentPage('trending')}
                        icon={TrendingUp}
                        label="Trending"
                        accentColor="text-red-400"
                    />

                    <CreateButton onClick={() => setShowCreatePost(true)} />

                    <NavItem 
                        active={false} // Placeholder for generic explore if needed, or remove
                        onClick={() => {}} 
                        icon={Compass} 
                        label="Explore"
                    />

                    <button
                        onClick={() => {
                            setCurrentPage('profile');
                            loadUserProfile(user.id);
                        }}
                        className={`relative p-0.5 rounded-full transition-all duration-300 ${
                            currentPage === 'profile' ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : 'opacity-70'
                        }`}
                    >
                         <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span>{user?.name?.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                    </button>
                </div>
            </div>

            {/* === DESKTOP FLOATING DOCK === */}
            <div className="hidden md:flex fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
                <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-full px-4 py-2 shadow-2xl shadow-black/80 flex items-center gap-2 ring-1 ring-white/5">
                    
                    <NavItem 
                        active={currentPage === 'feed'}
                        onClick={() => {
                            setCurrentPage('feed');
                            setFeedFilters(prev => ({ ...prev, search: '', page: 1 }))
                        }}
                        icon={Home}
                        label="Feed"
                    />

                    <NavItem 
                        active={currentPage === 'trending'}
                        onClick={() => setCurrentPage('trending')}
                        icon={TrendingUp}
                        label="Trending"
                        accentColor="text-red-400"
                    />

                    {/* Divider */}
                    <div className="w-px h-8 bg-white/5 mx-1" />

                    <CreateButton onClick={() => setShowCreatePost(true)} />

                    {/* Divider */}
                    <div className="w-px h-8 bg-white/5 mx-1" />

                    <button
                        onClick={() => {
                            setCurrentPage('profile');
                            loadUserProfile(user.id);
                        }}
                        className="relative group p-2"
                    >
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10 flex items-center justify-center text-sm font-bold text-white transition-all duration-300 ${
                             currentPage === 'profile' 
                             ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-950 scale-105' 
                             : 'group-hover:ring-2 group-hover:ring-white/20 group-hover:scale-105'
                        }`}>
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        {/* Profile Tooltip */}
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200 px-2 py-1 bg-zinc-800 border border-white/10 rounded-lg text-[10px] font-bold text-zinc-300 uppercase tracking-widest whitespace-nowrap pointer-events-none">
                            Profile
                        </span>
                    </button>

                </div>
            </div>
        </>
    );
};

export default Navbar;