import React from 'react'
import { formatIndonesianDate } from '../../utils/timeZone'
import { AlertCircle, Building, Calendar, Clock, FileText, MessageSquare, User, Briefcase, Hash, CalendarDays, Inbox } from 'lucide-react'
import StatusBadge from './StatusBadge'

// Reusable Info Row Component for consistent styling
const InfoRow = ({ icon: Icon, label, value, highlight = false }) => (
  <div className="group flex flex-col p-4 bg-zinc-900/40 rounded-xl border border-white/5 hover:border-white/10 hover:bg-zinc-800/40 transition-all duration-300">
    <div className="flex items-center gap-2 mb-2">
      <div className={`p-1.5 rounded-lg ${highlight ? 'bg-indigo-500/10 text-indigo-400' : 'bg-white/5 text-zinc-500'} group-hover:text-zinc-300 transition-colors`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</p>
    </div>
    <p className={`text-sm font-medium ${highlight ? 'text-white' : 'text-zinc-300'} pl-1`}>
      {value || '-'}
    </p>
  </div>
);

const DisposisiInfoCard = ({ disposisi }) => {
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '-'
    
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return dateString
    }

    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Kolom Kiri: Informasi Surat */}
      <div className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-2 px-1">
          <div className="p-2 bg-zinc-800/50 rounded-xl border border-white/5 text-zinc-400">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white tracking-wide uppercase">Identitas Surat</h3>
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoRow 
            icon={Building} 
            label="Asal Instansi" 
            value={disposisi.asal_instansi} 
            highlight={true}
          />
          <InfoRow 
            icon={Hash} 
            label="Nomor Surat" 
            value={disposisi.nomor_surat} 
          />
          <InfoRow 
            icon={Calendar} 
            label="Tanggal Surat" 
            value={formatDisplayDate(disposisi.tanggal_surat)} 
          />
          <InfoRow 
            icon={Inbox} 
            label="Diterima Tanggal" 
            value={formatDisplayDate(disposisi.diterima_tanggal)} 
          />
          <InfoRow 
            icon={FileText} 
            label="Nomor Agenda" 
            value={disposisi.nomor_agenda} 
          />
        </div>
      </div>

      {/* Kolom Kanan: Informasi Disposisi */}
      <div className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-2 px-1">
          <div className="p-2 bg-zinc-800/50 rounded-xl border border-white/5 text-zinc-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white tracking-wide uppercase">Detail Disposisi</h3>
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Status Row takes full width on mobile, half on desktop */}
          <div className="sm:col-span-2 group flex flex-col justify-center p-4 bg-zinc-900/40 rounded-xl border border-white/5 hover:border-white/10 hover:bg-zinc-800/40 transition-all duration-300">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <AlertCircle className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status & Sifat</p>
                </div>
                <div className="flex gap-2">
                    <StatusBadge status={disposisi.status_dari_sekretaris} />
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 text-zinc-300 border border-white/5 uppercase">
                        {disposisi.sifat || '-'}
                    </span>
                </div>
             </div>
          </div>

          <InfoRow 
            icon={Briefcase} 
            label="Disposisi Ke Jabatan" 
            value={disposisi.disposisi_kepada_jabatan} 
          />
          <InfoRow 
            icon={User} 
            label="Diteruskan Kepada" 
            value={disposisi.diteruskan_kepada_nama || disposisi.diteruskan_kepada_jabatan} 
            highlight={!!disposisi.diteruskan_kepada_nama}
          />
          <InfoRow 
            icon={Clock} 
            label="Waktu Disposisi" 
            value={formatIndonesianDate(disposisi.created_at)} 
          />
          {/* Empty spacer or additional info could go here to balance grid if needed */}
        </div>
      </div>
      
    </div>
  )
}

export default DisposisiInfoCard