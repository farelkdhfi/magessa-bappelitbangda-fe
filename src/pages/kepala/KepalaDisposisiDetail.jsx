import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    FileText,
    Calendar,
    Building,
    User,
    AlertCircle,
    Loader2,
    Download,
    Eye,
    MessageSquare,
    CheckCircle,
    Clock,
    File,
    Image as ImageIcon,
    ExternalLink,
    History,
    UserCircle,
    Loader,
    ShieldCheck,
    AlertTriangle,
    Info
} from 'lucide-react';
import { api } from '../../utils/api';
import LoadingSpinner from '../../components/Ui/LoadingSpinner';
import isImageFile from '../../utils/isImageFile';
import ImageModal from '../../components/Ui/ImageModal';

const KepalaDisposisiDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [disposisi, setDisposisi] = useState(null);
    const [feedback, setFeedback] = useState([]);
    const [statusLogs, setStatusLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingFeedback, setLoadingFeedback] = useState(true);
    const [loadingLogs, setLoadingLogs] = useState(true);
    const [error, setError] = useState(null);
    const [feedbackError, setFeedbackError] = useState(null);
    const [logsError, setLogsError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const fetchDisposisiDetail = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/disposisi/kepala/${id}`);
            setDisposisi(response.data.data);
        } catch (err) {
            console.error('Error fetching disposisi detail:', err);
            setError(err.response?.data?.error || 'Gagal memuat detail disposisi');
        } finally {
            setLoading(false);
        }
    };

    const fetchStatusLogs = async () => {
        try {
            setLoadingLogs(true);
            setLogsError(null);
            const response = await api.get(`/disposisi/logs/${id}`);
            setStatusLogs(response.data.data || []);
        } catch (err) {
            console.error('Error fetching status logs:', err);
            setLogsError(err.response?.data?.error || 'Gagal memuat riwayat status');
            setStatusLogs([]);
        } finally {
            setLoadingLogs(false);
        }
    };

    const fetchFeedback = async () => {
        try {
            setLoadingFeedback(true);
            setFeedbackError(null);
            const response = await api.get('/feedback-disposisi/kepala');

            const relatedFeedback = response.data.data.filter(feedback => {
                return feedback.disposisi_id === id || feedback.disposisi_id === parseInt(id);
            });

            setFeedback(relatedFeedback);
        } catch (err) {
            console.error('Error fetching feedback:', err);
            setFeedbackError(err.response?.data?.error || 'Gagal memuat feedback');
        } finally {
            setLoadingFeedback(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchDisposisiDetail();
            fetchFeedback();
            fetchStatusLogs();
        }
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDateOnly = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    // UI Helper: Styled Badges sesuai Design System
    const StatusBadge = ({ status }) => {
        const getStatusConfig = (status) => {
            switch (status?.toLowerCase()) {
                case 'diterima':
                case 'dibaca':
                    return { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: <Eye className="h-3 w-3" /> };
                case 'diproses':
                case 'dalam proses':
                    return { color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: <Clock className="h-3 w-3" /> };
                case 'selesai':
                    return { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: <CheckCircle className="h-3 w-3" /> };
                case 'diteruskan':
                    return { color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: <ExternalLink className="h-3 w-3" /> };
                case 'baru':
                case 'belum dibaca':
                    return { color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: <AlertCircle className="h-3 w-3" /> };
                default:
                    return { color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20', icon: <AlertCircle className="h-3 w-3" /> };
            }
        };

        const config = getStatusConfig(status);

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${config.color} backdrop-blur-sm`}>
                {config.icon}
                {status || 'Unknown'}
            </span>
        );
    };

    const SifatBadge = ({ sifat }) => {
        const getSifatColor = (sifat) => {
            switch (sifat) {
                case 'Sangat Segera': return 'bg-red-500/10 text-red-400 border-red-500/20';
                case 'Segera': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
                case 'Biasa': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
                case 'Rahasia': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
                default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
            }
        };

        return (
            <span className={`inline-flex items-center px-3 py-1.5 border rounded-full text-xs font-medium backdrop-blur-sm ${getSifatColor(sifat)}`}>
                {sifat}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner text='Memuat detail disposisi' />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen p-4 flex items-center justify-center">
                <div className="max-w-md w-full bg-zinc-900/50 backdrop-blur-sm border border-red-500/20 rounded-3xl p-8 text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-light text-white mb-2">Terjadi Kesalahan</h2>
                    <p className="text-zinc-500 text-sm mb-8">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full px-4 py-3 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold transition-all shadow-lg shadow-white/5"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white font-sans selection:bg-white/20 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* === HEADER SECTION === */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 text-zinc-500 hover:text-white mb-6 transition-colors text-sm font-medium px-4 py-2 rounded-xl hover:bg-white/5 w-fit"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Kembali
                    </button>

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 bg-zinc-900/30 border border-white/5 p-6 rounded-3xl backdrop-blur-sm">
                        <div className="space-y-2">
                             <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                                    <FileText className="w-5 h-5 text-zinc-400" />
                                </div>
                                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
                                    Detail Dokumen
                                </p>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white">
                                Disposisi <span className="font-semibold text-zinc-400">Surat Masuk</span>
                            </h1>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <SifatBadge sifat={disposisi?.sifat} />
                            <StatusBadge status={disposisi?.status} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* === LEFT COLUMN: INFO & CONTENT === */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* 1. Informasi Disposisi Card */}
                        <div className="bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl p-6 md:p-8">
                            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                <Info className="h-5 w-5 text-zinc-500" />
                                Informasi Utama
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Perihal</label>
                                    <div className="text-zinc-200 bg-black/20 p-4 rounded-2xl border border-white/5 leading-relaxed">
                                        {disposisi?.perihal || '-'}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Nomor Surat</label>
                                        <p className="text-white font-medium bg-zinc-900/50 px-4 py-3 rounded-xl border border-white/5">{disposisi?.nomor_surat || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Nomor Agenda</label>
                                        <p className="text-white font-medium bg-zinc-900/50 px-4 py-3 rounded-xl border border-white/5">{disposisi?.nomor_agenda || '-'}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Asal Instansi</label>
                                    <div className="flex items-center gap-3 bg-zinc-900/50 px-4 py-3 rounded-xl border border-white/5 text-zinc-300">
                                        <Building className="h-4 w-4 text-zinc-500" />
                                        {disposisi?.asal_instansi || '-'}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Tanggal Surat</label>
                                        <p className="text-zinc-300 flex items-center gap-2 bg-zinc-900/50 px-4 py-3 rounded-xl border border-white/5">
                                            <Calendar className="h-4 w-4 text-zinc-500" />
                                            {formatDateOnly(disposisi?.tanggal_surat)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Diterima Tanggal</label>
                                        <p className="text-zinc-300 flex items-center gap-2 bg-zinc-900/50 px-4 py-3 rounded-xl border border-white/5">
                                            <Calendar className="h-4 w-4 text-zinc-500" />
                                            {formatDateOnly(disposisi?.diterima_tanggal)}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Disposisi Kepada</label>
                                    <p className="text-white flex items-center gap-2 bg-zinc-900/50 px-4 py-3 rounded-xl border border-white/5">
                                        <User className="h-4 w-4 text-zinc-500" />
                                        {disposisi?.disposisi_kepada_jabatan || '-'}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Instruksi</label>
                                    <div className="text-zinc-300 bg-black/20 p-4 rounded-2xl border border-white/5">
                                        {disposisi?.dengan_hormat_harap || '-'}
                                    </div>
                                </div>

                                {disposisi?.catatan && (
                                    <div>
                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Catatan</label>
                                        <div className="text-zinc-300 bg-yellow-500/5 p-4 rounded-2xl border border-yellow-500/10">
                                            {disposisi.catatan}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 2. Lampiran Surat */}
                        {disposisi?.photos && disposisi.photos.length > 0 && (
                            <div className="bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl p-6 md:p-8">
                                <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5 text-zinc-500" />
                                    Lampiran Surat <span className="text-zinc-500 text-sm font-normal">({disposisi.photos.length})</span>
                                </h2>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {disposisi.photos.map((photo, index) => {
                                        const isImage = isImageFile(photo);
                                        return (
                                            <div
                                                key={photo.id}
                                                className="group cursor-pointer relative rounded-2xl overflow-hidden border border-white/5 bg-black/40 hover:border-white/20 transition-all duration-300"
                                                onClick={() => {
                                                    if (isImage) setSelectedImage(photo.url);
                                                    else window.open(photo.url, '_blank', 'noopener,noreferrer');
                                                }}
                                            >
                                                <div className="aspect-square flex items-center justify-center relative">
                                                    {isImage ? (
                                                        <>
                                                            <img
                                                                src={photo.url}
                                                                alt={`Lampiran ${index + 1}`}
                                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                                                onError={(e) => {
                                                                    e.target.src = 'https://via.placeholder.com/160x160/333/666?text=No+Img';
                                                                }}
                                                            />
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                                        </>
                                                    ) : (
                                                        <div className="text-zinc-500 group-hover:text-white transition-colors flex flex-col items-center p-2 text-center">
                                                            <FileText className="w-8 h-8 mb-2" />
                                                            <span className="text-[10px] font-bold uppercase tracking-wider truncate w-full px-2">
                                                                {photo.filename.split('.').pop() || 'FILE'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* 3. Feedback Section */}
                        <div className="bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl p-6 md:p-8">
                            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-zinc-500" />
                                Feedback Disposisi
                            </h2>

                            {loadingFeedback ? (
                                <div className="py-10">
                                    <LoadingSpinner text='Memuat feedback' />
                                </div>
                            ) : feedbackError ? (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3">
                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                    <p className="text-red-400 text-sm">{feedbackError}</p>
                                </div>
                            ) : feedback.length === 0 ? (
                                <div className="text-center py-12 border border-dashed border-white/5 rounded-2xl bg-white/[0.02]">
                                    <MessageSquare className="h-8 w-8 text-zinc-600 mx-auto mb-3" />
                                    <p className="text-zinc-500 text-sm">Belum ada feedback untuk disposisi ini</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {feedback.map((item) => (
                                        <div key={item.id} className="bg-zinc-950/50 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 border border-white/5">
                                                        <UserCircle className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-white text-sm">{item.user_name || 'Unknown'}</p>
                                                        <p className="text-xs text-zinc-500">{item.user_jabatan || 'Unknown'}</p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-zinc-600 font-medium bg-white/5 px-2 py-1 rounded-lg">
                                                    {formatDate(item.created_at)}
                                                </span>
                                            </div>

                                            <div className="text-zinc-300 text-sm leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5 mb-4">
                                                {item.notes || 'Tidak ada catatan'}
                                            </div>

                                            {item.files && item.files.length > 0 && (
                                                <div className="mt-4">
                                                    <label className="block text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3">
                                                        Lampiran ({item.files.length})
                                                    </label>
                                                    <div className="flex flex-wrap gap-3">
                                                        {item.files.map((file) => {
                                                            const cleanUrl = file.url?.trim();
                                                            const isImage = isImageFile(file);
                                                            return (
                                                                <div
                                                                    key={file.id}
                                                                    className="w-16 h-16 rounded-xl overflow-hidden border border-white/5 bg-zinc-900 cursor-pointer hover:border-white/20 transition-all"
                                                                    onClick={() => {
                                                                        if (isImage) setSelectedImage(cleanUrl);
                                                                        else window.open(cleanUrl, '_blank', 'noopener,noreferrer');
                                                                    }}
                                                                >
                                                                    {isImage ? (
                                                                        <img src={cleanUrl} alt="File" className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity" />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-zinc-500">
                                                                            <FileText className="w-6 h-6" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* === RIGHT COLUMN: LOGS === */}
                    <div className="lg:col-span-1">
                        <div className="bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl p-6 sticky top-6">
                            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                <History className="h-5 w-5 text-zinc-500" />
                                Riwayat Status
                            </h2>

                            {loadingLogs ? (
                                <div className="py-10">
                                    <LoadingSpinner text='Memuat logs' />
                                </div>
                            ) : logsError ? (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                                    <p className="text-red-400 text-xs">{logsError}</p>
                                </div>
                            ) : statusLogs.length === 0 ? (
                                <div className="text-center py-10">
                                    <p className="text-zinc-500 text-sm">Belum ada riwayat</p>
                                </div>
                            ) : (
                                <div className="relative pl-2">
                                    {/* Vertical Line */}
                                    <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/10"></div>

                                    <div className="space-y-8">
                                        {statusLogs.map((log) => (
                                            <div key={log.id} className="relative pl-8">
                                                {/* Dot */}
                                                <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-zinc-950 border border-zinc-700 flex items-center justify-center z-10">
                                                    <div className="w-2 h-2 rounded-full bg-white/50"></div>
                                                </div>

                                                <div className="bg-black/20 rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <StatusBadge status={log.status} />
                                                    </div>

                                                    {log.keterangan && (
                                                        <p className="text-sm text-zinc-300 mb-3 leading-relaxed">
                                                            {log.keterangan}
                                                        </p>
                                                    )}

                                                    <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-medium uppercase tracking-wider">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(log.timestamp).toLocaleDateString('id-ID', {
                                                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            <ImageModal
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
            />
        </div>
    );
};

export default KepalaDisposisiDetail;