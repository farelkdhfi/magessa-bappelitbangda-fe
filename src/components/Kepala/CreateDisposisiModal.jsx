import { useState } from "react";
// 1. Tambahkan import createPortal dari react-dom
import { createPortal } from "react-dom";
import { api } from "../../utils/api";
import { 
  FileText, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  CornerDownRight, 
  FileEdit,
  AlignLeft,
  Calendar,
  Building
} from "lucide-react";
import toast from 'react-hot-toast';

const CreateDisposisiModal = ({ surat, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    sifat: '',
    perihal: '',
    disposisi_kepada_jabatan: '',
    dengan_hormat_harap: '',
    catatan: ''
  });
  const [loading, setLoading] = useState(false);

  const sifatOptions = ['Sangat Segera', 'Segera', 'Rahasia'];
  const jabatanOptions = [
    'Sekretaris',
    'Kasubag Umum dan Kepegawaian',
    'Kasubag Keuangan',
    'Kabid Pendanaan, Pengendalian, dan Evaluasi',
    'Kabid Pemerintahan dan Pembangunan Manusia',
    'Kabid Perekonomian, Infrastruktur, dan Kewilayahan',
    'Kabid Penelitian dan Pengembangan'
  ];
  const instruksiOptions = [
    'Tanggapan dan Saran',
    'Wakili / Hadir / Terima',
    'Mendampingi Saya',
    'Untuk Ditindaklanjuti',
    'Pelajari / Telaah / Sarannya',
    'Untuk Dikaji Sesuai dengan Ketentuan',
    'Untuk Dibantu / Dipertimbangkan / Sesuai dengan Ketentuan',
    'Selesaikan / Proses Sesuai Ketentuan',
    'Monitor Realisasinya / Perkembangannya',
    'Siapkan Pointers / Sambutan / Bahan',
    'Menghadap / Informasinya',
    'Membaca / File / Referensi',
    'Agendakan / Jadwalkan / Koordinasikan'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.sifat || !formData.perihal || !formData.disposisi_kepada_jabatan || !formData.dengan_hormat_harap) {
      toast.error('Semua field wajib diisi', {
        style: { background: '#333', color: '#fff' }
      });
      return;
    }

    setLoading(true);

    try {
      await api.post(`/disposisi/${surat.id}`, formData);
      toast.success('Disposisi berhasil dibuat', {
        style: { background: '#333', color: '#fff' }
      });
      onSuccess();
    } catch (error) {
      console.error('Error creating disposisi:', error);
      toast.error('Gagal membuat disposisi: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  // 2. Bungkus seluruh return JSX dengan createPortal(JSX, document.body)
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={!loading ? onClose : undefined}
      />

      {/* Modal Content */}
      <div className="relative bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-zinc-900/30">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-500/10 rounded-xl border border-teal-500/20 text-teal-400">
              <FileEdit className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Buat Disposisi</h3>
              <p className="text-xs text-zinc-500">Instruksi tindak lanjut surat masuk</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* Info Surat Card */}
          <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-4 relative overflow-hidden">
             {/* Glow Effect */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
             
             <div className="flex items-center gap-2 mb-4 relative z-10">
                <FileText className="w-4 h-4 text-zinc-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Detail Surat</span>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                <div className="space-y-1">
                   <p className="text-[10px] text-zinc-500 uppercase">Nomor Surat</p>
                   <p className="text-sm font-medium text-white truncate">{surat.nomor_surat || '-'}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Tanggal Surat
                   </p>
                   <p className="text-sm font-medium text-white">{surat.tanggal_surat || '-'}</p>
                </div>
                <div className="md:col-span-2 space-y-1">
                   <p className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
                      <Building className="w-3 h-3" /> Asal Instansi
                   </p>
                   <p className="text-sm font-medium text-white">{surat.asal_instansi || '-'}</p>
                </div>
             </div>
          </div>

          {/* Form Fields */}
          <form id="disposisi-form" onSubmit={handleSubmit} className="space-y-5">
            
            {/* Sifat & Perihal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                  Sifat Disposisi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                   <select
                    value={formData.sifat}
                    onChange={(e) => setFormData({ ...formData, sifat: e.target.value })}
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 focus:bg-zinc-900 appearance-none cursor-pointer transition-all"
                    required
                  >
                    <option value="" className="text-zinc-500">Pilih Sifat</option>
                    {sifatOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                  Perihal <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <AlignLeft className="absolute left-4 top-3.5 w-4 h-4 text-zinc-600" />
                  <textarea
                    value={formData.perihal}
                    onChange={(e) => setFormData({ ...formData, perihal: e.target.value })}
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 focus:bg-zinc-900 transition-all min-h-[80px]"
                    placeholder="Tulis perihal disposisi..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Tujuan & Instruksi */}
            <div className="space-y-5">
               <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                  Diteruskan Kepada <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                   <select
                    value={formData.disposisi_kepada_jabatan}
                    onChange={(e) => setFormData({ ...formData, disposisi_kepada_jabatan: e.target.value })}
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 focus:bg-zinc-900 appearance-none cursor-pointer transition-all"
                    required
                  >
                    <option value="" className="text-zinc-500">Pilih Jabatan Tujuan</option>
                    {jabatanOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                  Instruksi (Dengan Hormat Harap) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                   <select
                    value={formData.dengan_hormat_harap}
                    onChange={(e) => setFormData({ ...formData, dengan_hormat_harap: e.target.value })}
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 focus:bg-zinc-900 appearance-none cursor-pointer transition-all"
                    required
                  >
                    <option value="" className="text-zinc-500">Pilih Instruksi</option>
                    {instruksiOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <CornerDownRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Catatan */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Catatan Tambahan (Opsional)
              </label>
              <textarea
                value={formData.catatan}
                onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 focus:bg-zinc-900 transition-all min-h-[80px]"
                placeholder="Tambahkan catatan khusus jika diperlukan..."
              />
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/5 bg-zinc-900/30 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 transition-all"
          >
            Batal
          </button>
          <button
            type="submit"
            form="disposisi-form"
            disabled={loading}
            className={`px-6 py-3 rounded-xl text-sm font-bold bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/10 transition-all flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Simpan Disposisi
              </>
            )}
          </button>
        </div>

      </div>
    </div>,
    document.body // Target render ke body
  );
};

export default CreateDisposisiModal;