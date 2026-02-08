import React from 'react'
import StatusBadge from './StatusBadge';
import { AlertCircle, Calendar, Clock, Edit, FileText, MessageSquare, Paperclip, Save, Trash2, X, Download, Eye, CheckCircle2, Circle } from 'lucide-react';
import isImageFile from '../../utils/isImageFile';

const MyFeedback = ({
    feedbackList,
    editFeedbackData,
    editingFeedbackId,
    editLoading,
    showFeedbackForm,
    showForwardModal,
    fetchFeedbackForEdit,
    feedbackError,
    handleEditFeedbackChange,
    handleEditFeedbackSubmit,
    handleEditFileChange,
    handleRemoveExistingFile,
    cancelEditFeedback,
    setSelectedImage
}) => {
    
    // Helper untuk format tanggal
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
            timeZone: 'Asia/Jakarta'
        });
    };

    return (
        <div>
            {feedbackList.length > 0 && (
                <div className="bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-800/20 rounded-full blur-3xl -z-10 pointer-events-none" />

                    {/* Header Section */}
                    <div className="flex items-start gap-4 mb-8 border-b border-white/5 pb-6">
                        <div className="p-3 bg-zinc-800/50 rounded-2xl border border-white/5 text-zinc-400">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white tracking-wide">Riwayat Feedback</h3>
                            <p className="text-sm text-zinc-500 mt-1">
                                Daftar tanggapan dan update status yang telah Anda kirimkan.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {feedbackList.map((feedback) => (
                            <div key={feedback.id} className="bg-black/20 rounded-2xl p-6 border border-white/5 transition-all hover:border-white/10">
                                
                                {/* Header Item: Tanggal & Edit Button */}
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                                    <div className="flex flex-wrap gap-2">
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-white/5 text-xs text-zinc-400">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>{formatDate(feedback.created_at)}</span>
                                        </div>
                                        {feedback.updated_at && feedback.updated_at !== feedback.created_at && (
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-white/5 text-xs text-zinc-400">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>Diedit: {formatDate(feedback.updated_at)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {!editingFeedbackId && !showFeedbackForm && !showForwardModal && (
                                        <button
                                            onClick={() => fetchFeedbackForEdit(feedback.id)}
                                            disabled={editLoading}
                                            className="group flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium transition-all border border-white/5"
                                        >
                                            {editLoading ? (
                                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <Edit className="w-3.5 h-3.5 group-hover:text-white" />
                                            )}
                                            <span>Edit</span>
                                        </button>
                                    )}
                                </div>

                                {/* === LOGIKA TAMPILAN (VIEW VS EDIT) === */}
                                
                                {editingFeedbackId === feedback.id ? (
                                    /* --- MODE EDIT --- */
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        
                                        {feedbackError && (
                                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-start gap-3">
                                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm font-medium">{feedbackError}</span>
                                            </div>
                                        )}

                                        <form onSubmit={handleEditFeedbackSubmit} className="space-y-6">
                                            {/* Edit Notes */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                                                    Catatan Feedback
                                                </label>
                                                <textarea
                                                    name="notes"
                                                    value={editFeedbackData.notes}
                                                    onChange={handleEditFeedbackChange}
                                                    required
                                                    rows="5"
                                                    className="w-full px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 focus:bg-black/40 text-zinc-200 placeholder-zinc-600 resize-none transition-all text-sm"
                                                    placeholder="Edit catatan..."
                                                />
                                            </div>

                                            {/* Edit Status */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                                                    Status
                                                </label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {['diproses', 'selesai'].map((statusOption) => (
                                                        <label key={statusOption} className={`relative flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                                                            editFeedbackData.status === statusOption 
                                                            ? statusOption === 'selesai' ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-blue-500/10 border-blue-500/50' 
                                                            : 'bg-zinc-900/50 border-white/5 hover:bg-zinc-800'
                                                        }`}>
                                                            <input
                                                                type="radio"
                                                                name="status"
                                                                value={statusOption}
                                                                checked={editFeedbackData.status === statusOption}
                                                                onChange={handleEditFeedbackChange}
                                                                className="sr-only"
                                                            />
                                                            <div className={`mr-2 ${editFeedbackData.status === statusOption ? (statusOption === 'selesai' ? 'text-emerald-400' : 'text-blue-400') : 'text-zinc-600'}`}>
                                                                {editFeedbackData.status === statusOption ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                                                            </div>
                                                            <span className={`text-sm font-bold capitalize ${editFeedbackData.status === statusOption ? 'text-white' : 'text-zinc-400'}`}>{statusOption}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Edit Files: Existing */}
                                            {editFeedbackData.existingFiles.length > 0 && (
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                                                        File Tersimpan
                                                    </label>
                                                    <div className="grid gap-2">
                                                        {editFeedbackData.existingFiles.map((file) => (
                                                            <div key={file.id} className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                                                                <div className="flex items-center gap-3 overflow-hidden">
                                                                    <div className="p-2 bg-zinc-800 rounded-lg shrink-0">
                                                                        <FileText className="w-4 h-4 text-zinc-400" />
                                                                    </div>
                                                                    <span className="text-sm text-zinc-300 truncate">{file.filename}</span>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveExistingFile(file.id)}
                                                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Edit Files: Add New */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                                                    Upload File Baru
                                                </label>
                                                <input
                                                    type="file"
                                                    multiple
                                                    onChange={handleEditFileChange}
                                                    accept="image/*,application/pdf"
                                                    className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700 cursor-pointer bg-zinc-900/50 border border-white/10 rounded-xl p-1"
                                                />
                                                {editFeedbackData.newFiles.length > 0 && (
                                                    <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20 w-fit">
                                                        <Paperclip className="w-3.5 h-3.5" />
                                                        <span>{editFeedbackData.newFiles.length} file baru dipilih</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                                                <button
                                                    type="button"
                                                    onClick={cancelEditFeedback}
                                                    className="px-5 py-2 rounded-xl text-sm font-semibold text-zinc-500 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Batal
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={editLoading}
                                                    className={`
                                                        flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-sm transition-all shadow-lg shadow-white/5
                                                        ${editLoading ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-white text-black hover:bg-zinc-200'}
                                                    `}
                                                >
                                                    {editLoading ? <div className="w-4 h-4 border-2 border-zinc-500 border-t-zinc-900 rounded-full animate-spin"/> : <Save className="w-4 h-4" />}
                                                    <span>Simpan Perubahan</span>
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    /* --- MODE VIEW (NORMAL) --- */
                                    <div className="space-y-5">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status:</span>
                                            <StatusBadge status={feedback.disposisi?.status || 'diproses'} />
                                        </div>
                                        
                                        <div className="bg-zinc-900/30 border border-white/5 rounded-xl p-5">
                                            <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                                                {feedback.notes}
                                            </p>
                                        </div>

                                        {/* Attachments View */}
                                        {feedback.has_files && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-zinc-400">
                                                    <Paperclip className="w-4 h-4" />
                                                    <span className="text-xs font-bold uppercase tracking-widest">
                                                        Lampiran ({feedback.file_count})
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                    {feedback.files.map((file, index) => {
                                                        const isImage = isImageFile(file);
                                                        return (
                                                            <div 
                                                                key={file.id} 
                                                                className="group/file relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/40 hover:border-white/30 transition-all cursor-pointer"
                                                                onClick={() => {
                                                                    if (isImage) {
                                                                        setSelectedImage(file.url);
                                                                    } else {
                                                                        window.open(file.url, '_blank', 'noopener,noreferrer');
                                                                    }
                                                                }}
                                                            >
                                                                {isImage ? (
                                                                    <>
                                                                        <img
                                                                            src={file.url}
                                                                            alt={`File ${index + 1}`}
                                                                            className="w-full h-full object-cover opacity-80 group-hover/file:opacity-100 transition-opacity"
                                                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/160x160?text=Error'; }}
                                                                        />
                                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/file:opacity-100 transition-opacity flex items-center justify-center">
                                                                            <Eye className="w-6 h-6 text-white" />
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <div className="w-full h-full flex flex-col items-center justify-center p-3 gap-2 group-hover/file:bg-zinc-800/50 transition-colors">
                                                                        <FileText className="w-8 h-8 text-zinc-500" />
                                                                        <p className="text-[10px] font-bold text-zinc-500 text-center uppercase truncate w-full">
                                                                            {file.filename.split('.').pop()}
                                                                        </p>
                                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/file:opacity-100 transition-opacity flex items-center justify-center">
                                                                            <Download className="w-6 h-6 text-white" />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyFeedback;