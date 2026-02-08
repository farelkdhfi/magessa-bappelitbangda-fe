import { AlertCircle, MessageSquare, Paperclip, Send, CheckCircle2, Circle } from 'lucide-react'
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
  return (
    <div>
      {showFeedbackForm && !showForwardModal && !editingFeedbackId && (
        <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-2xl shadow-black/20 relative overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

          {/* Header */}
          <div className="flex items-start gap-4 mb-6 border-b border-white/5 pb-6">
            <div className="p-3 bg-zinc-800/50 rounded-2xl border border-white/5 text-zinc-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white tracking-tight">Tulis Feedback</h3>
              <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                Berikan catatan pengerjaan, update status, atau lampirkan bukti dokumen.
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {feedbackError && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm font-medium">{feedbackError}</span>
            </div>
          )}

          <form onSubmit={handleFeedbackSubmit} className="space-y-6">
            
            {/* Input Catatan */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                Catatan Feedback <span className="text-red-500">*</span>
              </label>
              <textarea
                name="notes"
                value={feedbackData.notes}
                onChange={handleFeedbackChange}
                required
                rows="5"
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 focus:bg-black/40 text-zinc-200 placeholder-zinc-600 resize-none transition-all text-sm"
                placeholder="Deskripsikan perkembangan atau hasil pengerjaan disposisi ini..."
              />
            </div>

            {/* Status Selection (Card Style) */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                Update Status <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option: Diproses */}
                <label className={`relative flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-300 group ${
                  feedbackData.status === 'diproses' 
                    ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                    : 'bg-zinc-900/50 border-white/5 hover:border-white/10 hover:bg-zinc-800/50'
                }`}>
                  <input
                    type="radio"
                    name="status"
                    value="diproses"
                    checked={feedbackData.status === 'diproses'}
                    onChange={handleFeedbackChange}
                    className="sr-only"
                  />
                  <div className={`mr-3 transition-colors ${feedbackData.status === 'diproses' ? 'text-blue-400' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                    {feedbackData.status === 'diproses' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className={`block text-sm font-bold ${feedbackData.status === 'diproses' ? 'text-white' : 'text-zinc-400'}`}>Diproses</span>
                    <span className="text-xs text-zinc-600">Masih dalam pengerjaan</span>
                  </div>
                </label>

                {/* Option: Selesai */}
                <label className={`relative flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-300 group ${
                  feedbackData.status === 'selesai' 
                    ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                    : 'bg-zinc-900/50 border-white/5 hover:border-white/10 hover:bg-zinc-800/50'
                }`}>
                  <input
                    type="radio"
                    name="status"
                    value="selesai"
                    checked={feedbackData.status === 'selesai'}
                    onChange={handleFeedbackChange}
                    className="sr-only"
                  />
                  <div className={`mr-3 transition-colors ${feedbackData.status === 'selesai' ? 'text-emerald-400' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                    {feedbackData.status === 'selesai' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className={`block text-sm font-bold ${feedbackData.status === 'selesai' ? 'text-white' : 'text-zinc-400'}`}>Selesai</span>
                    <span className="text-xs text-zinc-600">Tugas telah rampung</span>
                  </div>
                </label>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                Lampiran File <span className="normal-case font-medium text-zinc-600">(Maks. 5 file)</span>
              </label>
              <div className="relative group">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                  className="block w-full text-sm text-zinc-400
                    file:mr-4 file:py-2.5 file:px-4
                    file:rounded-lg file:border-0
                    file:text-xs file:font-semibold
                    file:bg-zinc-800 file:text-zinc-300
                    hover:file:bg-zinc-700 hover:file:text-white
                    cursor-pointer bg-black/20 border border-white/10 rounded-xl p-1 transition-colors focus:outline-none"
                />
              </div>
              
              {feedbackData.files.length > 0 && (
                <div className="flex items-center gap-2 mt-2 text-xs bg-indigo-500/10 text-indigo-300 px-3 py-2 rounded-lg border border-indigo-500/20 w-fit">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span className="font-medium">{feedbackData.files.length} file dipilih</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => setShowFeedbackForm(false)}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={feedbackLoading}
                className={`
                  flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-white/5
                  ${feedbackLoading
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5'
                    : 'bg-white text-black hover:bg-zinc-200 border border-transparent'
                  }
                `}
              >
                {feedbackLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-zinc-500 border-t-zinc-300 rounded-full animate-spin"></div>
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
      )}
    </div>
  )
}

export default FeedbackForm