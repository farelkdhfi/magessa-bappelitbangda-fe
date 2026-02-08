import React from 'react';
import StatusBadge from './StatusBadge';
import { 
    AlertCircle, 
    Calendar, 
    Clock, 
    Edit, 
    FileText, 
    MessageSquare, 
    Paperclip, 
    Save, 
    Trash2, 
    X,
    CheckCircle2,
    ImageIcon
} from 'lucide-react';
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
    // Helper untuk Radio Button Style
    const RadioOption = ({ label, value, checked, onChange }) => (
        <label className={`
            flex-1 relative flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all duration-300
            ${checked 
                ? 'bg-teal-500/10 border-teal-500/50 text-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.15)]' 
                : 'bg-zinc-900/50 border-white/5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
            }
        `}>
            <input
                type="radio"
                name="status"
                value={value}
                checked={checked}
                onChange={onChange}
                className="sr-only" // Sembunyikan radio default
            />
            <div className="flex items-center gap-2">
                {checked && <CheckCircle2 className="w-4 h-4" />}
                <span className="text-sm font-medium">{label}</span>
            </div>
        </label>
    );

    return (
        <div>
            {feedbackList.length > 0 && (
                <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 md:p-8 relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

                    {/* Header Section */}
                    <div className="flex items-center gap-4 mb-8 relative z-10">
                        <div className="p-3 bg-zinc-800/50 rounded-2xl border border-white/5 text-teal-400 shadow-inner">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white tracking-tight">Feedback Terkirim</h3>
                            <p className="text-sm text-zinc-500">Riwayat tanggapan yang telah Anda berikan</p>
                        </div>
                    </div>

                    <div className="space-y-4 relative z-10">
                        {feedbackList.map((feedback) => (
                            <div key={feedback.id} className="group bg-black/20 hover:bg-black/40 border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all duration-300">
                                
                                {/* Header Item Feedback */}
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                                    <div className="space-y-1">
                                        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-500">
                                            <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                                                {new Date(feedback.created_at).toLocaleString('id-ID', {
                                                    day: 'numeric', month: 'short', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit',
                                                    timeZone: 'Asia/Jakarta'
                                                })}
                                            </div>
                                            
                                            {feedback.updated_at && feedback.updated_at !== feedback.created_at && (
                                                <div className="flex items-center gap-1.5 text-teal-500/70">
                                                    <Clock className="w-3 h-3" />
                                                    <span>Diedit: {new Date(feedback.updated_at).toLocaleDateString('id-ID')}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {!editingFeedbackId && !showFeedbackForm && !showForwardModal && (
                                        <button
                                            onClick={() => fetchFeedbackForEdit(feedback.id)}
                                            disabled={editLoading}
                                            className="self-start px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-white hover:text-black text-zinc-400 text-xs font-semibold transition-all flex items-center gap-2 border border-white/5 disabled:opacity-50"
                                        >
                                            {editLoading ? (
                                                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Edit className="w-3.5 h-3.5" />
                                            )}
                                            Edit
                                        </button>
                                    )}
                                </div>

                                {/* EDIT MODE */}
                                {editingFeedbackId === feedback.id ? (
                                    <div className="bg-zinc-900/50 rounded-xl border border-white/5 p-4 sm:p-6 animate-in fade-in zoom-in-95 duration-200">
                                        {feedbackError && (
                                            <div className="mb-4 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                                <span>{feedbackError}</span>
                                            </div>
                                        )}
                                        
                                        <form onSubmit={handleEditFeedbackSubmit} className="space-y-5">
                                            {/* Textarea */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                                                    Catatan Feedback <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    name="notes"
                                                    value={editFeedbackData.notes}
                                                    onChange={handleEditFeedbackChange}
                                                    required
                                                    rows="5"
                                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-teal-500/50 focus:bg-black/60 text-white placeholder-zinc-600 resize-none transition-all text-sm leading-relaxed"
                                                    placeholder="Tuliskan feedback Anda..."
                                                />
                                            </div>

                                            {/* Status Radio */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                                                    Update Status <span className="text-red-500">*</span>
                                                </label>
                                                <div className="flex gap-3">
                                                    <RadioOption 
                                                        label="Diproses" 
                                                        value="diproses" 
                                                        checked={editFeedbackData.status === 'diproses'} 
                                                        onChange={handleEditFeedbackChange} 
                                                    />
                                                    <RadioOption 
                                                        label="Selesai" 
                                                        value="selesai" 
                                                        checked={editFeedbackData.status === 'selesai'} 
                                                        onChange={handleEditFeedbackChange} 
                                                    />
                                                </div>
                                            </div>

                                            {/* Existing Files */}
                                            {editFeedbackData.existingFiles.length > 0 && (
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                                                        File Tersimpan
                                                    </label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {editFeedbackData.existingFiles.map((file) => (
                                                            <div key={file.id} className="flex items-center justify-between bg-zinc-800/40 p-2.5 rounded-lg border border-white/5">
                                                                <div className="flex items-center overflow-hidden">
                                                                    <div className="p-1.5 bg-zinc-700/50 rounded-md mr-3">
                                                                        <FileText className="w-3.5 h-3.5 text-zinc-300" />
                                                                    </div>
                                                                    <span className="text-xs text-zinc-300 truncate max-w-[120px]">{file.filename}</span>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveExistingFile(file.id)}
                                                                    className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Upload New Files */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                                                    Upload Baru (Max 5)
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        multiple
                                                        onChange={handleEditFileChange}
                                                        accept="image/*,application/pdf"
                                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm text-zinc-400 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer focus:outline-none"
                                                    />
                                                </div>
                                                {editFeedbackData.newFiles.length > 0 && (
                                                    <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20">
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
                                                    className="px-5 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 font-medium text-sm transition-colors"
                                                >
                                                    Batal
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={editLoading}
                                                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold text-sm transition-all shadow-lg shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {editLoading ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                                            <span>Menyimpan...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="w-4 h-4" />
                                                            <span>Simpan Perubahan</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    /* VIEW MODE */
                                    <div className="space-y-5">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-zinc-900 border border-white/10 px-4 py-3 rounded-xl w-full">
                                                <p className="whitespace-pre-wrap leading-relaxed text-zinc-300 text-sm">
                                                    {feedback.notes}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                                                Status:
                                                <div className="normal-case tracking-normal">
                                                    <StatusBadge status={feedback.disposisi?.status || 'diproses'} />
                                                </div>
                                            </div>
                                        </div>

                                        {feedback.has_files && (
                                            <div className="space-y-3 pt-2 border-t border-white/5">
                                                <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                                                    <Paperclip className="w-3.5 h-3.5" />
                                                    Lampiran ({feedback.file_count})
                                                </div>
                                                
                                                <div className="flex flex-wrap gap-3">
                                                    {feedback.files.map((file, index) => {
                                                        const isImage = isImageFile(file);
                                                        return (
                                                            <div
                                                                key={file.id}
                                                                onClick={() => isImage ? setSelectedImage(file.url) : window.open(file.url, '_blank', 'noopener,noreferrer')}
                                                                className="relative group/file cursor-pointer w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-black/40 hover:border-white/30 transition-all duration-300"
                                                            >
                                                                {isImage ? (
                                                                    <>
                                                                        <img
                                                                            src={file.url}
                                                                            alt={`File ${index + 1}`}
                                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover/file:scale-110"
                                                                            onError={(e) => {
                                                                                e.target.style.display = 'none';
                                                                                e.target.nextSibling.style.display = 'flex';
                                                                            }}
                                                                        />
                                                                        <div className="hidden absolute inset-0 bg-zinc-900 flex items-center justify-center">
                                                                            <ImageIcon className="w-6 h-6 text-zinc-600" />
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <div className="w-full h-full flex flex-col items-center justify-center p-2 text-zinc-500 hover:text-white transition-colors">
                                                                        <FileText className="w-6 h-6 mb-1" />
                                                                        <span className="text-[9px] font-bold uppercase truncate max-w-full">
                                                                            {file.filename.split('.').pop()}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                
                                                                {/* Hover Overlay */}
                                                                <div className="absolute inset-0 bg-black/0 group-hover/file:bg-black/20 transition-colors" />
                                                            </div>
                                                        );
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
    );
}

export default MyFeedback;