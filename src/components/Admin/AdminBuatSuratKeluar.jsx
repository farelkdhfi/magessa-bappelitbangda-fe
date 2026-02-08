import React, { useState } from 'react';
import { api } from '../../utils/api';
import {
  FileText, Calendar, Building2, Upload, Plus, X, Eye, FileIcon, Send, Paperclip, AlignLeft, Hash
} from 'lucide-react';
import toast from 'react-hot-toast';
import InputField from '../InputField';

const AdminBuatSuratKeluar = () => {
  const [formData, setFormData] = useState({
    nama_surat: '',
    tanggal_surat: '',
    ditujukan_ke: '',
    keterangan: ''
  });

  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewModal, setPreviewModal] = useState({ isOpen: false, imageUrl: '', index: null, isPdf: false });

  const MAX_FILES = 10;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error(`File ${file.name}: Hanya file gambar dan PDF yang diizinkan!`);
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File ${file.name}: Ukuran maksimal 5MB!`);
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length === 0) return;

    if (files.length + newFiles.length > MAX_FILES) {
      toast.error(`Maksimal ${MAX_FILES} file!`);
      return;
    }

    const validFiles = newFiles.filter(validateFile);
    if (validFiles.length === 0) return;

    const updatedFiles = [...files, ...validFiles];
    setFiles(updatedFiles);

    const newUrls = [...previewUrls];
    validFiles.forEach((file, index) => {
      if (file.type === 'application/pdf') {
        newUrls[files.length + index] = null;
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          newUrls[files.length + index] = e.target.result;
          setPreviewUrls([...newUrls]);
        };
        reader.readAsDataURL(file);
      }
    });

    e.target.value = '';
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviewUrls(newUrls);
  };

  const openPreviewModal = (url, index) => {
    const file = files[index];
    const isPdf = file && file.type === 'application/pdf';

    if (isPdf) {
      const fileUrl = URL.createObjectURL(file);
      setPreviewModal({ isOpen: true, imageUrl: fileUrl, index, isPdf: true });
    } else {
      setPreviewModal({ isOpen: true, imageUrl: url, index, isPdf: false });
    }
  };

  const closePreviewModal = () => {
    if (previewModal.isPdf && previewModal.imageUrl) {
      URL.revokeObjectURL(previewModal.imageUrl);
    }
    setPreviewModal({ isOpen: false, imageUrl: '', index: null, isPdf: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nama_surat || !formData.tanggal_surat || !formData.ditujukan_ke) {
      toast.error("Lengkapi semua data wajib!");
      return;
    }

    if (files.length === 0) {
      toast.error("Unggah minimal 1 file (foto atau PDF)!");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      files.forEach(file => {
        formDataToSend.append('lampiran', file);
      });

      await api.post('/surat-keluar', formDataToSend);

      toast.success('Surat keluar berhasil dibuat!');
      
      setFormData({
        nama_surat: '',
        tanggal_surat: '',
        ditujukan_ke: '',
        keterangan: ''
      });
      setFiles([]);
      setPreviewUrls([]);
      
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Gagal membuat surat keluar';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }; 

  return (
    <div className="w-full max-w-5xl mx-auto pb-20">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: DATA UTAMA */}
        <div className="bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -z-10 pointer-events-none opacity-20"/>
            
            <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                    <FileText className="w-5 h-5 text-zinc-300" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-white">Detail Surat Keluar</h2>
                    <p className="text-xs text-zinc-500">Informasi surat yang akan dikirim</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Kolom Kiri */}
                <div className="space-y-6">
                    <InputField
                        label="Nama / Perihal Surat"
                        name="nama_surat"
                        icon={Hash}
                        placeholder="Contoh: Undangan Rapat Koordinasi"
                        value={formData.nama_surat}
                        onChange={handleChange}
                        required
                    />
                     <InputField 
                        label="Ditujukan Kepada"
                        name="ditujukan_ke"
                        icon={Building2}
                        placeholder="Contoh: Dinas Kesehatan"
                        value={formData.ditujukan_ke}
                        onChange={handleChange}
                        required
                    />
                    <InputField 
                        label="Tanggal Surat"
                        name="tanggal_surat"
                        type="date"
                        icon={Calendar}
                        value={formData.tanggal_surat}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Kolom Kanan */}
                <div className="space-y-6 h-full">
                    <div className="space-y-2 group h-full">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold group-focus-within:text-white transition-colors">
                            Keterangan Tambahan
                        </label>
                        <div className="relative h-[calc(100%-28px)]">
                             <div className="absolute top-4 left-4 pointer-events-none">
                                <AlignLeft className="h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                            </div>
                            <textarea
                                name="keterangan"
                                value={formData.keterangan}
                                onChange={handleChange}
                                rows={4}
                                className="w-full h-full bg-zinc-900/50 border border-white/10 text-white text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 focus:bg-zinc-900 transition-all placeholder:text-zinc-600 resize-none leading-relaxed"
                                placeholder="Tambahkan catatan atau instruksi khusus (opsional)..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* SECTION 2: FILE UPLOAD */}
        <div className="bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                    <Paperclip className="w-5 h-5 text-zinc-300" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-white">Lampiran Digital</h2>
                    <p className="text-xs text-zinc-500">Scan dokumen surat keluar (PDF/Gambar)</p>
                </div>
            </div>

            <input
                type="file"
                id="lampiran"
                accept="image/*,application/pdf"
                multiple
                onChange={handleFileChange}
                className="hidden"
            />

            {files.length === 0 ? (
                <label 
                    htmlFor="lampiran" 
                    className="group flex flex-col items-center justify-center p-16 border border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/[0.02] hover:border-white/20 transition-all duration-300"
                >
                    <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-zinc-800 transition-all duration-300">
                        <Upload className="w-6 h-6 text-zinc-400 group-hover:text-white" />
                    </div>
                    <p className="text-sm font-medium text-white mb-1">Klik untuk upload dokumen</p>
                    <p className="text-xs text-zinc-500">Mendukung PDF, JPG, PNG (Max 5MB)</p>
                </label>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {files.map((file, index) => (
                            <div key={index} className="group relative aspect-square bg-zinc-900 rounded-xl border border-white/10 overflow-hidden hover:border-white/30 transition-all">
                                {file.type === 'application/pdf' ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center p-4" onClick={() => openPreviewModal(null, index)}>
                                        <FileIcon className="w-10 h-10 text-white/20 mb-2 group-hover:text-white/50 transition-colors" />
                                        <span className="text-[10px] text-zinc-500 text-center line-clamp-2 px-1 break-words leading-tight">
                                            {file.name}
                                        </span>
                                    </div>
                                ) : (
                                    <img
                                        src={previewUrls[index]}
                                        alt=""
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                        onClick={() => openPreviewModal(previewUrls[index], index)}
                                    />
                                )}
                                
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2 backdrop-blur-[2px]">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openPreviewModal(file.type === 'application/pdf' ? null : previewUrls[index], index)
                                        }}
                                        className="p-2 bg-white/10 rounded-full hover:bg-white text-white hover:text-black transition-all"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile(index)
                                        }}
                                        className="p-2 bg-rose-500/10 rounded-full hover:bg-rose-500 text-rose-500 hover:text-white transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {files.length < MAX_FILES && (
                            <label
                                htmlFor="lampiran"
                                className="flex flex-col items-center justify-center aspect-square border border-dashed border-white/10 rounded-xl cursor-pointer hover:bg-white/[0.02] hover:border-white/30 transition-all"
                            >
                                <Plus className="w-6 h-6 text-zinc-500 mb-2" />
                                <span className="text-[10px] uppercase tracking-widest text-zinc-500">Tambah</span>
                            </label>
                        )}
                    </div>
                    
                    <div className="flex items-center justify-between px-1">
                        <p className="text-xs text-zinc-500 font-mono">
                            {files.length}/{MAX_FILES} FILES
                        </p>
                        <p className="text-xs text-zinc-500 font-mono">
                            {(files.reduce((a, b) => a + b.size, 0) / 1024 / 1024).toFixed(2)} MB TOTAL
                        </p>
                    </div>
                </div>
            )}
        </div>

        {/* SECTION 3: ACTION BUTTON */}
        <div className="flex justify-end pt-4">
            <button
                type="submit"
                disabled={loading}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-bold text-sm tracking-wide overflow-hidden transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.02]"
            >
                {loading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        <span>MENYIMPAN...</span>
                    </>
                ) : (
                    <>
                        <span>SIMPAN SURAT</span>
                        <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </>
                )}
            </button>
        </div>

      </form>

      {/* PREVIEW MODAL */}
      {previewModal.isOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
            <div className="relative w-full max-w-5xl h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            {previewModal.isPdf ? <FileText className="w-5 h-5 text-white" /> : <Eye className="w-5 h-5 text-white" />}
                        </div>
                        <span className="text-white text-sm font-medium truncate max-w-md">
                            {files[previewModal.index]?.name}
                        </span>
                     </div>
                     <button
                        onClick={closePreviewModal}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                     >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden relative shadow-2xl">
                    {previewModal.isPdf ? (
                        <iframe
                            src={previewModal.imageUrl}
                            className="w-full h-full"
                            title="PDF Preview"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center p-4">
                            <img
                                src={previewModal.imageUrl}
                                alt="Preview"
                                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminBuatSuratKeluar;