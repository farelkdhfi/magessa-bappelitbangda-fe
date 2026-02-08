// components/Kabid/StatusBadge.jsx
import React from 'react';
import { AlertCircle, Eye, Check, Cog, Flag, Forward } from 'lucide-react';

const getStatusConfig = (status) => {
  const statusConfigs = {
    'belum dibaca': { 
        bg: 'bg-red-500/10', 
        text: 'text-red-400', 
        border: 'border-red-500/20', 
        icon: AlertCircle, 
        label: 'Belum Dibaca',
        glow: 'shadow-[0_0_15px_-3px_rgba(239,68,68,0.2)]'
    },
    'dibaca': { 
        bg: 'bg-amber-500/10', 
        text: 'text-amber-400', 
        border: 'border-amber-500/20', 
        icon: Eye, 
        label: 'Sudah Dibaca',
        glow: 'shadow-[0_0_15px_-3px_rgba(245,158,11,0.2)]'
    },
    'diterima': { 
        bg: 'bg-emerald-500/10', 
        text: 'text-emerald-400', 
        border: 'border-emerald-500/20', 
        icon: Check, 
        label: 'Diterima',
        glow: 'shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]'
    },
    'diproses': { 
        bg: 'bg-blue-500/10', 
        text: 'text-blue-400', 
        border: 'border-blue-500/20', 
        icon: Cog, 
        label: 'Diproses',
        glow: 'shadow-[0_0_15px_-3px_rgba(59,130,246,0.2)]'
    },
    'selesai': { 
        bg: 'bg-violet-500/10', 
        text: 'text-violet-400', 
        border: 'border-violet-500/20', 
        icon: Flag, 
        label: 'Selesai',
        glow: 'shadow-[0_0_15px_-3px_rgba(139,92,246,0.2)]'
    },
    'diteruskan': { 
        bg: 'bg-indigo-500/10', 
        text: 'text-indigo-400', 
        border: 'border-indigo-500/20', 
        icon: Forward, 
        label: 'Diteruskan',
        glow: 'shadow-[0_0_15px_-3px_rgba(99,102,241,0.2)]'
    }
  };
  
  // Fallback to 'belum dibaca' style if status is unknown
  return statusConfigs[status] || statusConfigs['belum dibaca'];
};

const StatusBadge = ({ status }) => {
  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <div className={`
      inline-flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-sm transition-all duration-300
      ${config.bg} ${config.text} ${config.border} ${config.glow}
    `}>
      <IconComponent className="w-3.5 h-3.5" />
      <span className="text-[10px] font-bold uppercase tracking-widest leading-none pt-0.5">
        {config.label}
      </span>
    </div>
  );
};

export default StatusBadge;