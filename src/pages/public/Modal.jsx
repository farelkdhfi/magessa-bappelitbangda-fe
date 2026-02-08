import React from 'react';
import { AlertCircle, CheckCircle, X, Info, AlertTriangle } from "lucide-react";

const Modal = ({ isOpen, onClose, children, title, type = 'default' }) => {
    if (!isOpen) return null;

    // Configuration for styling based on type (Accent Logic)
    const styleConfig = {
        success: {
            icon: CheckCircle,
            accentColor: 'text-emerald-500',
            iconBg: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/20' // Subtle colored border hint
        },
        error: {
            icon: AlertTriangle, // Changed to Triangle for error
            accentColor: 'text-red-500',
            iconBg: 'bg-red-500/10',
            borderColor: 'border-red-500/20'
        },
        warning: {
            icon: AlertCircle,
            accentColor: 'text-amber-500',
            iconBg: 'bg-amber-500/10',
            borderColor: 'border-amber-500/20'
        },
        default: {
            icon: Info,
            accentColor: 'text-zinc-100',
            iconBg: 'bg-white/5',
            borderColor: 'border-white/10'
        }
    };

    const activeStyle = styleConfig[type] || styleConfig.default;
    const Icon = activeStyle.icon;

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <div 
                className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className={`relative w-full max-w-md bg-zinc-950 rounded-3xl shadow-2xl shadow-black/50 border ${type === 'default' ? 'border-white/10' : activeStyle.borderColor} transform transition-all animate-in zoom-in-95 duration-200 overflow-hidden`}>
                
                {/* Glow Effect (Optional decoration) */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${activeStyle.iconBg} rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20 pointer-events-none`} />

                {/* Header */}
                <div className="flex justify-between items-start p-6 border-b border-white/5 relative z-10">
                    <div className="flex items-center gap-4">
                        {/* Icon Box */}
                        <div className={`p-2.5 rounded-xl border border-white/5 ${activeStyle.iconBg}`}>
                            <Icon className={`w-5 h-5 ${activeStyle.accentColor}`} />
                        </div>
                        
                        <div>
                            {/* Type Label (Micro Typography) */}
                            <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${activeStyle.accentColor} opacity-80`}>
                                {type === 'default' ? 'System Message' : type}
                            </p>
                            {/* Main Title */}
                            <h3 className="text-lg font-light text-white tracking-tight leading-none">
                                {title}
                            </h3>
                        </div>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 -mt-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 md:p-8 relative z-10">
                    <div className="text-sm text-zinc-400 leading-relaxed">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;