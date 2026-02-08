import React from 'react';
import { 
  AlertCircle, 
  ArrowLeft, 
  Check, 
  FileText, 
  Forward, 
  MessageSquare,
  Download,
  FileDown
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useNavigate } from 'react-router-dom';

const DisposisiHeader = ({ 
  disposisi, 
  onDownloadPDF, 
  downloadLoading, 
  onAcceptDisposisi, 
  acceptLoading, 
  acceptError,
  onShowForwardModal,
  onShowFeedbackForm,
  showForwardModal,
  showFeedbackForm,
  editingFeedbackId
}) => {
  const navigate = useNavigate();

  // Helper function untuk cek kondisi tombol (Logic dipertahankan 100%)
  const canAcceptDisposisi = () => disposisi && 
    disposisi.status === 'dibaca' && 
    disposisi.status_dari_kabid !== 'diterima' && 
    disposisi.status_dari_kabid !== 'diteruskan';

  const canForwardDisposisi = () => disposisi && disposisi.status_dari_kabid === 'diterima';
  
  const canGiveFeedback = () => disposisi && 
    !disposisi.has_feedback && 
    (disposisi.status_dari_kabid === 'diterima' || disposisi.status === 'diproses');

  return (
    <div className="relative w-full">
      {/* Container Utama dengan gaya Glassmorphism */}
      <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 overflow-hidden relative group transition-all duration-500 hover:border-white/10">
        
        {/* Background Glow Effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none transition-opacity duration-500 group-hover:bg-white/10" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-8">
          
          {/* Bagian Kiri: Judul & Info */}
          <div className="space-y-6 flex-1">
            {/* Tombol Kembali (Styled) */}
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium w-fit"
            >
              <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-white/10 border border-white/5 transition-all">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              </div>
              <span>Kembali</span>
            </button>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-px w-8 bg-zinc-700"></div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Control Panel
                </span>
              </div>
              <h1 className="text-3xl font-light text-white tracking-tight">
                Detail <span className="font-semibold text-zinc-400">Disposisi</span>
              </h1>
              <p className="text-zinc-500 text-sm mt-2 max-w-lg leading-relaxed">
                Kelola status, unduh dokumen, dan berikan feedback untuk disposisi yang masuk ke divisi Anda.
              </p>
            </div>

            {/* Tombol Download PDF (Styled as Secondary Action) */}
            <button
              onClick={onDownloadPDF}
              disabled={downloadLoading}
              className={`
                group flex items-center gap-3 px-5 py-3 rounded-xl border transition-all duration-300
                ${downloadLoading 
                  ? 'bg-zinc-800/50 border-white/5 text-zinc-600 cursor-not-allowed' 
                  : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white shadow-lg shadow-black/20'
                }
              `}
            >
              {downloadLoading ? (
                <div className="w-5 h-5 border-2 border-zinc-500 border-t-zinc-300 rounded-full animate-spin"></div>
              ) : (
                <div className="p-1.5 bg-zinc-800 rounded-lg group-hover:bg-zinc-700 transition-colors">
                  <FileDown className="w-4 h-4" />
                </div>
              )}
              <span className="text-sm font-medium">
                {downloadLoading ? 'Mengunduh Dokumen...' : 'Unduh Lembar Disposisi'}
              </span>
            </button>
          </div>

          {/* Bagian Kanan: Status & Actions */}
          {disposisi && (
            <div className="flex flex-col items-start lg:items-end gap-6 min-w-[300px]">
              
              {/* Status Badge Wrapper */}
              <div className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/5">
                <StatusBadge status={disposisi.status_dari_kabid} />
              </div>

              {/* Action Buttons Grid */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                
                {/* 1. Accept Button (Primary Action - White) */}
                {canAcceptDisposisi() && (
                  <button
                    onClick={onAcceptDisposisi}
                    disabled={acceptLoading}
                    className={`
                      relative overflow-hidden group flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 shadow-xl
                      ${acceptLoading
                        ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                        : 'bg-white text-black hover:bg-zinc-200 shadow-white/5 hover:shadow-white/10 hover:-translate-y-0.5'
                      }
                    `}
                  >
                    {acceptLoading ? (
                      <>
                         <div className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-800 rounded-full animate-spin"></div>
                         <span>Memproses...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Terima Disposisi</span>
                      </>
                    )}
                  </button>
                )}

                {/* 2. Forward Button (Secondary Action - Glass) */}
                {canForwardDisposisi() && !showForwardModal && !showFeedbackForm && !editingFeedbackId && (
                  <button
                    onClick={onShowForwardModal}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-zinc-800/80 hover:bg-zinc-700 text-white font-medium text-sm border border-white/5 hover:border-white/20 transition-all duration-300 shadow-lg shadow-black/20 hover:-translate-y-0.5"
                  >
                    <Forward className="w-4 h-4 text-indigo-400 group-hover:text-white" />
                    <span>Teruskan</span>
                  </button>
                )}

                {/* 3. Feedback Button (Secondary Action - Glass) */}
                {canGiveFeedback() && !showForwardModal && !showFeedbackForm && !editingFeedbackId && (
                  <button
                    onClick={onShowFeedbackForm}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-zinc-800/80 hover:bg-zinc-700 text-white font-medium text-sm border border-white/5 hover:border-white/20 transition-all duration-300 shadow-lg shadow-black/20 hover:-translate-y-0.5"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400 group-hover:text-white" />
                    <span>Beri Feedback</span>
                  </button>
                )}
              </div>

              {/* Error Message */}
              {acceptError && (
                <div className="w-full animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="font-medium leading-relaxed">{acceptError}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisposisiHeader;