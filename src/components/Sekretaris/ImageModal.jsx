import React from 'react';
import { X, ExternalLink, ZoomIn } from 'lucide-react';

const ImageModal = ({
  selectedImage,
  setSelectedImage
}) => {
  
  if (!selectedImage) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
      
      {/* 1. Backdrop (Darker & Blurrier for Focus) */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
        onClick={() => setSelectedImage(null)}
      />

      {/* 2. Content Wrapper */}
      <div className="relative w-full h-full flex flex-col items-center justify-center pointer-events-none animate-in zoom-in-95 duration-300">
        
        {/* Floating Toolbar (Top Right) */}
        <div className="absolute top-0 right-0 z-50 flex items-center gap-3 pointer-events-auto">
          {/* Open Original Button */}
          <a
            href={selectedImage}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 rounded-full bg-zinc-900/50 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-white/20 backdrop-blur-md transition-all duration-300"
            title="Buka ukuran asli"
          >
            <ExternalLink className="w-5 h-5" />
          </a>

          {/* Close Button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="group p-3 rounded-full bg-zinc-900/50 border border-white/10 text-zinc-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 backdrop-blur-md transition-all duration-300"
            title="Tutup (Esc)"
          >
            <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
          </button>
        </div>

        {/* 3. Image Container */}
        <div 
            className="relative pointer-events-auto overflow-hidden rounded-2xl shadow-2xl shadow-black border border-white/10 bg-zinc-900"
            onClick={(e) => e.stopPropagation()} 
        >
          <img
            src={selectedImage}
            alt="Preview Fullscreen"
            className="max-w-full max-h-[85vh] object-contain select-none"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x600?text=Gambar+Rusak';
            }}
          />
        </div>

        {/* 4. Bottom Hint */}
        <div className="mt-6 pointer-events-none opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-forwards">
             <div className="flex items-center gap-2 px-4 py-2 bg-black/50 border border-white/5 rounded-full backdrop-blur-md text-xs text-zinc-500 font-medium">
                <ZoomIn className="w-3 h-3" />
                <span>Tekan tombol ESC atau klik area gelap untuk menutup</span>
             </div>
        </div>

      </div>
    </div>
  );
};

export default ImageModal;