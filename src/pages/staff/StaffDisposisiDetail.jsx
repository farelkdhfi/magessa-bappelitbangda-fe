import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { staffDisposisiService } from '../../services/staffDisposisiService';
import {
  FileText,
  Edit,
  Trash2,
  X,
  ArrowLeft,
  Check,
  MessageSquare,
  Paperclip,
  Calendar,
  Building,
  User,
  AlertCircle,
  Eye,
  Cog,
  Flag,
  Send,
  Save,
  Clock,
  Download,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../utils/api'; // Pastikan import ini ada sesuai struktur project Anda
import LoadingSpinner from '../../components/Ui/LoadingSpinner';

const StaffDisposisiDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [disposisi, setDisposisi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [acceptError, setAcceptError] = useState(null);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  // State untuk feedback
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    notes: '',
    status: 'diproses',
    files: []
  });
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // State untuk edit feedback
  const [editingFeedbackId, setEditingFeedbackId] = useState(null);
  const [editFeedbackData, setEditFeedbackData] = useState({
    notes: '',
    status: 'diproses',
    newFiles: [],
    removeFileIds: [],
    existingFiles: []
  });
  const [editLoading, setEditLoading] = useState(false);

  // === LOGIC START (DIPERTAHANKAN TOTAL) ===
  const fetchDisposisiDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await staffDisposisiService.getDisposisiDetail(id);
      setDisposisi(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisposisiDetail();
  }, [id]);

  useEffect(() => {
    if (disposisi) {
      fetchFeedbackForDisposisi();
    }
  }, [disposisi]);

  const fetchFeedbackForDisposisi = async () => {
    try {
      setFeedbackLoading(true);
      const response = await staffDisposisiService.getMyFeedback();
      const filteredFeedback = response.data.filter(
        fb => fb.disposisi_id === disposisi.id
      );
      setFeedbackList(filteredFeedback);
    } catch (err) {
      console.error('❌ Error fetching feedback:', err);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const fetchFeedbackForEdit = async (feedbackId) => {
    try {
      setEditLoading(true);
      const response = await staffDisposisiService.getFeedbackForEdit(feedbackId);
      const feedback = response.data;
      setEditFeedbackData({
        notes: feedback.notes || '',
        status: feedback.disposisi?.status_dari_bawahan || 'diproses',
        newFiles: [],
        removeFileIds: [],
        existingFiles: feedback.files || []
      });
      setEditingFeedbackId(feedbackId);
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setEditLoading(false);
    }
  };

  const handleAcceptDisposisi = async () => {
    try {
      setAcceptLoading(true);
      setAcceptError(null);
      const response = await staffDisposisiService.terimaDisposisi(id);
      setDisposisi(prev => ({
        ...prev,
        status_dari_bawahan: 'diterima'
      }));
      toast.success('Disposisi berhasil diterima!');
    } catch (err) {
      setAcceptError(err.message);
      toast.error(`Error: ${err.message}`);
    } finally {
      setAcceptLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!disposisi?.id) return;
    setDownloadLoading(true);
    setDownloadError(null);
    try {
      const response = await api.get(`/disposisi/${disposisi.id}/pdf`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const filename = `disposisi-${disposisi.nomor_surat || disposisi.id}.pdf`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.setTimeout(() => window.URL.revokeObjectURL(url), 100);
      toast.success('PDF berhasil diunduh!');
    } catch (err) {
      console.error('Gagal mengunduh PDF:', err);
      setDownloadError('Gagal mengunduh PDF.');
      toast.error('Gagal mengunduh PDF.');
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFeedbackData(prev => ({ ...prev, files: files.slice(0, 5) }));
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      setFeedbackLoading(true);
      setFeedbackError(null);
      const formData = new FormData();
      formData.append('notes', feedbackData.notes);
      formData.append('status', feedbackData.status);
      formData.append('status_dari_bawahan', feedbackData.status);
      feedbackData.files.forEach(file => {
        formData.append('feedback_files', file);
      });
      await staffDisposisiService.submitFeedback(id, formData);
      setFeedbackSuccess(true);
      setShowFeedbackForm(false);
      setFeedbackData({ notes: '', status: 'diproses', files: [] });
      fetchDisposisiDetail();
      fetchFeedbackForDisposisi();
      toast.success('Feedback berhasil dikirim!');
    } catch (err) {
      setFeedbackError(err.message);
      toast.error(`Error: ${err.message}`);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleEditFeedbackChange = (e) => {
    const { name, value } = e.target;
    setEditFeedbackData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditFileChange = (e) => {
    const files = Array.from(e.target.files);
    setEditFeedbackData(prev => ({ ...prev, newFiles: files.slice(0, 5) }));
  };

  const handleRemoveExistingFile = (fileId) => {
    setEditFeedbackData(prev => ({
      ...prev,
      removeFileIds: [...prev.removeFileIds, fileId],
      existingFiles: prev.existingFiles.filter(file => file.id !== fileId)
    }));
  };

  const handleEditFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      setEditLoading(true);
      setFeedbackError(null);
      const formData = new FormData();
      formData.append('notes', editFeedbackData.notes);
      formData.append('status', editFeedbackData.status);
      formData.append('status_dari_bawahan', editFeedbackData.status);
      editFeedbackData.newFiles.forEach(file => {
        formData.append('new_feedback_files', file);
      });
      editFeedbackData.removeFileIds.forEach(fileId => {
        formData.append('remove_file_ids', fileId);
      });
      await staffDisposisiService.updateFeedback(editingFeedbackId, formData);
      setEditingFeedbackId(null);
      setEditFeedbackData({
        notes: '',
        status: 'diproses',
        newFiles: [],
        removeFileIds: [],
        existingFiles: []
      });
      fetchDisposisiDetail();
      fetchFeedbackForDisposisi();
      toast.success('Feedback berhasil diperbarui!');
    } catch (err) {
      setFeedbackError(err.message);
      toast.error(`Error: ${err.message}`);
    } finally {
      setEditLoading(false);
    }
  };

  const cancelEditFeedback = () => {
    setEditingFeedbackId(null);
    setEditFeedbackData({
      notes: '',
      status: 'diproses',
      newFiles: [],
      removeFileIds: [],
      existingFiles: []
    });
    setFeedbackError(null);
  };

  const openImageModal = (imageUrl) => {
    window.open(imageUrl, '_blank');
  };

  const canAcceptDisposisi = () => {
    return disposisi && disposisi.status_dari_bawahan === 'dibaca';
  };

  const canGiveFeedback = () => {
    return disposisi &&
      !disposisi.has_feedback &&
      (disposisi.status_dari_bawahan === 'diterima' || disposisi.status_dari_bawahan === 'diproses');
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  // === LOGIC END ===

  // === STYLED COMPONENTS HELPERS ===
  const getStatusBadge = (status) => {
    const statusConfigs = {
      'belum dibaca': { css: 'bg-red-500/10 text-red-400 border-red-500/20', icon: AlertCircle, label: 'Belum Dibaca' },
      'dibaca': { css: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: Eye, label: 'Sudah Dibaca' },
      'diterima': { css: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', icon: Check, label: 'Diterima' },
      'diproses': { css: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Cog, label: 'Diproses' },
      'selesai': { css: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: Flag, label: 'Selesai' }
    };
    const config = statusConfigs[status] || statusConfigs['belum dibaca'];
    const IconComponent = config.icon;
    
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.css} backdrop-blur-md`}>
        <IconComponent className="w-3.5 h-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-wide">{config.label}</span>
      </div>
    );
  };

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="bg-black/20 rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3.5 h-3.5 text-zinc-500" />
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</p>
      </div>
      <p className="text-white font-medium pl-6">{value || '-'}</p>
    </div>
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-red-500/20 rounded-3xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-light text-white mb-2">Terjadi Kesalahan</h3>
          <p className="text-zinc-500 mb-6">{error}</p>
          <button onClick={fetchDisposisiDetail} className="w-full px-4 py-3 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold transition-all">Coba Lagi</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white font-sans selection:bg-white/20 pb-20">
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6">

        {/* 1. Header Section */}
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 md:p-8">
          <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Kembali
          </button>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div>
                <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white mb-2">
                  Detail <span className="font-semibold text-zinc-500">Disposisi</span>
                </h1>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Kelola dan berikan feedback terhadap instruksi yang diberikan pimpinan.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                 <button
                  onClick={handleDownloadPDF}
                  disabled={downloadLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 border border-white/5 text-zinc-300 hover:text-white hover:bg-zinc-700 font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloadLoading ? <LoadingSpinner size="sm" /> : <Download className="w-4 h-4" />}
                  Download Lembar Disposisi
                </button>
              </div>
            </div>

            {disposisi && (
              <div className="flex flex-col items-start lg:items-end gap-4">
                {getStatusBadge(disposisi.status_dari_bawahan)}
                
                <div className="flex flex-wrap gap-3">
                  {canAcceptDisposisi() && (
                    <button
                      onClick={handleAcceptDisposisi}
                      disabled={acceptLoading}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-white/5 disabled:opacity-50"
                    >
                      {acceptLoading ? <LoadingSpinner size="sm" color="text-black" /> : <Check className="w-4 h-4" />}
                      Terima Disposisi
                    </button>
                  )}
                  
                  {canGiveFeedback() && !showFeedbackForm && !editingFeedbackId && (
                    <button
                      onClick={() => setShowFeedbackForm(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-white/5"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Beri Feedback
                    </button>
                  )}
                </div>

                {acceptError && (
                   <p className="text-red-400 text-xs flex items-center gap-1 mt-1">
                     <AlertCircle className="w-3 h-3" /> {acceptError}
                   </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 2. Content Grid */}
        {disposisi && (
          <div className="space-y-6">
            
            {/* Form Feedback */}
            {showFeedbackForm && !editingFeedbackId && (
              <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 md:p-8 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-zinc-800 rounded-2xl border border-white/5">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-light text-white">Input Feedback</h3>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Respon Disposisi</p>
                  </div>
                </div>

                <form onSubmit={handleFeedbackSubmit} className="space-y-6 max-w-4xl">
                  {feedbackError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> {feedbackError}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Catatan Feedback</label>
                    <textarea
                      name="notes"
                      value={feedbackData.notes}
                      onChange={handleFeedbackChange}
                      required
                      rows="5"
                      className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 transition-all resize-none"
                      placeholder="Tuliskan laporan progres atau hasil pengerjaan..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Update Status</label>
                    <div className="flex gap-4">
                      {['diproses', 'selesai'].map((statusOption) => (
                        <label key={statusOption} className="group cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            value={statusOption}
                            checked={feedbackData.status === statusOption}
                            onChange={handleFeedbackChange}
                            className="hidden"
                          />
                          <div className={`px-4 py-2 rounded-xl border transition-all text-sm font-medium capitalize flex items-center gap-2
                            ${feedbackData.status === statusOption 
                              ? 'bg-white text-black border-white' 
                              : 'bg-zinc-900 text-zinc-500 border-white/5 group-hover:border-white/20'}`}>
                            <div className={`w-2 h-2 rounded-full ${feedbackData.status === statusOption ? 'bg-black' : 'bg-zinc-700'}`} />
                            {statusOption}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Lampiran File</label>
                    <div className="relative group">
                       <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        accept="image/*,application/pdf"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-full bg-black/20 border border-white/10 border-dashed rounded-2xl p-4 text-center group-hover:bg-black/30 group-hover:border-white/30 transition-all">
                        <div className="flex flex-col items-center justify-center gap-2">
                           <Paperclip className="w-5 h-5 text-zinc-500" />
                           <p className="text-sm text-zinc-400">
                             {feedbackData.files.length > 0 
                               ? `${feedbackData.files.length} file dipilih` 
                               : 'Klik untuk upload (Max 5 file)'}
                           </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowFeedbackForm(false)}
                      className="px-6 py-3 bg-transparent text-zinc-400 hover:text-white rounded-2xl font-medium transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={feedbackLoading}
                      className="px-6 py-3 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold transition-all shadow-lg shadow-white/5 flex items-center gap-2"
                    >
                      {feedbackLoading ? <LoadingSpinner size="sm" color="text-black" /> : <Send className="w-4 h-4" />}
                      Kirim Feedback
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column: Surat Info */}
              <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 md:p-8 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-zinc-800 rounded-xl border border-white/5">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-white">Informasi Surat</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <InfoRow icon={Building} label="Nomor Surat" value={disposisi.nomor_surat} />
                   <InfoRow icon={Building} label="Asal Instansi" value={disposisi.asal_instansi} />
                   <InfoRow icon={Calendar} label="Tanggal Surat" value={formatDisplayDate(disposisi.tanggal_surat)} />
                   <InfoRow icon={Calendar} label="Diterima Tanggal" value={formatDisplayDate(disposisi.diterima_tanggal)} />
                   <InfoRow icon={FileText} label="No Agenda" value={disposisi.nomor_agenda} />
                </div>
              </div>

              {/* Right Column: Disposisi Info */}
              <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 md:p-8 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-zinc-800 rounded-xl border border-white/5">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-white">Detail Disposisi</h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <InfoRow icon={AlertCircle} label="Sifat" value={disposisi.sifat} />
                     <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                        <div className="flex items-center gap-2 mb-1">
                          <Cog className="w-3.5 h-3.5 text-zinc-500" />
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</p>
                        </div>
                        <div className="mt-1">{getStatusBadge(disposisi.status_dari_bawahan)}</div>
                     </div>
                  </div>
                  <InfoRow icon={User} label="Dari Jabatan" value={disposisi.disposisi_kepada_jabatan} />
                  <InfoRow icon={User} label="Diteruskan Kepada" value={disposisi.diteruskan_kepada_nama || disposisi.diteruskan_kepada_jabatan} />
                  <InfoRow icon={Clock} label="Tgl Disposisi" value={new Date(disposisi.created_at).toLocaleString('id-ID')} />
                </div>
              </div>
            </div>

            {/* Isi Disposisi & Catatan */}
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 md:p-8">
                 <h4 className="flex items-center gap-2 text-zinc-400 font-medium mb-4">
                    <MessageSquare className="w-4 h-4" />
                    Dengan hormat harap:
                 </h4>
                 <div className="bg-black/20 border border-white/5 p-6 rounded-2xl text-white leading-relaxed whitespace-pre-wrap">
                    {disposisi.dengan_hormat_harap}
                 </div>
              </div>

              {disposisi.catatan && (
                <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 md:p-8">
                   <h4 className="flex items-center gap-2 text-zinc-400 font-medium mb-4">
                      <User className="w-4 h-4" />
                      Catatan dari Kepala
                   </h4>
                   <div className="bg-black/20 border border-white/5 p-6 rounded-2xl text-zinc-300 leading-relaxed">
                      {disposisi.catatan}
                   </div>
                </div>
              )}

              {disposisi.catatan_kabid && (
                <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 md:p-8">
                   <h4 className="flex items-center gap-2 text-zinc-400 font-medium mb-4">
                      <User className="w-4 h-4" />
                      Keterangan dari Kabid
                   </h4>
                   <div className="bg-black/20 border border-white/5 p-6 rounded-2xl text-zinc-300 leading-relaxed">
                      {disposisi.catatan_kabid}
                   </div>
                </div>
              )}
            </div>

            {/* Lampiran Foto */}
            {disposisi.surat_masuk?.has_photos && (
              <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-5 h-5 text-zinc-400" />
                  <h3 className="text-lg font-medium text-white">Lampiran Surat</h3>
                </div>
                <div className="flex flex-wrap gap-4">
                  {disposisi.surat_masuk.photos.map((photo, index) => {
                    const type = photo.type?.toLowerCase() || photo.filename?.split('.').pop()?.toLowerCase();
                    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(type);

                    return (
                      <div
                        key={photo.id}
                        className="relative group rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-white/30 transition-all duration-300 w-32 h-32"
                        onClick={() => openImageModal(photo.url)}
                      >
                         {isImage ? (
                          <img
                            src={photo.url}
                            alt={`Surat foto ${index + 1}`}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            loading="lazy"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/128x128?text=Error'; }}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-800 text-zinc-500 group-hover:text-white transition-colors">
                            <FileText className="w-8 h-8 mb-2" />
                            <span className="text-[10px] font-bold uppercase">{type}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Riwayat Feedback */}
            {feedbackList.length > 0 && (
              <div className="space-y-6 mt-10">
                <div className="flex items-center gap-3 px-2">
                   <div className="w-10 h-1 rounded-full bg-zinc-800"></div>
                   <h3 className="text-xl font-light text-white">Riwayat Feedback</h3>
                </div>
                
                {feedbackList.map((feedback) => (
                  <div key={feedback.id} className={`bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl p-6 md:p-8 transition-all duration-300 ${editingFeedbackId === feedback.id ? 'ring-1 ring-white/20' : 'hover:bg-zinc-900/50'}`}>
                    
                    {/* Header Feedback Item */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(feedback.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</span>
                        </div>
                         {feedback.updated_at && feedback.updated_at !== feedback.created_at && (
                            <div className="flex items-center gap-2 text-xs text-zinc-600">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Diperbarui: {new Date(feedback.updated_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                            </div>
                         )}
                      </div>

                      {!editingFeedbackId && !showFeedbackForm && (
                        <button
                          onClick={() => fetchFeedbackForEdit(feedback.id)}
                          className="p-2 rounded-xl bg-black/20 text-zinc-400 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/5"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Mode Edit */}
                    {editingFeedbackId === feedback.id ? (
                      <form onSubmit={handleEditFeedbackSubmit} className="space-y-6">
                        {feedbackError && (
                          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            {feedbackError}
                          </div>
                        )}
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Edit Catatan</label>
                           <textarea
                            name="notes"
                            value={editFeedbackData.notes}
                            onChange={handleEditFeedbackChange}
                            required
                            rows="4"
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-white/30"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Edit Status</label>
                          <div className="flex gap-4">
                            {['diproses', 'selesai'].map((statusOption) => (
                              <label key={statusOption} className="group cursor-pointer">
                                <input
                                  type="radio"
                                  name="status"
                                  value={statusOption}
                                  checked={editFeedbackData.status === statusOption}
                                  onChange={handleEditFeedbackChange}
                                  className="hidden"
                                />
                                <div className={`px-4 py-2 rounded-xl border transition-all text-sm font-medium capitalize flex items-center gap-2
                                  ${editFeedbackData.status === statusOption 
                                    ? 'bg-white text-black border-white' 
                                    : 'bg-zinc-800 text-zinc-500 border-white/5'}`}>
                                  {statusOption}
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* File Handling Logic for Edit (Simplified UI for brevity but fully functional) */}
                        {editFeedbackData.existingFiles.length > 0 && (
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">File Tersimpan</label>
                            <div className="space-y-2">
                               {editFeedbackData.existingFiles.map((file) => (
                                 <div key={file.id} className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5">
                                    <span className="text-sm text-zinc-300 truncate max-w-[200px]">{file.filename}</span>
                                    <button type="button" onClick={() => handleRemoveExistingFile(file.id)} className="text-red-400 hover:text-red-300 text-xs">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                 </div>
                               ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Tambah File Baru</label>
                           <input type="file" multiple onChange={handleEditFileChange} className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700"/>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button type="button" onClick={cancelEditFeedback} className="px-4 py-2 text-sm text-zinc-500 hover:text-white">Batal</button>
                          <button type="submit" disabled={editLoading} className="px-6 py-2 bg-white text-black rounded-xl text-sm font-bold hover:bg-zinc-200">
                             {editLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                          </button>
                        </div>
                      </form>
                    ) : (
                      /* Mode Tampilan Normal */
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           {getStatusBadge(feedback.disposisi?.status_dari_bawahan || 'diproses')}
                        </div>
                        <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap text-sm">
                          {feedback.notes}
                        </div>
                        
                        {feedback.has_files && (
                          <div className="pt-4 border-t border-white/5">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Lampiran ({feedback.file_count})</p>
                            <div className="flex flex-wrap gap-3">
                              {feedback.files.map((file) => (
                                <button
                                  key={file.id}
                                  onClick={() => openImageModal(file.url)}
                                  className="group relative flex items-center justify-center w-20 h-20 bg-black/20 rounded-xl border border-white/10 overflow-hidden hover:border-white/30 transition-all"
                                >
                                   {file.type && file.type.startsWith('image/') ? (
                                      <img src={file.url} alt="file" className="w-full h-full object-cover opacity-70 group-hover:opacity-100" />
                                   ) : (
                                      <FileText className="w-6 h-6 text-zinc-500 group-hover:text-white" />
                                   )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDisposisiDetail;