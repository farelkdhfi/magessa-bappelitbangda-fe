import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Users, List, BarChart3 } from 'lucide-react';
import * as bukuTamuService from '../../services/bukuTamuService';
import ErrorModal from '../../components/Admin/ErrorModal';
import SuccessModal from '../../components/Admin/SuccessModal';
import ConfirmationModal from '../../components/Admin/ConfirmationModal';
import GuestView from '../../components/Admin/GuestView';
import CreateBukuTamu from '../../components/Admin/CreateBukuTamu';
import BukuTamuView from '../../components/Admin/BukuTamuView';
import ImageModal from '../../components/Ui/ImageModal';

const AdminBukuTamu = () => {
  const [events, setEvents] = useState([]);
  const [guests, setGuests] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('events'); // 'events', 'guests', 'create'
  const [actionLoading, setActionLoading] = useState({});
  const [eventsPagination, setEventsPagination] = useState({ current_page: 1, total_pages: 1, total_items: 0 });
  const [guestsPagination, setGuestsPagination] = useState({ current_page: 1, total_pages: 1, total_items: 0 });
  
  // Search & Filter
  const [eventSearch, setEventSearch] = useState('');
  const [guestSearch, setGuestSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Form Data
  const [formData, setFormData] = useState({ nama_acara: '', tanggal_acara: '', lokasi: '', deskripsi: '' });
  const [qrCode, setQrCode] = useState('');
  const [guestUrl, setGuestUrl] = useState('');
  
  // UI States
  const [selectedImage, setSelectedImage] = useState('');
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, data: null });
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });

  // --- SERVICE WRAPPERS ---
  const setActionLoadingState = (action, isLoading) => {
    setActionLoading(prev => ({ ...prev, [action]: isLoading }));
  };

  const showSuccess = (title, message) => setSuccessModal({ isOpen: true, title, message });
  const showError = (title, message) => setErrorModal({ isOpen: true, title, message });

  const loadEvents = async (page = 1, search = '', status = '') => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (status) params.status = status;
      const data = await bukuTamuService.fetchEvents(params);
      setEvents(data.data);
      setEventsPagination(data.pagination);
    } catch (error) {
      console.error('Error loading events:', error);
      showError('Gagal Memuat Data', 'Tidak dapat memuat data buku tamu.');
    } finally {
      setLoading(false);
    }
  };

  const loadGuests = async (eventId, page = 1, search = '') => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      const data = await bukuTamuService.fetchGuests(eventId, params);
      setGuests(data.data);
      setCurrentEvent(data.buku_tamu);
      setGuestsPagination(data.pagination);
    } catch (error) {
      console.error('Error loading guests:', error);
      showError('Gagal Memuat Data Tamu', 'Tidak dapat memuat data tamu.');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (e) => {
    e.preventDefault();
    setActionLoadingState('create', true);
    try {
      const data = await bukuTamuService.createEvent(formData);
      setQrCode(data.qr_code);
      setGuestUrl(data.guest_url);
      showSuccess('Berhasil!', 'Buku tamu berhasil dibuat.');
      setFormData({ nama_acara: '', tanggal_acara: '', lokasi: '', deskripsi: '' });
      loadEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      showError('Gagal Membuat Acara', error.response?.data?.error || 'Gagal membuat buku tamu.');
    } finally {
      setActionLoadingState('create', false);
    }
  };

  const toggleEventStatus = async (eventId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setActionLoadingState(`status-${eventId}`, true);
    try {
      await bukuTamuService.updateEventStatus(eventId, newStatus);
      showSuccess('Status Berubah', `Status berhasil diubah menjadi ${newStatus === 'active' ? 'aktif' : 'tidak aktif'}.`);
      loadEvents(eventsPagination.current_page, eventSearch, statusFilter);
    } catch (error) {
      showError('Gagal Mengubah Status', 'Gagal update status acara.');
    } finally {
      setActionLoadingState(`status-${eventId}`, false);
    }
  };

  const deleteEvent = async (eventId) => {
    setActionLoadingState(`delete-${eventId}`, true);
    try {
      await bukuTamuService.deleteEvent(eventId);
      showSuccess('Berhasil Dihapus', 'Buku tamu berhasil dihapus.');
      loadEvents(eventsPagination.current_page, eventSearch, statusFilter);
    } catch (error) {
      showError('Gagal Menghapus', 'Gagal menghapus buku tamu.');
    } finally {
      setActionLoadingState(`delete-${eventId}`, false);
      setConfirmModal({ isOpen: false, data: null });
    }
  };

  const deleteGuestPhoto = async (photoId) => {
    setActionLoadingState(`photo-${photoId}`, true);
    try {
      await bukuTamuService.deleteGuestPhoto(photoId);
      showSuccess('Foto Dihapus', 'Foto tamu berhasil dihapus.');
      loadGuests(currentEvent.id, guestsPagination.current_page, guestSearch);
    } catch (error) {
      showError('Gagal Menghapus Foto', 'Gagal hapus foto.');
    } finally {
      setActionLoadingState(`photo-${photoId}`, false);
      setConfirmModal({ isOpen: false, data: null });
    }
  };

  // --- UTILS ---
  const downloadQRCode = (qrCodeDataUrl, eventName) => {
    const link = document.createElement('a');
    link.download = `qr-code-${eventName.replace(/\s+/g, '-')}.png`;
    link.href = qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess('Download Berhasil', 'QR Code berhasil didownload.');
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => showSuccess('Tersalin!', 'Link berhasil disalin.'));
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed"; textArea.style.opacity = "0";
      document.body.appendChild(textArea); textArea.focus(); textArea.select();
      try {
        document.execCommand('copy') ? showSuccess('Tersalin!', 'Link berhasil disalin.') : showError('Gagal', 'Gagal menyalin manual.');
      } catch (err) { showError('Gagal', 'Browser tidak support.'); }
      document.body.removeChild(textArea);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  // --- EFFECTS ---
  useEffect(() => { loadEvents(); }, []);
  useEffect(() => { const t = setTimeout(() => { if (view === 'events') loadEvents(1, eventSearch, statusFilter); }, 500); return () => clearTimeout(t); }, [eventSearch, statusFilter]);
  useEffect(() => { const t = setTimeout(() => { if (view === 'guests' && currentEvent) loadGuests(currentEvent.id, 1, guestSearch); }, 500); return () => clearTimeout(t); }, [guestSearch]);

  // --- RENDER HELPERS ---
  
  const StatItem = ({ label, count, icon: Icon }) => (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-white/5 backdrop-blur-sm">
        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <Icon className="w-5 h-5 text-zinc-400" />
        </div>
        <div>
            <p className="text-2xl font-light text-white leading-none mb-1">{count}</p>
            <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">{label}</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen text-white font-sans selection:bg-white/20">
      
      {/* HEADER & NAV SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        
        {/* Title Block */}
        <div className="space-y-2">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg border border-white/5 backdrop-blur-sm">
                    <Calendar className="w-5 h-5 text-zinc-400" />
                </div>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
                    Event Management
                </p>
            </div>
            <h1 className="text-3xl font-light tracking-tight text-white">
                Buku Tamu <span className="font-semibold text-zinc-400">Digital</span>
            </h1>
        </div>

        {/* Navigation Tabs (Segmented Control) */}
        <div className="bg-zinc-900/80 backdrop-blur-md border border-white/5 p-1.5 rounded-2xl flex items-center gap-1 shadow-xl shadow-black/20 self-start md:self-end">
            <button
                onClick={() => setView('events')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-300 ${
                    view === 'events'
                        ? 'bg-white text-black shadow-lg shadow-white/5 scale-[1.02]'
                        : 'text-zinc-500 hover:text-white hover:bg-white/5'
                }`}
            >
                <List className="w-4 h-4" />
                Daftar Acara
            </button>

            <button
                onClick={() => setView('create')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-300 ${
                    view === 'create'
                        ? 'bg-white text-black shadow-lg shadow-white/5 scale-[1.02]'
                        : 'text-zinc-500 hover:text-white hover:bg-white/5'
                }`}
            >
                <Plus className="w-4 h-4" />
                Buat Baru
            </button>
        </div>
      </div>

      {/* STATS ROW (Only visible on Events view) */}
      {view === 'events' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <StatItem label="Total Acara" count={eventsPagination.total_items} icon={Calendar} />
              <StatItem label="Acara Aktif" count={events.filter(e => e.status === 'active').length} icon={BarChart3} />
              <StatItem label="Total Tamu" count={events.reduce((acc, curr) => acc + (curr.jumlah_tamu || 0), 0)} icon={Users} />
          </div>
      )}

      {/* CONTENT AREA */}
      <div className="relative min-h-[400px]">
        {/* Background Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-white/5 rounded-full blur-[100px] -z-10 opacity-20 pointer-events-none" />

        <div className="transition-all duration-500">
            
            {/* VIEW: DAFTAR ACARA */}
            {view === 'events' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <BukuTamuView
                        view={view}
                        eventSearch={eventSearch} setEventSearch={setEventSearch}
                        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
                        loading={loading}
                        events={events}
                        eventsPagination={eventsPagination}
                        formatDate={formatDate}
                        loadGuests={loadGuests}
                        setView={setView}
                        toggleEventStatus={toggleEventStatus}
                        actionLoading={actionLoading}
                        setConfirmModal={setConfirmModal}
                        loadEvents={loadEvents}
                    />
                </div>
            )}

            {/* VIEW: DETAIL TAMU */}
            {view === 'guests' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <GuestView
                        view={view}
                        currentEvent={currentEvent}
                        guestSearch={guestSearch} setGuestSearch={setGuestSearch}
                        loading={loading}
                        guests={guests}
                        guestsPagination={guestsPagination}
                        actionLoading={actionLoading}
                        setConfirmModal={setConfirmModal}
                        setSelectedImage={setSelectedImage}
                        setView={setView}
                        formatDate={formatDate}
                        formatTime={formatTime}
                    />
                </div>
            )}

            {/* VIEW: BUAT ACARA */}
            {view === 'create' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CreateBukuTamu
                        view={view}
                        createEvent={createEvent}
                        formData={formData} setFormData={setFormData}
                        setView={setView}
                        setQrCode={setQrCode} setGuestUrl={setGuestUrl}
                        actionLoading={actionLoading}
                        qrCode={qrCode} guestUrl={guestUrl}
                        downloadQRCode={downloadQRCode}
                        copyToClipboard={copyToClipboard}
                    />
                </div>
            )}
        </div>
      </div>

      {/* --- MODALS --- */}
      <ImageModal selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
      
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, data: null })}
        onConfirm={() => {
          if (confirmModal.data?.type === 'delete-event') deleteEvent(confirmModal.data.id);
          else if (confirmModal.data?.type === 'delete-photo') deleteGuestPhoto(confirmModal.data.id);
        }}
        title={confirmModal.data?.type === 'delete-event' ? 'Hapus Acara?' : 'Hapus Foto?'}
        message={confirmModal.data?.type === 'delete-event' ? `Data "${confirmModal.data?.name}" akan dihapus permanen beserta data tamunya.` : 'Foto ini akan dihapus permanen.'}
        confirmText="Hapus Permanen"
        type="error"
      />

      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal({ isOpen: false, title: '', message: '' })}
        title={successModal.title}
        message={successModal.message}
      />

      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, title: '', message: '' })}
        title={errorModal.title}
        message={errorModal.message}
      />

    </div>
  );
};

export default AdminBukuTamu;