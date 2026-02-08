import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // <--- 1. IMPORT INI WAJIB
import { useNavigate } from 'react-router-dom';
import { FileText, X, CheckCircle, Download, Calendar, User, Building2, Trash2, AlertTriangle, RefreshCcw, ArrowUpRight, ChevronRight, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';

const SuratMasukTerbaru = () => {
    const [suratData, setSuratData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedSurat, setSelectedSurat] = useState(null);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, suratId: null, suratInfo: null });

    const navigate = useNavigate();

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            setError('');
            const suratResponse = await api.get('/surat-masuk');
            setSuratData(suratResponse.data?.data || []);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Gagal memuat data');
            toast.error('Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // --- NEW STYLING SYSTEM ---

    const getStatusBadge = (status) => {
        const isProcessed = status === 'processed' || status === 'sudah dibaca';
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                isProcessed 
                ? 'bg-white text-black border-white' 
                : 'bg-zinc-800 text-zinc-400 border-zinc-700'
            }`}>
                {isProcessed ? 'Selesai' : 'Pending'}
            </span>
        );
    };

    const btnSecondary = "px-4 py-2 rounded-xl text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 hover:text-white transition-all duration-300";
    const btnPrimary = "px-4 py-2 rounded-xl text-xs font-bold bg-white text-black hover:bg-zinc-200 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)]";
    const btnDanger = "px-4 py-2 rounded-xl text-xs font-bold bg-zinc-900 text-rose-500 border border-rose-900/30 hover:bg-rose-950/30 hover:border-rose-500/50 transition-all duration-300";

    const handleDownloadPDF = async (suratId, nomorSurat) => {
        setIsDownloading(true);
        setDownloadProgress(0);
        try {
            const response = await api.get(`/surat/${suratId}/pdf`, {
                responseType: 'blob',
                onDownloadProgress: (progressEvent) => {
                    const total = progressEvent.total;
                    const current = progressEvent.loaded;
                    if (total) setDownloadProgress(Math.round((current / total) * 100));
                }
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `disposisi-${nomorSurat || suratId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success('PDF berhasil diunduh!');
        } catch (err) {
            toast.error('Gagal mengunduh PDF');
        } finally {
            setIsDownloading(false);
            setDownloadProgress(0);
        }
    };

    const handleConfirmDelete = async (id) => {
        try {
            await api.delete(`/surat-masuk/${id}`);
            toast.success('Surat dihapus');
            setDeleteModal({ isOpen: false, suratId: null, suratInfo: null });
            fetchAllData();
        } catch (error) {
            toast.error('Gagal menghapus');
        }
    };

    const displayedSuratData = suratData.slice(0, 5);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span className="text-xs text-zinc-500 uppercase tracking-widest animate-pulse">Memuat Data...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center py-16 text-center">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
                    <AlertTriangle className='w-6 h-6 text-red-500' />
                </div>
                <p className='text-zinc-400 text-sm mb-4'>Gagal terhubung ke server</p>
                <button onClick={fetchAllData} className={btnSecondary}>
                    <RefreshCcw className='w-3 h-3 inline mr-2' /> Reload
                </button>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Header List */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                        <FileText className="w-4 h-4 text-zinc-400" />
                    </div>
                    <span className="text-sm font-medium text-zinc-300">Daftar Terbaru</span>
                </div>
                {/* Search dummy to look cool */}
                <div className="hidden md:flex items-center px-3 py-1.5 bg-zinc-900 rounded-full border border-white/5">
                    <Search className="w-3 h-3 text-zinc-600 mr-2" />
                    <span className="text-[10px] text-zinc-600">Search archives...</span>
                </div>
            </div>

            {/* Table Content */}
            <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Instansi</th>
                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Tujuan</th>
                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Status</th>
                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Tanggal</th>
                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-zinc-500 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {displayedSuratData.map((surat) => (
                            <tr key={surat.id} className="group hover:bg-white/[0.02] transition-colors duration-300">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-white/20 transition-all">
                                            <Building2 className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-sm text-zinc-300 font-medium group-hover:text-white transition-colors">
                                            {surat.asal_instansi}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs text-zinc-400 capitalize">
                                        {surat.tujuan_jabatan?.replace(/-/g, ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(surat.status)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs text-zinc-500 font-mono">
                                        {formatDate(surat.created_at)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => setSelectedSurat(surat)}
                                            className="p-2 hover:bg-white text-zinc-400 hover:text-black rounded-lg transition-all duration-300"
                                            title="Detail"
                                        >
                                            <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => setDeleteModal({ isOpen: true, suratId: surat.id, suratInfo: surat })}
                                            className="p-2 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-500 rounded-lg transition-all duration-300"
                                            title="Hapus"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer / Empty State */}
            {suratData.length > 5 && (
                <div className="px-6 py-4 border-t border-white/5 flex justify-center">
                    <button 
                        onClick={() => navigate('/admin-daftar-surat-masuk')}
                        className="text-xs text-zinc-500 hover:text-white flex items-center gap-2 transition-colors uppercase tracking-widest"
                    >
                        View All Archives <ChevronRight className="w-3 h-3" />
                    </button>
                </div>
            )}

            {suratData.length === 0 && (
                <div className="text-center py-12">
                    <div className="inline-block p-4 rounded-full bg-zinc-900/50 border border-white/5 mb-3">
                        <FileText className="w-6 h-6 text-zinc-600" />
                    </div>
                    <p className="text-zinc-500 text-sm">No archives found.</p>
                </div>
            )}

            {/* --- MODALS DI BAWAH INI MENGGUNAKAN PORTAL --- */}

            {/* 1. Delete Confirmation Modal (Dark Glass) */}
            {deleteModal.isOpen && createPortal(
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
                    <div className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl shadow-black/50 animate-in fade-in zoom-in duration-200">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="w-8 h-8 text-rose-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Hapus Data?</h3>
                            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                                Data dari <span className="text-white font-medium">{deleteModal.suratInfo?.asal_instansi}</span> akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button onClick={() => setDeleteModal({ isOpen: false, suratId: null, suratInfo: null })} className={btnSecondary}>
                                    Batal
                                </button>
                                <button onClick={() => handleConfirmDelete(deleteModal.suratId)} className={btnDanger}>
                                    Hapus Permanen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* 2. Detail Modal (Dossier Style) */}
            {selectedSurat && createPortal(
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
                    <div className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
                        
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-zinc-950/90 backdrop-blur-md border-b border-white/5 p-6 flex items-center justify-between z-10">
                            <div>
                                <h2 className="text-xl font-semibold text-white tracking-tight">Detail Dokumen</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
                                    <span className="text-xs text-zinc-400 font-mono uppercase">ID: {selectedSurat.id.substring(0,8)}...</span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedSurat(null)} className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-8">
                            
                            {/* Status Section */}
                            <div className="flex justify-between items-center p-4 rounded-2xl bg-zinc-900/50 border border-white/5">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Status Dokumen</span>
                                    {getStatusBadge(selectedSurat.status)}
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Tanggal Masuk</span>
                                    <span className="text-sm text-white font-mono">{formatDate(selectedSurat.created_at)}</span>
                                </div>
                            </div>

                            {/* Main Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest text-zinc-500">Nomor Surat</label>
                                    <div className="text-base text-white font-medium border-b border-white/10 pb-2">
                                        {selectedSurat.nomor_surat || <span className="text-zinc-600 italic">Belum digenerate</span>}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest text-zinc-500">Asal Instansi</label>
                                    <div className="text-base text-white font-medium border-b border-white/10 pb-2">
                                        {selectedSurat.asal_instansi}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest text-zinc-500">Tujuan</label>
                                    <div className="text-base text-white font-medium border-b border-white/10 pb-2 capitalize">
                                        {selectedSurat.tujuan_jabatan?.replace(/-/g, ' ')}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest text-zinc-500">Keterangan</label>
                                    <div className="text-sm text-zinc-300 border-b border-white/10 pb-2">
                                        {selectedSurat.keterangan || "-"}
                                    </div>
                                </div>
                            </div>

                            {/* Processing Logic Display */}
                            {selectedSurat.processed_at && (
                                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        <h4 className="text-sm font-semibold text-white">Log Pemrosesan</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-xs">
                                        <div>
                                            <p className="text-zinc-500">Diproses Oleh</p>
                                            <p className="text-white font-medium mt-1">{selectedSurat.processed_user?.name}</p>
                                            <p className="text-zinc-500 text-[10px]">{selectedSurat.processed_user?.jabatan}</p>
                                        </div>
                                        <div>
                                            <p className="text-zinc-500">Waktu</p>
                                            <p className="text-white font-mono mt-1">{formatDate(selectedSurat.processed_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                             {/* Disposisi & Catatan */}
                             {(selectedSurat.disposisi_kepada || selectedSurat.catatan) && (
                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    {selectedSurat.disposisi_kepada && (
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest text-zinc-500">Disposisi Kepada</label>
                                            <p className="text-sm text-white bg-zinc-900 p-3 rounded-xl border border-white/5">
                                                {selectedSurat.disposisi_kepada}
                                            </p>
                                        </div>
                                    )}
                                    {selectedSurat.catatan && (
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest text-zinc-500">Catatan Tambahan</label>
                                            <p className="text-sm text-zinc-400 italic">"{selectedSurat.catatan}"</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-zinc-950/90 backdrop-blur-md border-t border-white/5 p-6 flex justify-end gap-3 z-10">
                            <button onClick={() => setSelectedSurat(null)} className={btnSecondary}>
                                Tutup
                            </button>
                            {selectedSurat.status === 'processed' && (
                                <button 
                                    onClick={() => handleDownloadPDF(selectedSurat.id, selectedSurat.nomor_surat)}
                                    disabled={isDownloading}
                                    className={btnPrimary}
                                >
                                    {isDownloading ? (
                                        <span className="flex items-center gap-2">Processing {downloadProgress}%</span>
                                    ) : (
                                        <span className="flex items-center gap-2"><Download className="w-3.5 h-3.5" /> Unduh PDF</span>
                                    )}
                                </button>
                            )}
                        </div>

                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default SuratMasukTerbaru;