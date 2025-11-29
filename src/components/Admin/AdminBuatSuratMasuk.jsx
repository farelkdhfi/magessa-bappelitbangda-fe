import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  Send, Building2, FileText, Sparkles, Camera, X, Eye, Plus,
  Upload, Mail, Pencil, BookOpen, CheckCircle, ArrowRight, File,
  FileIcon, Calendar // Tambahkan icon Calendar jika ingin variasi label
} from 'lucide-react'
import { api } from '../../utils/api'

const AdminBuatSuratMasuk = () => {
  const navigate = useNavigate()
  // Form state
  const [formData, setFormData] = useState({
    asal_instansi: '',
    tanggal_surat: '',
    diterima_tanggal: '',
    nomor_agenda: '',
    nomor_surat: '',
    keterangan: ''
  })
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [previewModal, setPreviewModal] = useState({ isOpen: false, imageUrl: '', index: null, isPdf: false })
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const MAX_FILES = 10
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validateFile = (file) => {
    // Izinkan file gambar dan PDF
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      toast.error(`File ${file.name}: Hanya file gambar dan PDF yang diizinkan!`)
      return false
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File ${file.name}: Ukuran maksimal 5MB!`)
      return false
    }
    return true
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    if (selectedFiles.length + files.length > MAX_FILES) {
      toast.error(`Maksimal ${MAX_FILES} file!`)
      return
    }

    const validFiles = files.filter(validateFile)
    if (validFiles.length === 0) return

    const newFiles = [...selectedFiles, ...validFiles]
    setSelectedFiles(newFiles)

    const newUrls = [...previewUrls]
    validFiles.forEach((file, index) => {
      if (file.type === 'application/pdf') {
        // Untuk PDF, simpan file object atau null sebagai placeholder
        newUrls[selectedFiles.length + index] = null
      } else {
        // Untuk gambar, buat preview URL
        const reader = new FileReader()
        reader.onload = (e) => {
          newUrls[selectedFiles.length + index] = e.target.result
          setPreviewUrls([...newUrls])
        }
        reader.readAsDataURL(file)
      }
    })

    e.target.value = ''
  }

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    const newUrls = previewUrls.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    setPreviewUrls(newUrls)
  }

  const openPreviewModal = (url, index) => {
    const file = selectedFiles[index]
    const isPdf = file && file.type === 'application/pdf'

    if (isPdf) {
      // Untuk PDF, buat URL blob untuk preview
      const fileUrl = URL.createObjectURL(file)
      setPreviewModal({ isOpen: true, imageUrl: fileUrl, index, isPdf: true })
    } else {
      setPreviewModal({ isOpen: true, imageUrl: url, index, isPdf: false })
    }
  }

  const closePreviewModal = () => {
    // Bersihkan URL blob jika itu PDF
    if (previewModal.isPdf && previewModal.imageUrl) {
      URL.revokeObjectURL(previewModal.imageUrl)
    }
    setPreviewModal({ isOpen: false, imageUrl: '', index: null, isPdf: false })
  }

  const formatDateIndo = (dateString) => {
    if (!dateString) return ''
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ]
    // Split berdasarkan '-' agar tidak terkena masalah timezone
    const [year, month, day] = dateString.split('-')
    return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`
  }

 const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.asal_instansi || !formData.nomor_surat || !formData.tanggal_surat || !formData.diterima_tanggal || !formData.nomor_agenda || !formData.keterangan) {
      toast.error("Lengkapi semua data surat!")
      return
    }
    if (selectedFiles.length === 0) {
      toast.error("Unggah minimal 1 file (foto atau PDF)!")
      return
    }

    setLoading(true)
    try {
      const submitData = new FormData()

      // 1. Masukkan semua data KECUALI tanggal (karena akan diformat manual)
      Object.entries(formData).forEach(([k, v]) => {
        if (k !== 'tanggal_surat' && k !== 'diterima_tanggal') {
          submitData.append(k, v)
        }
      })

      // 2. Masukkan tanggal yang SUDAH DIUBAH formatnya ke "1 Januari 2025"
      submitData.append('tanggal_surat', formatDateIndo(formData.tanggal_surat))
      submitData.append('diterima_tanggal', formatDateIndo(formData.diterima_tanggal))

      // 3. Data tambahan lain
      submitData.append('tujuan_jabatan', 'Kepala Bapelitbangda')
      selectedFiles.forEach(file => submitData.append('photos', file))

      // Debug: Cek di console browser untuk memastikan formatnya benar
      console.log("Tanggal Surat:", formatDateIndo(formData.tanggal_surat)) 
      console.log("Diterima Tanggal:", formatDateIndo(formData.diterima_tanggal))

      await api.post('/surat-masuk', submitData)
      toast.success('Surat & disposisi berhasil dibuat!')
      navigate('/admin')
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.error || 'Gagal mengirim surat')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className='min-h-screen'>
      {/* Single Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Data Surat Masuk Section */}
        <div className="bg-white p-4 rounded-2xl border-2 border-[#EDE6E3] shadow-md hover:shadow-lg transition-all duration-300">
          <h2 className="text-base font-semibold mb-6 flex items-center">
            <div className="p-2.5 bg-white rounded-xl shadow-md mr-1">
              <Building2 className="w-5 h-5 text-teal-400" />
            </div>
            Data Surat Masuk
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Asal Instansi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="asal_instansi"
                value={formData.asal_instansi}
                onChange={handleChange}
                onFocus={() => setFocusedField('asal_instansi')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 rounded-xl outline-none border-2 transition-all duration-300 bg-[#FDFCFB] ${focusedField === 'asal_instansi'
                  ? 'border-teal-400 shadow-lg ring-4 ring-teal-400/20'
                  : 'border-[#EDE6E3] hover:border-teal-400'}`}
                style={{ color: '#2E2A27' }}
                placeholder="Contoh: Dinas Pendidikan Kota Tasikmalaya"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#6D4C41' }}>
                Nomor Surat <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nomor_surat"
                value={formData.nomor_surat}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 outline-none bg-[#FDFCFB] border-[#EDE6E3] focus:border-teal-400 focus:shadow-lg focus:ring-4 focus:ring-teal-400/20 hover:border-teal-400 transition-all duration-300"
                style={{ color: '#2E2A27' }}
                placeholder="Contoh: 123/ABC/2024"
                required
              />
            </div>
            
            {/* === UPDATE: MENGGUNAKAN DATE PICKER (Tanggal Surat) === */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#6D4C41' }}>
                Tanggal Surat <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="tanggal_surat"
                value={formData.tanggal_surat}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 outline-none bg-[#FDFCFB] border-[#EDE6E3] focus:border-teal-400 focus:shadow-lg focus:ring-4 focus:ring-teal-400/20 hover:border-teal-400 transition-all duration-300 cursor-pointer"
                style={{ color: '#2E2A27' }}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
            {/* === UPDATE: MENGGUNAKAN DATE PICKER (Diterima Tanggal) === */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#6D4C41' }}>
                Diterima Tanggal <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="diterima_tanggal"
                value={formData.diterima_tanggal}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 outline-none bg-[#FDFCFB] border-[#EDE6E3] focus:border-teal-400 focus:shadow-lg focus:ring-4 focus:ring-teal-400/20 hover:border-teal-400 transition-all duration-300 cursor-pointer"
                style={{ color: '#2E2A27' }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#6D4C41' }}>
                Nomor Agenda <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nomor_agenda"
                value={formData.nomor_agenda}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 outline-none bg-[#FDFCFB] border-[#EDE6E3] focus:border-teal-400 focus:shadow-lg focus:ring-4 focus:ring-teal-400/20 hover:border-teal-400 transition-all duration-300"
                style={{ color: '#2E2A27' }}
                placeholder="Contoh: 1212"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#6D4C41' }}>
              Keterangan <span className="text-red-500">*</span>
            </label>
            <textarea
              name="keterangan"
              value={formData.keterangan}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-xl outline-none border-2 bg-[#FDFCFB] border-[#EDE6E3] resize-none focus:border-teal-400 focus:shadow-lg focus:ring-4 focus:ring-teal-400/20 hover:border-teal-400 transition-all duration-300"
              style={{ color: '#2E2A27' }}
              placeholder="Jelaskan isi surat secara singkat..."
              required
            />
          </div>
        </div>

        {/* Upload Foto Section (TIDAK BERUBAH) */}
        <div className="bg-white p-6 rounded-2xl border-2 border-[#EDE6E3] shadow-md hover:shadow-lg transition-all duration-300">
          <h2 className="text-base font-semibold mb-6 flex items-center" style={{ color: '#2E2A27' }}>
            <div className="p-2.5 bg-white rounded-xl shadow-md mr-3">
              <Camera className="w-5 h-5 text-teal-400" />
            </div>
            Upload File Surat <span className="text-red-500 text-sm ml-1">*</span>
          </h2>
          <input
            type="file"
            id="photos"
            accept="image/*,application/pdf"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          {selectedFiles.length === 0 ? (
            <label htmlFor="photos" className="block text-center p-12 border-2 border-dashed border-[#EDE6E3] rounded-xl cursor-pointer hover:bg-[#FDFCFB] hover:border-teal-400 transition-all duration-300">
              <Upload className="w-10 h-10 mx-auto mb-4" style={{ color: '#6D4C41' }} />
              <p className="font-semibold" style={{ color: '#2E2A27' }}>Klik untuk upload file</p>
              <p className="text-sm" style={{ color: '#6D4C41' }}>JPEG, PNG, GIF, WEBP, PDF (maks 5MB)</p>
            </label>
          ) : (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    {file.type === 'application/pdf' ? (
                      <div
                        className="w-full h-24 bg-[#FDFCFB] rounded-lg flex flex-col items-center justify-center cursor-pointer border-2 border-[#EDE6E3] hover:border-teal-400 transition-all duration-300"
                        onClick={() => openPreviewModal(null, index)}
                      >
                        <FileIcon className="w-8 h-8 text-red-500 mb-1" />
                        <span className="text-xs text-center px-1 truncate w-full" style={{ color: '#6D4C41' }}>
                          {file.name.substring(0, 15)}{file.name.length > 15 ? '...' : ''}
                        </span>
                      </div>
                    ) : (
                      <img
                        src={previewUrls[index]}
                        alt=""
                        className="w-full h-24 object-cover rounded-lg cursor-pointer border-2 border-[#EDE6E3] hover:border-teal-400 transition-all duration-300"
                        onClick={() => openPreviewModal(previewUrls[index], index)}
                      />
                    )}
                    <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openPreviewModal(file.type === 'application/pdf' ? null : previewUrls[index], index)
                        }}
                        className="text-white hover:scale-110 transition-transform"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index)
                        }}
                        className="text-white hover:scale-110 transition-transform"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {selectedFiles.length < MAX_FILES && (
                  <label
                    htmlFor="photos"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-[#EDE6E3] rounded-lg h-24 cursor-pointer hover:bg-[#FDFCFB] hover:border-teal-400 transition-all duration-300"
                  >
                    <Plus className="w-5 h-5" style={{ color: '#6D4C41' }} />
                    <span className="text-xs" style={{ color: '#6D4C41' }}>Tambah</span>
                  </label>
                )}
              </div>
              <p className="text-sm" style={{ color: '#6D4C41' }}>
                {selectedFiles.length}/{MAX_FILES} file — Total {(selectedFiles.reduce((a, b) => a + b.size, 0) / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="px-12 py-4 bg-black text-white rounded-xl shadow-lg font-semibold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center space-x-2 text-sm hover:shadow-xl transform hover:scale-105"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Mengirim...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Kirim Surat</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Modal Preview */}
      {previewModal.isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={closePreviewModal}
              className="absolute -top-12 right-0 text-white hover:scale-110 transition-transform"
            >
              <X className="w-8 h-8" />
            </button>

            {previewModal.isPdf ? (
              // Tampilan untuk PDF
              <div className="bg-white rounded-xl shadow-2xl h-[80vh] flex flex-col border-2 border-[#EDE6E3]">
                <div className="p-4 border-b border-[#EDE6E3] flex items-center">
                  <FileIcon className="w-5 h-5 text-red-500 mr-2" />
                  <span className="font-medium truncate" style={{ color: '#2E2A27' }}>
                    {selectedFiles[previewModal.index]?.name}
                  </span>
                </div>
                <div className="flex-grow overflow-hidden">
                  <iframe
                    src={previewModal.imageUrl}
                    className="w-full h-full rounded-b-xl"
                    title="PDF Preview"
                  />
                </div>
              </div>
            ) : (
              // Tampilan untuk gambar
              <img
                src={previewModal.imageUrl}
                alt="Preview"
                className="max-h-[80vh] rounded-xl shadow-2xl mx-auto border-2 border-[#EDE6E3]"
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
export default AdminBuatSuratMasuk