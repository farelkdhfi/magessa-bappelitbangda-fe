import { Calendar, X, MapPin, Clock, AlignLeft, Hash, Users, Flag, Search, CheckCircle } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import InputField from '../InputField';

// Logic Validasi tetap dipertahankan
const isPastDateTime = (tanggal, waktu) => {
  if (!tanggal || !waktu) return false;
  const inputDateTime = new Date(`${tanggal}T${waktu}:00+07:00`);
  const now = new Date();
  return inputDateTime < now;
};

const isInvalidEndTime = (tanggalMulai, waktuMulai, tanggalSelesai, waktuSelesai) => {
  if (!tanggalMulai || !waktuMulai || !tanggalSelesai || !waktuSelesai) return false;
  const start = new Date(`${tanggalMulai}T${waktuMulai}:00+07:00`);
  const end = new Date(`${tanggalSelesai}T${waktuSelesai}:00+07:00`);
  return end <= start;
};

const AdminBuatJadwalAcara = ({
  showForm,
  editingId,
  resetForm,
  handleSubmit,
  formData,
  setFormData,
  searchLocation,
  showRecommendations,
  recommendations,
  selectRecommendation,
  loading,
}) => {
  const waktuMulaiRef = useRef(null);
  const waktuSelesaiRef = useRef(null);

  // Auto-focus logic
  useEffect(() => {
    if (formData.tanggal_mulai && formData.waktu_mulai && isPastDateTime(formData.tanggal_mulai, formData.waktu_mulai)) {
      waktuMulaiRef.current?.focus();
    }
  }, [formData.tanggal_mulai, formData.waktu_mulai]);

  useEffect(() => {
    if (isInvalidEndTime(formData.tanggal_mulai, formData.waktu_mulai, formData.tanggal_selesai, formData.waktu_selesai)) {
      waktuSelesaiRef.current?.focus();
    }
  }, [formData.tanggal_selesai, formData.waktu_selesai]);

  const hasPastTimeError = formData.tanggal_mulai && formData.waktu_mulai && isPastDateTime(formData.tanggal_mulai, formData.waktu_mulai);
  const hasInvalidEndTimeError = isInvalidEndTime(formData.tanggal_mulai, formData.waktu_mulai, formData.tanggal_selesai, formData.waktu_selesai);
  const hasAnyError = hasPastTimeError || hasInvalidEndTimeError;  
 

  const SelectField = ({ label, value, onChange, options, icon: Icon }) => (
    <div className="space-y-2 group">
      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold group-focus-within:text-white transition-colors">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
        </div>
        <select
          value={value}
          onChange={onChange}
          className="w-full bg-zinc-900/50 border border-white/10 text-white text-sm rounded-xl pl-11 pr-10 py-3.5 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 hover:border-white/20 transition-all appearance-none cursor-pointer"
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white">{opt.label}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
    </div>
  );

  if (!showForm) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={resetForm}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl h-full max-h-[90vh] bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-zinc-950/50 backdrop-blur-md z-10">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <Calendar className="h-5 w-5 text-zinc-200" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">
                        {editingId ? 'Edit Jadwal' : 'Buat Jadwal Baru'}
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">
                        Event Management System
                    </p>
                </div>
            </div>
            <button
                onClick={resetForm}
                className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
            >
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* SECTION 1: Detail Utama */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Informasi Dasar</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <InputField 
                                label="Nama Acara" 
                                name="nama_acara" 
                                value={formData.nama_acara} 
                                onChange={(e) => setFormData({ ...formData, nama_acara: e.target.value })} 
                                icon={Hash}
                                placeholder="Contoh: Rapat Koordinasi Tahunan"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <div className="space-y-2 group">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold group-focus-within:text-white transition-colors">
                                    Deskripsi
                                </label>
                                <div className="relative">
                                    <div className="absolute top-3.5 left-4 pointer-events-none">
                                        <AlignLeft className="h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                                    </div>
                                    <textarea
                                        value={formData.deskripsi}
                                        onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                                        rows={3}
                                        className="w-full bg-zinc-900/50 border border-white/10 text-white text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-all placeholder:text-zinc-600 resize-none leading-relaxed"
                                        placeholder="Jelaskan detail acara secara singkat..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION 2: Waktu & Tanggal */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Waktu Pelaksanaan</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField 
                            label="Tanggal Mulai" 
                            type="date"
                            value={formData.tanggal_mulai} 
                            onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })} 
                            icon={Calendar}
                            required
                        />
                        <InputField 
                            label="Tanggal Selesai" 
                            type="date"
                            value={formData.tanggal_selesai} 
                            onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })} 
                            icon={Calendar}
                        />
                        <InputField 
                            label="Waktu Mulai" 
                            type="time"
                            value={formData.waktu_mulai} 
                            onChange={(e) => setFormData({ ...formData, waktu_mulai: e.target.value })} 
                            icon={Clock}
                            required
                            inputRef={waktuMulaiRef}
                            error={hasPastTimeError ? "Waktu tidak boleh berlalu" : null}
                        />
                        <InputField 
                            label="Waktu Selesai" 
                            type="time"
                            value={formData.waktu_selesai} 
                            onChange={(e) => setFormData({ ...formData, waktu_selesai: e.target.value })} 
                            icon={Clock}
                            inputRef={waktuSelesaiRef}
                            error={hasInvalidEndTimeError ? "Harus setelah waktu mulai" : null}
                        />
                    </div>
                </div>

                {/* SECTION 3: Lokasi */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Lokasi & Peta</span>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {/* Location Search Bar */}
                        <div className="space-y-2 group">
                            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold group-focus-within:text-white transition-colors">
                                Cari Lokasi *
                            </label>
                            <div className="relative flex gap-2">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <MapPin className="h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={formData.lokasi}
                                        onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                                        className="w-full bg-zinc-900/50 border border-white/10 text-white text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-all placeholder:text-zinc-600"
                                        placeholder="Ketik alamat atau nama gedung..."
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => searchLocation(formData.lokasi)}
                                    disabled={loading || !formData.lokasi.trim()}
                                    className="px-6 py-3.5 bg-white text-black rounded-xl text-sm font-bold hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                >
                                    {loading ? '...' : <Search className="w-4 h-4" />}
                                </button>

                                {/* Dropdown Recommendations */}
                                {showRecommendations && recommendations.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                        {recommendations.map((rec, index) => (
                                            <div
                                                key={index}
                                                onClick={() => selectRecommendation(rec)}
                                                className="px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 group/item"
                                            >
                                                <div className="text-sm font-medium text-white group-hover/item:text-teal-400 transition-colors">{rec.title}</div>
                                                {rec.address && (
                                                    <div className="text-xs text-zinc-500 mt-0.5 truncate">{rec.address}</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Map Preview */}
                        <div className="h-48 w-full border border-white/10 rounded-xl overflow-hidden bg-zinc-900 relative group">
                            {loading ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                </div>
                            ) : formData.lokasi ? (
                                <>
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(90%) grayscale(20%)' }}
                                        src={`https://www.google.com/maps?q=${encodeURIComponent(formData.lokasi)}&output=embed`}
                                        allowFullScreen
                                        title="Lokasi Acara"
                                        className="w-full h-full opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                                    />
                                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs text-white">
                                        {formData.serp_data ? "📍 Lokasi Terverifikasi" : "✏️ Input Manual"}
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 gap-2">
                                    <MapPin className="w-8 h-8 opacity-20" />
                                    <span className="text-xs">Preview peta akan muncul di sini</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* SECTION 4: Konfigurasi Tambahan */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Konfigurasi</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField 
                            label="Nama PIC" 
                            name="pic_nama" 
                            value={formData.pic_nama} 
                            onChange={(e) => setFormData({ ...formData, pic_nama: e.target.value })} 
                            icon={Hash}
                            required
                        />
                        <InputField 
                            label="Kontak PIC" 
                            name="pic_kontak" 
                            value={formData.pic_kontak} 
                            onChange={(e) => setFormData({ ...formData, pic_kontak: e.target.value })} 
                            icon={Hash}
                        />
                        <SelectField
                            label="Kategori"
                            value={formData.kategori}
                            onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                            icon={AlignLeft}
                            options={[
                                { value: 'umum', label: 'Umum' },
                                { value: 'rapat', label: 'Rapat' },
                                { value: 'pelatihan', label: 'Pelatihan' },
                                { value: 'seminar', label: 'Seminar' },
                            ]}
                        />
                        <SelectField
                            label="Prioritas"
                            value={formData.prioritas}
                            onChange={(e) => setFormData({ ...formData, prioritas: e.target.value })}
                            icon={Flag}
                            options={[
                                { value: 'biasa', label: 'Biasa' },
                                { value: 'penting', label: 'Penting' },
                                { value: 'sangat penting', label: 'Sangat Penting' },
                            ]}
                        />
                        <InputField 
                            label="Target Peserta" 
                            type="number"
                            name="peserta_target" 
                            value={formData.peserta_target} 
                            onChange={(e) => setFormData({ ...formData, peserta_target: e.target.value })} 
                            icon={Users}
                            min="1"
                        />
                        <SelectField
                            label="Status Awal"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            icon={CheckCircle}
                            options={[
                                { value: 'aktif', label: 'Aktif' },
                                { value: 'selesai', label: 'Selesai' },
                                { value: 'dibatalkan', label: 'Dibatalkan' },
                                { value: 'ditunda', label: 'Ditunda' },
                            ]}
                        />
                    </div>
                </div>

            </form>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-5 border-t border-white/5 bg-zinc-950/80 backdrop-blur-xl flex justify-end gap-3 z-10">
            <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
            >
                Batal
            </button>
            <button
                onClick={handleSubmit}
                disabled={loading || hasAnyError}
                className="px-8 py-3 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
                {loading ? 'Processing...' : editingId ? 'Update Jadwal' : 'Simpan Jadwal'}
            </button>
        </div>

      </div>
    </div>
  );
};

export default AdminBuatJadwalAcara;