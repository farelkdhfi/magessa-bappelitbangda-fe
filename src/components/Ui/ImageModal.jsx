import React from 'react'
import { X, ZoomIn, Download, ExternalLink } from 'lucide-react'

const ImageModal = ({
  selectedImage,
  setSelectedImage
}) => {
  if (!selectedImage) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
      
      {/* Clickable Backdrop */}
      <div 
        className="absolute inset-0 z-0 cursor-zoom-out"
        onClick={() => setSelectedImage(null)}
      />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl h-full flex flex-col items-center justify-center p-4 sm:p-8 animate-in zoom-in-95 duration-300">
        
        {/* Top Bar (Close) */}
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-50 flex gap-3">
            <button
                onClick={() => setSelectedImage(null)}
                className="group p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 backdrop-blur-md transition-all duration-300"
                title="Tutup"
            >
                <X className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
            </button>
        </div>

        {/* Image Display Area */}
        <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
             {/* Image */}
             <img
                src={selectedImage}
                alt="Preview Detail"
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl shadow-black/50 select-none"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x600?text=Image+Load+Error';
                }}
            />
        </div>

        {/* Bottom Action Bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-1 p-1.5 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50">
                <button 
                    onClick={() => window.open(selectedImage, '_blank')}
                    className="p-3 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-all tooltip-trigger"
                    title="Buka Tab Baru"
                >
                    <ExternalLink className="w-5 h-5" />
                </button>
                
                <div className="w-px h-6 bg-white/10 mx-1"></div>

                <a 
                    href={selectedImage} 
                    download 
                    className="flex items-center gap-2 px-4 py-2 hover:bg-white text-zinc-300 hover:text-black rounded-xl text-xs font-bold uppercase tracking-wide transition-all"
                >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                </a>
            </div>
        </div>

      </div>
    </div>
  )
}

export default ImageModal