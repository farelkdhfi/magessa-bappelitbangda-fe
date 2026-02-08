import React from 'react';
import { AlertCircle, Eye, CheckCircle2, Loader2, Flag, Forward, Clock } from 'lucide-react';

const getStatusConfig = (status) => {
  // Normalisasi status ke lowercase untuk menghindari error case-sensitive
  const normalizedStatus = status?.toLowerCase() || 'belum dibaca';

  const statusConfigs = {
    'belum dibaca': { 
        bg: 'bg-red-500/10', 
        text: 'text-red-400', 
        border: 'border-red-500/20', 
        icon: AlertCircle, 
        label: 'Belum Dibaca' 
    },
    'dibaca': { 
        bg: 'bg-amber-500/10', 
        text: 'text-amber-400', 
        border: 'border-amber-500/20', 
        icon: Eye, 
        label: 'Sudah Dibaca' 
    },
    'diterima': { 
        bg: 'bg-emerald-500/10', 
        text: 'text-emerald-400', 
        border: 'border-emerald-500/20', 
        icon: CheckCircle2, 
        label: 'Diterima' 
    },
    'diproses': { 
        bg: 'bg-blue-500/10', 
        text: 'text-blue-400', 
        border: 'border-blue-500/20', 
        icon: Loader2, 
        label: 'Diproses',
        animate: true 
    },
    'selesai': { 
        bg: 'bg-purple-500/10', 
        text: 'text-purple-400', 
        border: 'border-purple-500/20', 
        icon: Flag, 
        label: 'Selesai' 
    },
    'diteruskan': { 
        bg: 'bg-indigo-500/10', 
        text: 'text-indigo-400', 
        border: 'border-indigo-500/20', 
        icon: Forward, 
        label: 'Diteruskan' 
    },
    // Fallback untuk status yang mungkin berbeda
    'dalam proses': { 
        bg: 'bg-blue-500/10', 
        text: 'text-blue-400', 
        border: 'border-blue-500/20', 
        icon: Clock, 
        label: 'Dalam Proses' 
    }
  };

  return statusConfigs[normalizedStatus] || statusConfigs['belum dibaca'];
};

const StatusBadge = ({ status }) => {
  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <div className={`
      inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border backdrop-blur-sm transition-all duration-300
      ${config.bg} ${config.text} ${config.border}
    `}>
      <IconComponent className={`w-3.5 h-3.5 ${config.animate ? 'animate-spin' : ''}`} />
      <span className="text-[10px] font-bold uppercase tracking-widest leading-none mt-0.5">
        {config.label}
      </span>
    </div>
  );
};

export default StatusBadge;