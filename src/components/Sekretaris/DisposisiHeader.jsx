import React from 'react';
import { AlertCircle, ArrowLeft, Check, FileText, Forward, MessageSquare, Download } from 'lucide-react';
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

  // Helper function (LOGIC DIPERTAHANKAN UTUH)
  const canAcceptDisposisi = () => disposisi && 
    disposisi.status === 'dibaca' && 
    disposisi.status_dari_sekretaris !== 'diterima' && 
    disposisi.status_dari_sekretaris !== 'diteruskan';

  const canForwardDisposisi = () => disposisi && disposisi.status_dari_sekretaris === 'diterima';
  
  const canGiveFeedback = () => disposisi && 
    !disposisi.has_feedback && 
    (disposisi.status_dari_sekretaris === 'diterima' || disposisi.status === 'diproses');

  return (
    // Container: Glassmorphism Dark Theme
    <div className="mb-6 bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-2xl shadow-black/20">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="group inline-flex items-center mb-6 text-zinc-400 hover:text-white transition-colors"
      >
        <div className="p-1.5 rounded-lg bg-white/5 border border-white/5 mr-2 group-hover:bg-white/10 transition-colors">
             <ArrowLeft className="w-4 h-4" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest">Kembali</span>
      </button>

      <div className="px-1 mb-2">
        <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start gap-6">
          
          {/* Left Section: Title & Description */}
          <div className="flex-1 space-y-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-light text-white tracking-tight">
                    Detail <span className="font-semibold text-zinc-400">Disposisi</span>
                </h1>
                <p className="text-sm text-zinc-500 mt-2 font-medium leading-relaxed max-w-xl">
                    Kelola aliran disposisi surat, unduh dokumen resmi, teruskan ke bawahan, atau berikan feedback terkait pengerjaan.
                </p>
            </div>

            {/* Download Button - Redesigned */}
            <button
              onClick={onDownloadPDF}
              disabled={downloadLoading}
              className={`group inline-flex items-center px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-300 border ${
                downloadLoading
                  ? 'bg-zinc-800/50 border-zinc-700 text-zinc-500 cursor-not-allowed'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-black'
              }`}
            >
              {downloadLoading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-zinc-500 border-t-white rounded-full animate-spin"></div>
                  <span>Mengunduh...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2 group-hover:text-white transition-colors" />
                  <span>Download Lembar PDF</span>
                </>
              )}
            </button>
          </div>

          {/* Right Section: Actions & Status */}
          {disposisi && (
            <div className="flex flex-col items-start xl:items-end space-y-5 w-full xl:w-auto">
              
              {/* Status Badge Wrapper */}
              <div className="flex items-center gap-3">
                 <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Status Saat Ini:</span>
                 <div className="scale-105 origin-right">
                    <StatusBadge status={disposisi.status_dari_sekretaris} />
                 </div>
              </div>

              {/* Action Buttons Group */}
              <div className="flex flex-wrap xl:justify-end gap-3 w-full">
                {canAcceptDisposisi() && (
                  <button
                    onClick={onAcceptDisposisi}
                    disabled={acceptLoading}
                    className={`
                      flex-1 xl:flex-none inline-flex justify-center items-center px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg shadow-white/5
                      ${acceptLoading
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5'
                        : 'bg-white text-black hover:bg-zinc-200 border border-transparent'
                      }
                    `}
                  >
                    {acceptLoading ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-zinc-400 border-t-black rounded-full animate-spin"></div>
                        Memproses...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Terima Disposisi
                      </>
                    )}
                  </button>
                )}

                {canForwardDisposisi() && !showForwardModal && !showFeedbackForm && !editingFeedbackId && (
                  <button
                    onClick={onShowForwardModal}
                    className="flex-1 xl:flex-none inline-flex justify-center items-center px-6 py-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/40 text-sm font-bold transition-all duration-300"
                  >
                    <Forward className="w-4 h-4 mr-2" />
                    Teruskan
                  </button>
                )}

                {canGiveFeedback() && !showForwardModal && !showFeedbackForm && !editingFeedbackId && (
                  <button
                    onClick={onShowFeedbackForm}
                    className="flex-1 xl:flex-none inline-flex justify-center items-center px-6 py-3 rounded-2xl bg-zinc-800 text-zinc-200 border border-white/10 hover:bg-zinc-700 hover:text-white hover:border-white/20 text-sm font-bold transition-all duration-300"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Beri Feedback
                  </button>
                )}
              </div>

              {/* Error Message - Dark Theme */}
              {acceptError && (
                <div className="w-full bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-xs font-medium leading-relaxed">{acceptError}</span>
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