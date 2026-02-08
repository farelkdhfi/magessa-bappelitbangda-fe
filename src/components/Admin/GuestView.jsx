import { Calendar, ChevronLeft, ChevronRight, Image as ImageIcon, Loader2, MapPin, Search, Users, X, Clock, Mail, Briefcase, User, Building2 } from 'lucide-react';
import React from 'react'
import LoadingSpinner from '../Ui/LoadingSpinner';

const GuestView = ({
    view,
    currentEvent,
    guestSearch,
    setGuestSearch,
    loading,
    guests,
    guestsPagination,
    actionLoading,
    setConfirmModal,
    setSelectedImage,
    setView,
    formatDate,
    formatTime
}) => {
    
    if (view !== 'guests' || !currentEvent) return null;

    return (
        <div className="w-full animate-in fade-in slide-in-from-right-8 duration-500">
            
            {/* 1. HEADER & NAVIGATION */}
            <div className="flex flex-col gap-6 mb-8">
                <button
                    onClick={() => setView('events')}
                    className="self-start flex items-center gap-2 px-4 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all group"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Kembali ke Daftar Acara</span>
                </button>

                {/* Event Info Panel */}
                <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
                    
                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div>
                                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-3">
                                    Event Detail
                                </span>
                                <h2 className="text-3xl font-light text-white mb-2">{currentEvent.nama_acara}</h2>
                                {currentEvent.deskripsi && (
                                    <p className="text-zinc-400 text-sm max-w-2xl line-clamp-2 mb-4">{currentEvent.deskripsi}</p>
                                )}
                            </div>
                            
                            {/* Meta Badges */}
                            <div className="flex flex-wrap gap-2">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 border border-white/5 text-zinc-300 text-xs font-medium">
                                    <Calendar className="w-4 h-4 text-zinc-500" />
                                    {formatDate(currentEvent.tanggal_acara)}
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 border border-white/5 text-zinc-300 text-xs font-medium">
                                    <MapPin className="w-4 h-4 text-zinc-500" />
                                    {currentEvent.lokasi || 'Lokasi tidak diset'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. SEARCH & FILTER */}
            <div className="bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-2xl p-4 mb-8 shadow-2xl shadow-black/20 sticky top-4 z-20">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input 
                        type="text"
                        placeholder="Cari nama tamu, instansi, atau jabatan..."
                        value={guestSearch}
                        onChange={(e) => setGuestSearch(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
                    />
                    {guestSearch && (
                        <button onClick={() => setGuestSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full text-zinc-500 hover:text-white transition">
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>
                <div className="mt-3 px-1 flex justify-between items-center text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
                    <span>{guestsPagination.total_items} Tamu Terdaftar</span>
                </div>
            </div>

            {/* 3. CONTENT AREA */}
            <div className="min-h-[300px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <span className="text-xs text-zinc-500 uppercase tracking-widest animate-pulse">Memuat Data Tamu...</span>
                    </div>
                ) : guests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-zinc-900/20">
                        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-white/5">
                            <Users className="w-6 h-6 text-zinc-600" />
                        </div>
                        <h3 className="text-white font-medium mb-1">Belum Ada Tamu</h3>
                        <p className="text-zinc-500 text-sm">Belum ada tamu check-in atau data tidak ditemukan.</p>
                        {guestSearch && (
                            <button onClick={() => setGuestSearch('')} className="mt-4 text-xs text-white underline underline-offset-4">Reset Pencarian</button>
                        )}
                    </div>
                ) : (
                    /* 4. GUEST CARDS GRID */
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {guests.map((guest) => (
                            <div key={guest.id} className="group bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl p-5 hover:border-white/20 transition-all duration-300 relative">
                                
                                {/* Header: Profile Info */}
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5 shrink-0">
                                        <User className="w-5 h-5 text-zinc-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-white font-semibold truncate pr-2">{guest.nama_lengkap}</h3>
                                        <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-400">
                                            <Mail className="w-3 h-3" />
                                            <span className="truncate">{guest.email || '-'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="space-y-3 mb-5">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-zinc-300">
                                        <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                                        <span className="truncate">{guest.instansi || '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-zinc-300">
                                        <Briefcase className="w-3.5 h-3.5 text-zinc-500" />
                                        <span className="truncate">{guest.jabatan || '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs text-emerald-400">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>Check-in: {formatTime(guest.check_in_time)}</span>
                                        <span className="text-zinc-600 text-[10px] ml-auto">{formatDate(guest.check_in_time)}</span>
                                    </div>
                                </div>

                                {/* Photos & Actions */}
                                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                    {guest.foto_kehadiran_tamu && guest.foto_kehadiran_tamu.length > 0 ? (
                                        <div className="flex -space-x-2">
                                            {guest.foto_kehadiran_tamu.map((foto, idx) => (
                                                <div key={foto.id} className="relative group/photo">
                                                    <img
                                                        src={foto.file_url}
                                                        alt="Check-in"
                                                        className="w-8 h-8 rounded-full border-2 border-zinc-900 object-cover cursor-pointer hover:scale-110 transition-transform"
                                                        onClick={() => setSelectedImage(foto.file_url)}
                                                    />
                                                    {/* Delete Photo Button (Hover Only) */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setConfirmModal({ isOpen: true, data: { type: 'delete-photo', id: foto.id } });
                                                        }}
                                                        disabled={actionLoading[`photo-${foto.id}`]}
                                                        className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity"
                                                    >
                                                        {actionLoading[`photo-${foto.id}`] ? <Loader2 className="w-2 h-2 animate-spin" /> : <X className="w-2 h-2" />}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-[10px] text-zinc-600 italic">No photos</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 5. PAGINATION */}
            {!loading && guests.length > 0 && guestsPagination.total_pages > 1 && (
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
                    <p className="text-xs text-zinc-500">
                        Halaman <span className="text-white font-mono">{guestsPagination.current_page}</span> dari {guestsPagination.total_pages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => loadGuests(currentEvent.id, guestsPagination.current_page - 1, guestSearch)}
                            disabled={guestsPagination.current_page === 1}
                            className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => loadGuests(currentEvent.id, guestsPagination.current_page + 1, guestSearch)}
                            disabled={guestsPagination.current_page === guestsPagination.total_pages}
                            className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GuestView