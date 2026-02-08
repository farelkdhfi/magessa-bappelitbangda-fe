import React, { useState } from 'react';
import { Plus, List, LetterText, Send } from 'lucide-react';
import AdminBuatSuratKeluar from '../../components/Admin/AdminBuatSuratKeluar';
import AdminDaftarSuratKeluar from '../../components/Admin/AdminDaftarSuratKeluar';

const AdminSuratKeluar = () => {
    const [activeTab, setActiveTab] = useState('buat');

    return (
        <div className="min-h-screen text-white font-sans selection:bg-white/20">
            
            {/* Header Section with Integrated Tabs */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                
                {/* Title Block */}
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/5 rounded-lg border border-white/5 backdrop-blur-sm">
                            <LetterText className="w-5 h-5 text-zinc-400" />
                        </div>
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
                            Archival System
                        </p>
                    </div>
                    <h1 className="text-3xl font-light tracking-tight text-white">
                        Admin <span className="font-semibold text-zinc-400">Surat Keluar</span>
                    </h1>
                </div>

                {/* Modern Segmented Control Tabs */}
                <div className="bg-zinc-900/80 backdrop-blur-md border border-white/5 p-1.5 rounded-2xl flex items-center gap-1 shadow-xl shadow-black/20">
                    <button
                        onClick={() => setActiveTab('buat')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-300 ${
                            activeTab === 'buat'
                                ? 'bg-white text-black shadow-lg shadow-white/5 scale-[1.02]'
                                : 'text-zinc-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Plus className={`w-4 h-4 ${activeTab === 'buat' ? 'text-black' : 'text-zinc-500'}`} />
                        Buat Baru
                    </button>

                    <button
                        onClick={() => setActiveTab('daftar')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-300 ${
                            activeTab === 'daftar'
                                ? 'bg-white text-black shadow-lg shadow-white/5 scale-[1.02]'
                                : 'text-zinc-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <List className={`w-4 h-4 ${activeTab === 'daftar' ? 'text-black' : 'text-zinc-500'}`} />
                        Arsip Keluar
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="relative">
                {/* Decorative Background Glow for Content */}
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-white/5 rounded-full blur-[100px] -z-10 opacity-20 pointer-events-none" />

                <div className="transition-all duration-500 ease-in-out">
                    {activeTab === 'buat' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <AdminBuatSuratKeluar />
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <AdminDaftarSuratKeluar />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSuratKeluar;