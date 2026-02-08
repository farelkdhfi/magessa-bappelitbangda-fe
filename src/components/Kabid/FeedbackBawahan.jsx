import React from 'react'
import StatusBadge from './StatusBadge';
import isImageFile from '../../utils/isImageFile';
import { AlertCircle, Calendar, Clock, FileText, Paperclip, User, Download } from 'lucide-react';

const FeedbackBawahan = ({
    disposisi,
    setSelectedImage,
    subFeedbackError,
    subFeedbackLoading,
    subordinateFeedback,
}) => {
    return (
        <div className="w-full">
            {disposisi.diteruskan_kepada_user_id && (
                <div className="group relative bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all duration-500 overflow-hidden">
                    
                    {/* Background Glow Effect (Konsisten dengan StatCard) */}
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors duration-500 pointer-events-none" />

                    {/* Header Section */}
                    <div className="relative z-10 mb-8">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-zinc-800/50 rounded-2xl border border-white/5 text-zinc-400">
                                <User className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-light text-white tracking-tight">Feedback dari Bawahan</h3>
                                <p className="text-xs text-zinc-500 mt-1 font-medium">Tanggapan dari bawahan yang dituju disposisi</p>
                            </div>
                        </div>
                    </div>

                    {/* Content Logic */}
                    <div className="relative z-10">
                        {subFeedbackLoading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white/20 border-t-white"></div>
                            </div>
                        ) : subFeedbackError ? (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm font-medium">{subFeedbackError}</span>
                            </div>
                        ) : !subordinateFeedback ? (
                            <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                                <p className="text-zinc-500 text-sm">Belum ada feedback dari bawahan atau bawahan belum memberikan feedback.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Meta Information Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Kolom Kiri: User & Tanggal */}
                                    <div className="space-y-3">
                                        <div className="bg-black/20 border border-white/5 rounded-xl p-3 flex items-center gap-3">
                                            <div className="p-1.5 bg-white/5 rounded-lg">
                                                <User className="w-3.5 h-3.5 text-zinc-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Oleh</p>
                                                <p className="text-sm text-zinc-200 font-medium">
                                                    {subordinateFeedback.user_jabatan || subordinateFeedback.disposisi?.diteruskan_kepada_jabatan || 'Bawahan'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-black/20 border border-white/5 rounded-xl p-3 flex items-center gap-3">
                                            <div className="p-1.5 bg-white/5 rounded-lg">
                                                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Dibuat</p>
                                                <p className="text-sm text-zinc-200">
                                                    {new Date(subordinateFeedback.created_at).toLocaleString('id-ID', {
                                                        day: 'numeric', month: 'long', year: 'numeric',
                                                        hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Kolom Kanan: Status & Update */}
                                    <div className="space-y-3">
                                        <div className="bg-black/20 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 bg-white/5 rounded-lg">
                                                    <AlertCircle className="w-3.5 h-3.5 text-zinc-400" />
                                                </div>
                                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</p>
                                            </div>
                                            <div className="transform scale-90 origin-right">
                                                <StatusBadge status={disposisi.status_dari_bawahan || 'diproses'} />
                                            </div>
                                        </div>

                                        {subordinateFeedback.updated_at && subordinateFeedback.updated_at !== subordinateFeedback.created_at && (
                                            <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 flex items-center gap-3">
                                                <Clock className="w-3.5 h-3.5 text-amber-500/70" />
                                                <p className="text-xs text-amber-500/80">
                                                    Diperbarui: {new Date(subordinateFeedback.updated_at).toLocaleString('id-ID', {
                                                        day: 'numeric', month: 'long', year: 'numeric',
                                                        hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta'
                                                    })}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Content Body: Notes */}
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Catatan / Pesan</p>
                                    <div className="bg-black/40 border border-white/5 p-5 rounded-2xl shadow-inner">
                                        <p className="whitespace-pre-wrap leading-relaxed text-zinc-300 text-sm font-light">
                                            {subordinateFeedback.notes}
                                        </p>
                                    </div>
                                </div>

                                {/* Files Section */}
                                {subordinateFeedback.has_files && (
                                    <div className="pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Paperclip className="w-4 h-4 text-zinc-500" />
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                                Lampiran ({subordinateFeedback.file_count} file)
                                            </p>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                            {subordinateFeedback.files.map((file) => {
                                                const isImage = isImageFile(file);
                                                return (
                                                    <div key={file.id} className="group/file relative aspect-square bg-black/40 rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 overflow-hidden cursor-pointer">
                                                        <button
                                                            onClick={() => {
                                                                if (isImage) {
                                                                    setSelectedImage(file.url);
                                                                } else {
                                                                    window.open(file.url, '_blank', 'noopener,noreferrer');
                                                                }
                                                            }}
                                                            className="w-full h-full flex flex-col items-center justify-center relative"
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
                                                                        <div className="p-2 bg-black/50 backdrop-blur-sm rounded-full border border-white/20">
                                                                            <Download className="w-4 h-4 text-white" />
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="flex flex-col items-center justify-center p-4 text-center h-full w-full hover:bg-white/5 transition-colors">
                                                                    <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center mb-2 border border-white/5 group-hover/file:border-white/20 group-hover/file:bg-zinc-700 transition-all">
                                                                        <FileText className="w-5 h-5 text-zinc-400 group-hover/file:text-white" />
                                                                    </div>
                                                                    <p className='text-zinc-500 text-[10px] font-bold uppercase tracking-wider truncate w-full group-hover/file:text-zinc-300 transition-colors'>
                                                                        {file.filename.split('.').pop()}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </button>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default FeedbackBawahan