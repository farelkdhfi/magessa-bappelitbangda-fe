import React from 'react'
import StatusBadge from './StatusBadge';
import isImageFile from '../../utils/isImageFile';
import { AlertCircle, Calendar, Clock, FileText, Paperclip, User, Download, Eye } from 'lucide-react';

const FeedbackBawahan = ({
    disposisi,
    setSelectedImage,
    subFeedbackError,
    subFeedbackLoading,
    subordinateFeedback,
}) => {
    // Helper untuk format tanggal
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Jakarta'
        });
    };

    return (
        <div>
            {disposisi.diteruskan_kepada_user_id && (
                <div className="bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                    
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -z-10 transition-opacity opacity-50 group-hover:opacity-100" />

                    {/* Header Section */}
                    <div className="flex items-start gap-4 mb-6 border-b border-white/5 pb-6">
                        <div className="p-3 bg-zinc-800/50 rounded-2xl border border-white/5 text-zinc-400">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white tracking-wide">Feedback Bawahan</h3>
                            <p className="text-sm text-zinc-500 mt-1">
                                Tanggapan dari <span className="text-zinc-300 font-medium">{subordinateFeedback?.user_jabatan || subordinateFeedback?.disposisi?.diteruskan_kepada_jabatan || 'Bawahan'}</span>
                            </p>
                        </div>
                    </div>

                    {/* Content Logic */}
                    {subFeedbackLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <div className="w-8 h-8 border-2 border-zinc-600 border-t-zinc-200 rounded-full animate-spin"></div>
                            <span className="text-xs text-zinc-500 font-medium uppercase tracking-widest">Memuat Feedback...</span>
                        </div>
                    ) : subFeedbackError ? (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span className="text-sm font-medium leading-relaxed">{subFeedbackError}</span>
                        </div>
                    ) : !subordinateFeedback ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-white/5 rounded-xl bg-black/20">
                            <div className="p-3 rounded-full bg-zinc-800/50 text-zinc-500 mb-3">
                                <Clock className="w-6 h-6" />
                            </div>
                            <p className="text-zinc-400 text-sm font-medium">Belum ada respon</p>
                            <p className="text-zinc-600 text-xs mt-1">Bawahan belum memberikan feedback untuk disposisi ini.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            
                            {/* Metadata Row */}
                            <div className="flex flex-wrap gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-white/5 text-xs text-zinc-400">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{formatDate(subordinateFeedback.created_at)}</span>
                                </div>
                                
                                {subordinateFeedback.updated_at && subordinateFeedback.updated_at !== subordinateFeedback.created_at && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-white/5 text-xs text-zinc-400">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>Diupdate: {formatDate(subordinateFeedback.updated_at)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Status & Content */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status Pengerjaan:</span>
                                    <StatusBadge status={disposisi.status_dari_bawahan || 'diproses'} />
                                </div>

                                <div className="bg-black/20 border border-white/5 rounded-xl p-5">
                                    <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                                        {subordinateFeedback.notes}
                                    </p>
                                </div>

                                {/* Attachments Section */}
                                {subordinateFeedback.has_files && (
                                    <div className="space-y-3 pt-2">
                                        <div className="flex items-center gap-2 text-zinc-400">
                                            <Paperclip className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-widest">
                                                Lampiran ({subordinateFeedback.file_count})
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                            {subordinateFeedback.files.map((file) => {
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
                                                        {file.type && file.type.startsWith('image/') ? (
                                                            <>
                                                                <img
                                                                    src={file.url}
                                                                    alt={file.filename}
                                                                    className="w-full h-full object-cover opacity-80 group-hover/file:opacity-100 transition-opacity"
                                                                    loading="lazy"
                                                                />
                                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/file:opacity-100 transition-opacity flex items-center justify-center">
                                                                    <Eye className="w-6 h-6 text-white" />
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="w-full h-full flex flex-col items-center justify-center p-3 gap-2 group-hover/file:bg-zinc-800/50 transition-colors">
                                                                <div className="p-2 rounded-lg bg-zinc-800 border border-white/5">
                                                                    <FileText className="w-6 h-6 text-zinc-400" />
                                                                </div>
                                                                <p className="text-[10px] font-medium text-zinc-500 text-center break-all line-clamp-2 px-1">
                                                                    {file.filename}
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
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default FeedbackBawahan