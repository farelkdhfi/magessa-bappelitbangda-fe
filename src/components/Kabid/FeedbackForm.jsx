import { AlertCircle, MessageSquare, Paperclip, Send, X, File } from 'lucide-react'
import React from 'react'

const FeedbackForm = ({
  showFeedbackForm,
  setShowFeedbackForm,
  showForwardModal,
  feedbackData,
  feedbackError,
  feedbackLoading,
  handleFeedbackChange,
  handleFeedbackSubmit,
  handleFileChange,
  editingFeedbackId

}) => {
  if (!showFeedbackForm || showForwardModal || editingFeedbackId) return null;

  return (
    <div className="relative animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

        <div className="relative z-10">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zinc-800/50 rounded-2xl border border-white/5 shadow-inner">
                <MessageSquare className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-light text-white tracking-tight">Beri Feedback</h3>
                <p className="text-sm text-zinc-500 font-medium">Berikan tanggapan dan update status disposisi</p>
              </div>
            </div>
            
            {/* Close Button (Optional if needed) */}
            <button 
                onClick={() => setShowFeedbackForm(false)}
                className="p-2 rounded-xl hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
          </div>

          {/* Error Message */}
          {feedbackError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{feedbackError}</span>
            </div>
          )}

          <form onSubmit={handleFeedbackSubmit} className="space-y-6">
            
            {/* Catatan Input */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                Catatan Feedback <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <textarea
                  name="notes"
                  value={feedbackData.notes}
                  onChange={handleFeedbackChange}
                  required
                  rows="5"
                  className="w-full px-5 py-4 bg-black/20 border border-white/5 rounded-2xl focus:outline-none focus:border-emerald-500/50 focus:bg-black/40 focus:ring-1 focus:ring-emerald-500/20 text-zinc-300 placeholder-zinc-600 transition-all resize-none leading-relaxed"
                  placeholder="Tuliskan catatan, instruksi, atau tanggapan Anda di sini..."
                />
              </div>
            </div>

            {/* Status Radio Group */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                Update Status <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`
                  relative cursor-pointer group p-4 rounded-2xl border transition-all duration-300
                  ${feedbackData.status === 'diproses' 
                    ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                    : 'bg-zinc-800/30 border-white/5 hover:bg-zinc-800/50 hover:border-white/10'}
                `}>
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-5 h-5 rounded-full border flex items-center justify-center transition-colors
                      ${feedbackData.status === 'diproses' ? 'border-emerald-500 bg-emerald-500' : 'border-zinc-600 group-hover:border-zinc-500'}
                    `}>
                       {feedbackData.status === 'diproses' && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <input
                      type="radio"
                      name="status"
                      value="diproses"
                      checked={feedbackData.status === 'diproses'}
                      onChange={handleFeedbackChange}
                      className="hidden"
                    />
                    <span className={`font-medium text-sm ${feedbackData.status === 'diproses' ? 'text-emerald-400' : 'text-zinc-400'}`}>
                      Sedang Diproses
                    </span>
                  </div>
                </label>

                <label className={`
                  relative cursor-pointer group p-4 rounded-2xl border transition-all duration-300
                  ${feedbackData.status === 'selesai' 
                    ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                    : 'bg-zinc-800/30 border-white/5 hover:bg-zinc-800/50 hover:border-white/10'}
                `}>
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-5 h-5 rounded-full border flex items-center justify-center transition-colors
                      ${feedbackData.status === 'selesai' ? 'border-blue-500 bg-blue-500' : 'border-zinc-600 group-hover:border-zinc-500'}
                    `}>
                       {feedbackData.status === 'selesai' && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <input
                      type="radio"
                      name="status"
                      value="selesai"
                      checked={feedbackData.status === 'selesai'}
                      onChange={handleFeedbackChange}
                      className="hidden"
                    />
                    <span className={`font-medium text-sm ${feedbackData.status === 'selesai' ? 'text-blue-400' : 'text-zinc-400'}`}>
                      Selesai
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                Lampiran File <span className="text-zinc-600 font-normal lowercase">(maks. 5)</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                  className="hidden"
                />
                <label 
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full p-6 border border-dashed border-zinc-700 rounded-2xl bg-zinc-900/30 hover:bg-zinc-800/30 hover:border-zinc-500 transition-all cursor-pointer group"
                >
                    <div className="p-3 bg-zinc-800 rounded-full mb-3 group-hover:scale-110 transition-transform">
                        <Paperclip className="w-5 h-5 text-zinc-400" />
                    </div>
                    <span className="text-sm text-zinc-400 font-medium group-hover:text-white transition-colors">
                        Klik untuk upload file
                    </span>
                    <span className="text-xs text-zinc-600 mt-1">PDF atau Gambar</span>
                </label>
              </div>

              {/* File Preview List */}
              {feedbackData.files.length > 0 && (
                <div className="mt-4 space-y-2">
                    {Array.from(feedbackData.files).map((file, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-zinc-800/40 border border-white/5 rounded-xl">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <File className="w-4 h-4 text-emerald-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-zinc-300 truncate">{file.name}</p>
                                <p className="text-xs text-zinc-500">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                        </div>
                    ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/5 mt-8">
              <button
                type="button"
                onClick={() => setShowFeedbackForm(false)}
                className="flex-1 px-6 py-3.5 bg-transparent hover:bg-zinc-800 text-zinc-500 hover:text-white rounded-2xl font-semibold transition-all border border-transparent hover:border-white/5 text-sm"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={feedbackLoading}
                className={`
                  flex-[2] flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg
                  ${feedbackLoading
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5'
                    : 'bg-white text-black hover:bg-zinc-200 shadow-white/5 hover:shadow-white/10 hover:-translate-y-0.5'
                  }
                `}
              >
                {feedbackLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-zinc-500 border-t-black rounded-full animate-spin"></div>
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Kirim Feedback</span>
                  </>
                )}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  )
}

export default FeedbackForm