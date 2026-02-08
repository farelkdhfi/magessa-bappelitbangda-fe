import React from 'react'
import isImageFile from '../../utils/isImageFile';
import { FileText, MessageSquare, User, Paperclip } from 'lucide-react';

export const DisposisiContentSection = ({ disposisi, onImageClick }) => {
  return (
    <div className="mt-6 space-y-4">
      
      {/* 1. Section: Instruksi (Dengan hormat harap) */}
      <div className="bg-zinc-900/50 backdrop-blur-sm rounded-3xl p-6 border border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h4 className="font-semibold text-white tracking-tight">
            Instruksi Disposisi
          </h4>
        </div>
        
        <div className="bg-black/20 border border-white/5 p-5 rounded-2xl">
          <p className="whitespace-pre-wrap leading-relaxed text-zinc-300 text-sm">
            {disposisi.dengan_hormat_harap}
          </p>
        </div>
      </div>

      {/* 2. Section: Catatan Kepala */}
      {disposisi.catatan && (
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-3xl p-6 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-white tracking-tight">
              Catatan Kepala
            </h4>
          </div>
          
          <div className="bg-black/20 border border-white/5 p-5 rounded-2xl">
            <p className="leading-relaxed text-zinc-300 text-sm">
              {disposisi.catatan}
            </p>
          </div>
        </div>
      )}

      {/* 3. Section: Catatan Atasan (Keterangan Anda) */}
      {disposisi.catatan_atasan && (
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-3xl p-6 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
              <User className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-white tracking-tight">
              Keterangan dari Anda
            </h4>
          </div>
          
          <div className="bg-black/20 border border-white/5 p-5 rounded-2xl">
            <p className="leading-relaxed text-zinc-300 text-sm">
              {disposisi.catatan_atasan}
            </p>
          </div>
        </div>
      )}

      {/* 4. Section: Lampiran */}
      {disposisi.surat_masuk?.has_photos && (
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-3xl p-6 border border-white/5">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 bg-zinc-800 rounded-xl border border-white/5 text-zinc-400">
              <Paperclip className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white tracking-tight">
              Lampiran ({disposisi.surat_masuk.photos.length} file)
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {disposisi.surat_masuk.photos.map((photo, index) => {
              const isImage = isImageFile(photo);
              return (
                <div
                  key={photo.id}
                  className="group relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden cursor-pointer border border-white/10 bg-black/40 hover:border-white/30 hover:shadow-lg hover:shadow-black/50 transition-all duration-300"
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
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      {/* Fallback jika gambar error / loading */}
                      <div className="hidden w-full h-full items-center justify-center bg-zinc-900 text-zinc-700">
                        <FileText className="w-8 h-8" />
                      </div>
                      {/* Overlay Hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-2 text-zinc-500 group-hover:text-white transition-colors bg-zinc-900/50">
                      <FileText className="w-8 h-8 mb-2 opacity-70 group-hover:opacity-100" />
                      <p className="text-[10px] font-bold uppercase text-center break-words max-w-full px-1">
                        {photo.filename.split('.').pop() || 'FILE'}
                      </p>
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