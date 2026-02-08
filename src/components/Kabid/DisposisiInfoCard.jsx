import React from 'react'
import { formatIndonesianDate } from '../../utils/timeZone'
import { 
  AlertCircle, 
  Building, 
  Calendar, 
  Clock, 
  FileText, 
  MessageSquare, 
  User,
  Hash,
  ArrowRight
} from 'lucide-react'
import StatusBadge from './StatusBadge'

// Komponen Reusable untuk Item Data (Micro-Component style)
const DataField = ({ label, value, icon: Icon, isBadge = false }) => (
  <div className="group bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all duration-300">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
        {label}
      </p>
    </div>
    <div className="pl-[22px]">
      {isBadge ? (
        value
      ) : (
        <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
          {value}
        </p>
      )}
    </div>
  </div>
);

// Komponen Header Section
const SectionHeader = ({ title, icon: Icon, colorClass = "text-zinc-400" }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2.5 bg-zinc-800/50 rounded-xl border border-white/5 shadow-inner">
      <Icon className={`w-5 h-5 ${colorClass}`} />
    </div>
    <h3 className="text-lg font-light text-white tracking-tight">
      {title}
    </h3>
  </div>
);

const DisposisiInfoCard = ({ disposisi }) => {

  // === FUNGSI HELPER BARU (LOGIC TIDAK DIUBAH) ===
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '-'
    
    // Coba parse ke date object
    const date = new Date(dateString)
    
    // Jika hasilnya "Invalid Date" (karena inputnya "1 Januari 2025"),
    // maka kembalikan string aslinya saja.
    if (isNaN(date.getTime())) {
      return dateString
    }

    // Jika valid date (format ISO YYYY-MM-DD), format ke Indo
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Kolom 1: Informasi Surat */}
      <div className="flex flex-col gap-3">
        <SectionHeader 
          title="Informasi Surat" 
          icon={FileText} 
          colorClass="text-emerald-400" 
        />
        
        <DataField 
          icon={Hash} 
          label="Nomor Surat" 
          value={disposisi.nomor_surat || '-'} 
        />
        
        <DataField 
          icon={Building} 
          label="Asal Instansi" 
          value={disposisi.asal_instansi || '-'} 
        />

        <div className="grid grid-cols-2 gap-3">
          <DataField 
            icon={Calendar} 
            label="Tanggal Surat" 
            value={formatDisplayDate(disposisi.tanggal_surat)} 
          />
          <DataField 
            icon={Calendar} 
            label="Diterima Tanggal" 
            value={formatDisplayDate(disposisi.diterima_tanggal)} 
          />
        </div>

        <DataField 
          icon={FileText} 
          label="Nomor Agenda" 
          value={disposisi.nomor_agenda || '-'} 
        />
      </div>

      {/* Kolom 2: Informasi Disposisi */}
      <div className="flex flex-col gap-3">
        <SectionHeader 
          title="Informasi Disposisi" 
          icon={MessageSquare} 
          colorClass="text-indigo-400" 
        />

        <DataField 
          icon={AlertCircle} 
          label="Status" 
          isBadge={true}
          value={<StatusBadge status={disposisi.status_dari_kabid} />} 
        />

        <DataField 
          icon={AlertCircle} 
          label="Sifat" 
          value={disposisi.sifat || '-'} 
        />

        <DataField 
          icon={User} 
          label="Disposisi Kepada" 
          value={disposisi.disposisi_kepada_jabatan} 
        />

        <DataField 
          icon={ArrowRight} 
          label="Diteruskan Kepada" 
          value={disposisi.diteruskan_kepada_nama || disposisi.diteruskan_kepada_jabatan} 
        />

        <DataField 
          icon={Clock} 
          label="Tanggal Disposisi" 
          value={formatIndonesianDate(disposisi.created_at)} 
        />
      </div>
    </div>
  )
}

export default DisposisiInfoCard