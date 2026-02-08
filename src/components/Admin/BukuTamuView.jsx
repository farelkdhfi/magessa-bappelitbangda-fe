import { Calendar, ChevronLeft, ChevronRight, Edit, Eye, Loader2, MapPin, Search, Trash2, Users, X, Filter } from 'lucide-react';
import React from 'react';
import LoadingSpinner from '../Ui/LoadingSpinner';

const BukuTamuView = ({
  view,
  eventSearch,
  setEventSearch,
  statusFilter,
  setStatusFilter,
  loading,
  events,
  eventsPagination,
  formatDate,
  loadGuests,
  setView,
  toggleEventStatus,
  actionLoading,
  setConfirmModal,
  loadEvents,
}) => {
  
  const clearFilters = () => {
    setEventSearch('');
    setStatusFilter('');
  };

  // Client-side filtering (jika diperlukan, meski sebaiknya server-side)
  const filteredEvents = events.filter((event) => {
    const matchesSearch = eventSearch
      ? event.nama_acara?.toLowerCase().includes(eventSearch.toLowerCase()) ||
        event.lokasi?.toLowerCase().includes(eventSearch.toLowerCase()) ||
        event.deskripsi?.toLowerCase().includes(eventSearch.toLowerCase())
      : true;

    const matchesStatus = statusFilter ? event.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  // --- STYLE HELPERS ---

  const getStatusBadge = (status) => {
    const isActive = status === 'active';
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
        isActive 
        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      }`}>
        <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`}></div>
        {isActive ? 'Aktif' : 'Non-Aktif'}
      </span>
    );
  };

  if (view !== 'events') return null;

  return (
    <div className="w-full">
      
      {/* 1. SEARCH & FILTER BAR */}
      <div className="bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-2xl p-4 mb-8 shadow-2xl shadow-black/20 sticky top-0 z-10">
        <div className="flex flex-col md:flex-row gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                    type="text"
                    placeholder="Cari nama acara, lokasi, atau deskripsi..."
                    value={eventSearch}
                    onChange={(e) => setEventSearch(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
                />
                {eventSearch && (
                    <button onClick={() => setEventSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full text-zinc-500 hover:text-white transition">
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>

            {/* Filter Dropdown */}
            <div className="relative min-w-[160px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-4 w-4 text-zinc-500" />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm text-zinc-300 focus:outline-none focus:border-white/30 cursor-pointer appearance-none hover:bg-zinc-900 transition-colors"
                >
                    <option value="">Semua Status</option>
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                </select>
            </div>

            {/* Reset Button */}
            {(eventSearch || statusFilter) && (
                <button 
                    onClick={clearFilters}
                    className="px-4 py-3 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 text-sm font-medium transition-all"
                >
                    Reset
                </button>
            )}
        </div>
        
        {/* Info Text */}
        <div className="mt-3 px-1 flex justify-between items-center text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
            <span>Menampilkan {filteredEvents.length} data</span>
        </div>
      </div>

      {/* 2. LOADING STATE */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <span className="text-xs text-zinc-500 uppercase tracking-widest animate-pulse">Memuat Data...</span>
        </div>
      )}

      {/* 3. EMPTY STATES */}
      {!loading && filteredEvents.length === 0 && events.length > 0 && (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-zinc-900/20">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-white/5">
                <Search className="w-6 h-6 text-zinc-600" />
            </div>
            <h3 className="text-white font-medium mb-1">Tidak ditemukan</h3>
            <p className="text-zinc-500 text-sm">Coba ubah kata kunci atau filter anda.</p>
            <button onClick={clearFilters} className="mt-4 text-xs text-white underline underline-offset-4">Reset Filter</button>
        </div>
      )}

      {!loading && events.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-zinc-900/20">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-white/5">
                <Calendar className="w-6 h-6 text-zinc-600" />
            </div>
            <h3 className="text-white font-medium mb-1">Belum Ada Acara</h3>
            <p className="text-zinc-500 text-sm">Buat acara pertama Anda untuk memulai.</p>
        </div>
      )}

      {/* 4. EVENT CARDS GRID */}
      {!loading && filteredEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <article 
                key={event.id} 
                className="group flex flex-col bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl p-6 hover:border-white/20 transition-all duration-300 relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex-1 pr-4">
                    <h3 className="text-lg font-semibold text-white leading-tight mb-2 group-hover:text-zinc-100 transition-colors line-clamp-1">
                        {event.nama_acara}
                    </h3>
                    {event.deskripsi && (
                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                            {event.deskripsi}
                        </p>
                    )}
                </div>
                <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(event.status)}
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6 bg-white/5 rounded-2xl p-4 border border-white/5 relative z-10">
                <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Tanggal</p>
                    <div className="flex items-center gap-2 text-zinc-300 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        {formatDate(event.tanggal_acara)}
                    </div>
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Lokasi</p>
                    <div className="flex items-center gap-2 text-zinc-300 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="truncate">{event.lokasi || '-'}</span>
                    </div>
                </div>
                <div className="col-span-2 pt-3 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="text-xs text-zinc-400">Total Tamu:</span>
                    </div>
                    <span className="text-sm font-mono font-bold text-white">
                        {event.kehadiran_tamu?.[0]?.count || 0}
                    </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-white/5 relative z-10">
                {/* Lihat Tamu (Full Width on mobile, half on desktop) */}
                <button
                  onClick={() => {
                    loadGuests(event.id);
                    setView('guests');
                  }}
                  className="col-span-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-black text-xs font-bold rounded-xl hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Lihat Buku Tamu
                </button>

                {/* Status Toggle */}
                <button
                  onClick={() => toggleEventStatus(event.id, event.status)}
                  disabled={actionLoading[`status-${event.id}`]}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 border text-xs font-bold rounded-xl transition-all disabled:opacity-50 ${
                    event.status === 'active'
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'
                  }`}
                >
                  {actionLoading[`status-${event.id}`] ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Edit className="w-3.5 h-3.5" />
                  )}
                  {event.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                </button>

                {/* Delete */}
                <button
                  onClick={() =>
                    setConfirmModal({
                      isOpen: true,
                      data: { type: 'delete-event', id: event.id, name: event.nama_acara },
                    })
                  }
                  disabled={actionLoading[`delete-${event.id}`]}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-bold rounded-xl hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
                >
                  {actionLoading[`delete-${event.id}`] ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  Hapus
                </button>
              </div>

            </article>
          ))}
        </div>
      )}

      {/* 5. PAGINATION */}
      {!loading && filteredEvents.length > 0 && eventsPagination.total_pages > 1 && (
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
            <p className="text-xs text-zinc-500">
                Halaman <span className="text-white font-mono">{eventsPagination.current_page}</span> dari {eventsPagination.total_pages}
            </p>
            <div className="flex gap-2">
                <button
                    onClick={() => loadEvents(eventsPagination.current_page - 1, eventSearch, statusFilter)}
                    disabled={eventsPagination.current_page === 1}
                    className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                    onClick={() => loadEvents(eventsPagination.current_page + 1, eventSearch, statusFilter)}
                    disabled={eventsPagination.current_page === eventsPagination.total_pages}
                    className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default BukuTamuView;