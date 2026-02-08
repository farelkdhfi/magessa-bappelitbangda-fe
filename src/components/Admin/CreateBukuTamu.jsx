import { Copy, Download, Loader2, Plus, QrCode, X, Calendar, MapPin, AlignLeft, Hash } from 'lucide-react';
import React from 'react'
import InputField from '../InputField';

const CreateBukuTamu = ({
    view,
    createEvent,
    formData,
    setFormData,
    setView,
    setQrCode,
    setGuestUrl,
    actionLoading,
    qrCode,
    guestUrl,
    downloadQRCode,
    copyToClipboard,
}) => {
    const [isQrOnlyMode, setIsQrOnlyMode] = React.useState(false);
    const [countdown, setCountdown] = React.useState(60);
    const qrTimerRef = React.useRef(null);
    const intervalRef = React.useRef(null);

    React.useEffect(() => {
        if (qrCode && guestUrl) {
            setIsQrOnlyMode(true);
            setCountdown(60);

            if (qrTimerRef.current) clearTimeout(qrTimerRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);

            intervalRef.current = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current);
                        setIsQrOnlyMode(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            qrTimerRef.current = setTimeout(() => {
                setIsQrOnlyMode(false);
                setCountdown(0);
                clearInterval(intervalRef.current);
            }, 60000);

            return () => {
                if (qrTimerRef.current) clearTimeout(qrTimerRef.current);
                if (intervalRef.current) clearInterval(intervalRef.current);
            };
        }
    }, [qrCode, guestUrl]);

    const handleCloseQr = () => {
        setIsQrOnlyMode(false);
        setCountdown(0);
        if (qrTimerRef.current) clearTimeout(qrTimerRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);
    };    

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-500">
            
            {/* 1. QR CODE FULLSCREEN MODE */}
            {isQrOnlyMode && qrCode && guestUrl && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
                    <div className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                        
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-xs font-bold text-emerald-500">LIVE SESSION • {countdown}s</span>
                            </div>
                            <button onClick={handleCloseQr} className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
                                <QrCode className="w-10 h-10 text-white" />
                            </div>
                            
                            <h3 className="text-2xl font-light text-white mb-2">Scan untuk Check-in</h3>
                            <p className="text-zinc-500 text-sm mb-8">Tunjukkan kode ini kepada tamu undangan</p>

                            <div className="p-4 bg-white rounded-2xl mb-8 shadow-xl">
                                <img src={qrCode} alt="QR Code" className="w-64 h-64 object-contain" />
                            </div>

                            <div className="w-full space-y-4">
                                <div className="p-4 bg-zinc-900 rounded-xl border border-white/5 text-left">
                                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">Direct Link</p>
                                    <div className="flex items-center justify-between gap-2">
                                        <code className="text-xs text-zinc-300 truncate font-mono">{guestUrl}</code>
                                        <button onClick={() => copyToClipboard(guestUrl)} className="text-zinc-400 hover:text-white">
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => downloadQRCode(qrCode, formData.nama_acara)}
                                    className="w-full py-4 bg-white text-black font-bold text-sm rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Download QR Image
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. CREATE EVENT FORM */}
            {view === 'create' && !isQrOnlyMode && (
                <div className="max-w-4xl mx-auto">
                    
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/10">
                            <Plus className="w-6 h-6 text-zinc-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Buat Acara Baru</h2>
                            <p className="text-sm text-zinc-500">Isi detail untuk generate QR Code buku tamu</p>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -z-10 pointer-events-none opacity-20"/>
                        
                        <form onSubmit={createEvent} className="space-y-8 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <InputField 
                                    label="Nama Acara"
                                    icon={Hash}
                                    placeholder="Contoh: Townhall Meeting Q1"
                                    value={formData.nama_acara}
                                    onChange={(e) => setFormData({ ...formData, nama_acara: e.target.value })}
                                    required
                                />
                                <InputField 
                                    label="Tanggal Pelaksanaan"
                                    type="date"
                                    icon={Calendar}
                                    value={formData.tanggal_acara}
                                    onChange={(e) => setFormData({ ...formData, tanggal_acara: e.target.value })}
                                    required
                                />
                                <InputField 
                                    label="Lokasi Acara"
                                    icon={MapPin}
                                    placeholder="Contoh: Aula Utama Lt. 2"
                                    value={formData.lokasi}
                                    onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                                    required
                                />
                                
                                {/* Textarea Wrapper */}
                                <div className="space-y-2 group md:col-span-1">
                                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold group-focus-within:text-white transition-colors">
                                        Deskripsi Tambahan
                                    </label>
                                    <div className="relative h-[calc(100%-28px)]">
                                        <div className="absolute top-3.5 left-4 pointer-events-none">
                                            <AlignLeft className="h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                                        </div>
                                        <textarea
                                            rows={1}
                                            className="w-full h-[52px] bg-zinc-900/50 border border-white/10 text-white text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-all placeholder:text-zinc-600 resize-none"
                                            placeholder="Opsional"
                                            value={formData.deskripsi}
                                            onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setView('events');
                                        setFormData({ nama_acara: '', tanggal_acara: '', lokasi: '', deskripsi: '' });
                                        setQrCode('');
                                        setGuestUrl('');
                                    }}
                                    className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading['create']}
                                    className="px-8 py-3 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {actionLoading['create'] ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <span>Generate QR</span>
                                            <QrCode className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CreateBukuTamu