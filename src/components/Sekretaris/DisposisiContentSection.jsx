import React from 'react'
import isImageFile from '../../utils/isImageFile';
import { FileText, MessageSquare, User, Paperclip, Download, Eye, Quote } from 'lucide-react';

export const DisposisiContentSection = ({disposisi, onImageClick}) => {
  return (
    <div className="mt-6 space-y-4">
      
      {/* 1. Instruksi Disposisi (Dengan Hormat Harap) */}
      <div className="bg-zinc-900/40 backdrop-blur-sm rounded-2xl p-6 border border-white/5 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
                <MessageSquare className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest">
                Instruksi Disposisi
            </h4>
        </div>
        
        <div className="bg-black/20 border border-white/5 p-5 rounded-xl">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2">
                Dengan hormat harap:
            </p>
            <p className="text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {disposisi.dengan_hormat_harap}
            </p>
        </div>
      </div>

      {/* 2. Catatan Kepala (Conditional) */}
      {disposisi.catatan && (
        <div className="bg-zinc-900/40 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-zinc-800/50 rounded-xl border border-white/5 text-zinc-400">
                    <User className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white uppercase tracking-widest">
                    Catatan Kepala
                </h4>
            </div>
            <div className="bg-black/20 border border-white/5 p-5 rounded-xl flex gap-3">
                <Quote className="w-8 h-8 text-zinc-700 flex-shrink-0 -mt-1 scale-x-[-1]" />
                <p className="text-zinc-300 text-sm leading-relaxed italic">
                    "{disposisi.catatan}"
                </p>
            </div>
        </div>
      )}

      {/* 3. Catatan Anda/Atasan (Conditional) */}
      {disposisi.catatan_atasan && (
        <div className="bg-zinc-900/40 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-zinc-800/50 rounded-xl border border-white/5 text-zinc-400">
                    <User className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white uppercase tracking-widest">
                    Keterangan Anda
                </h4>
            </div>
            <div className="bg-black/20 border border-white/5 p-5 rounded-xl border-l-2 border-l-indigo-500">
                <p className="text-zinc-300 text-sm leading-relaxed">
                    {disposisi.catatan_atasan}
                </p>
            </div>
        </div>
      )}

      {/* 4. Lampiran (Conditional) */}
      {disposisi.surat_masuk?.has_photos && (
        <div className="bg-zinc-900/40 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-zinc-800/50 rounded-xl border border-white/5 text-zinc-400">
                    <Paperclip className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                    Lampiran Surat
                </h3>
            </div>
          
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {disposisi.surat_masuk.photos.map((photo, index) => {
                const isImage = isImageFile(photo);
                return (
                    <div
                    key={photo.id}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/40 hover:border-white/30 transition-all cursor-pointer"
                    onClick={() => {
                        if (isImage) {
                            onImageClick(photo.url);
                        } else {
                            window.open(photo.url, '_blank', 'noopener,noreferrer');
                        }
                    }}
                    >
                    {isImage ? (
                        <>
                            <img
                            src={photo.url}
                            alt={`Lampiran ${index + 1}`}
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                            loading="lazy"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/128x128?text=Error';
                            }}
                            />
                            {/* Overlay Hover Effect */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Eye className="w-6 h-6 text-white drop-shadow-lg" />
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-3 gap-2 group-hover:bg-zinc-800/50 transition-colors">
                            <div className="p-2 bg-zinc-800 rounded-lg border border-white/5">
                                <FileText className="w-6 h-6 text-zinc-400" />
                            </div>
                            <p className="text-[10px] font-bold text-zinc-500 text-center uppercase truncate w-full px-2">
                                {photo.filename.split('.').pop()}
                            </p>
                            
                            {/* Overlay Hover Effect */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Download className="w-6 h-6 text-white drop-shadow-lg" />
                            </div>
                        </div>
                    )}
                    </div>
                );
                })}
            </div>
        </div>
      )}
    </div>
  )
}