import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FileText, MessageSquare, Users, LayoutGrid } from 'lucide-react'; // Menambahkan beberapa ikon untuk header section
import ForwardModal from '../../components/Sekretaris/ForwardModal';
import toast from 'react-hot-toast';
import { atasanDisposisiService } from '../../services/atasanDisposisiService';
import DisposisiHeader from '../../components/Sekretaris/DisposisiHeader';
import FeedbackForm from '../../components/Sekretaris/FeedbackForm';
import { DisposisiContentSection } from '../../components/Sekretaris/DisposisiContentSection';
import DisposisiInfoCard from '../../components/Sekretaris/DisposisiInfoCard';
import FeedbackBawahan from '../../components/Sekretaris/FeedbackBawahan';
import MyFeedback from '../../components/Sekretaris/MyFeedback';
import ImageModal from '../../components/Sekretaris/ImageModal';
import LoadingSpinner from '../../components/Ui/LoadingSpinner'; 

const SekretarisDisposisiDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [disposisi, setDisposisi] = useState(location.state?.disposisi || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [acceptError, setAcceptError] = useState(null);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  // State untuk feedback
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    notes: '',
    status: 'diproses',
    files: []
  });
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  // State untuk feedback dari bawahan
  const [subordinateFeedback, setSubordinateFeedback] = useState(null);
  const [subFeedbackLoading, setSubFeedbackLoading] = useState(false);
  const [subFeedbackError, setSubFeedbackError] = useState(null);
  // State untuk edit feedback - ubah menjadi ID feedback yang sedang diedit
  const [editingFeedbackId, setEditingFeedbackId] = useState(null);
  const [editFeedbackData, setEditFeedbackData] = useState({
    notes: '',
    status: 'diproses',
    newFiles: [],
    removeFileIds: [],
    existingFiles: []
  });
  const [editLoading, setEditLoading] = useState(false);

  const fetchDisposisiDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await atasanDisposisiService.getAtasanDisposisiDetail(id);
      setDisposisi(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisposisiDetail();
  }, [id]);

  // Fetch feedback data
  const fetchFeedbackForDisposisi = async (role = 'sekretaris') => {
    try {
      setFeedbackLoading(true);
      const response = await atasanDisposisiService.getMyFeedback(role);
      const result = response.data;
      let feedbacks = [];
      if (result && Array.isArray(result.data)) {
        feedbacks = result.data;
      } else if (result && Array.isArray(result)) {
        feedbacks = result;
      }
      // Filter feedback untuk disposisi ini saja
      const filteredFeedback = feedbacks.filter(
        fb => fb.disposisi_id === disposisi.id
      );
      setFeedbackList(filteredFeedback);
    } catch (err) {
      console.error('Error fetching feedback:', err);
      toast.error('Gagal memuat feedback');
    } finally {
      setFeedbackLoading(false);
    }
  };

  // Fetch feedback dari bawahan
  const fetchSubordinateFeedback = useCallback(async (role = 'sekretaris') => {
    // Hanya fetch jika disposisi ada dan sudah diteruskan ke seseorang
    if (!disposisi || !disposisi.diteruskan_kepada_user_id) {
      setSubordinateFeedback(null);
      return;
    }
    try {
      setSubFeedbackLoading(true);
      setSubFeedbackError(null);
      const feedbackData = await atasanDisposisiService.getFeedbackDariBawahan(role, id);
      setSubordinateFeedback(feedbackData);
    } catch (err) {
      console.error('Error fetching subordinate feedback:', err);
      // Jika 404, itu berarti belum ada feedback
      if (err.status !== 404) {
        setSubFeedbackError('Gagal memuat feedback dari bawahan: ' + err.message);
        toast.error('Gagal memuat feedback dari bawahan');
      } else {
        setSubordinateFeedback(null);
      }
    } finally {
      setSubFeedbackLoading(false);
    }
  }, [disposisi?.diteruskan_kepada_user_id, id]);

  // Handle terima disposisi
  const handleAcceptDisposisi = async () => {
    try {
      setAcceptLoading(true);
      setAcceptError(null);
      const response = await atasanDisposisiService.acceptDisposisiSekretaris(id);
      if (response.data) {
        // Update disposisi state dengan data yang baru
        const updatedData = response.data.data || response.data;
        setDisposisi(prevDisposisi => ({
          ...prevDisposisi,
          status_dari_sekretaris: updatedData.status_dari_sekretaris || 'diterima'
        }));
        toast.success(response.data.message || 'Disposisi berhasil diterima!');
        fetchDisposisiDetail();
      }
    } catch (err) {
      setAcceptError(err.message);
      toast.error(`Error: ${err.message}`);
    } finally {
      setAcceptLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!disposisi?.id) return;
    setDownloadLoading(true);
    setDownloadError(null);
    try {
      const blobData = await atasanDisposisiService.downloadPDF(disposisi.id);
      // Buat URL objek dari blob
      const blob = new Blob([blobData], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      // Buat elemen <a> sementara untuk trigger download
      const link = document.createElement('a');
      link.href = url;
      // Gunakan nomor surat atau ID untuk nama file, sesuai dengan backend
      const filename = `disposisi-${disposisi.nomor_surat || disposisi.id}.pdf`;
      link.setAttribute('download', filename); // Atribut download
      // Tambahkan ke DOM, klik, lalu hapus
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Hapus URL objek setelah beberapa saat untuk membebaskan memori
      window.setTimeout(() => window.URL.revokeObjectURL(url), 100);
      toast.success('PDF berhasil diunduh!');
    } catch (err) {
      console.error('Gagal mengunduh PDF:', err);
      setDownloadError(err.message);
      toast.error('Gagal mengunduh PDF.');
    } finally {
      setDownloadLoading(false);
    }
  };

  // Handle forward success
  const handleForwardSuccess = () => {
    // Update disposisi status to 'diteruskan'
    setDisposisi(prevDisposisi => ({
      ...prevDisposisi,
      status_dari_sekretaris: 'diteruskan'
    }));
    toast.success('Disposisi berhasil diteruskan!');
    fetchDisposisiDetail();
  };

  // Handler untuk feedback baru
  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFeedbackData(prev => ({
      ...prev,
      files: files.slice(0, 5) // Maksimal 5 file
    }));
  };
  const handleFeedbackSubmit = async (e, role = 'sekretaris') => {
    e.preventDefault();
    try {
      setFeedbackLoading(true);
      setFeedbackError(null);
      const formData = new FormData();
      formData.append('notes', feedbackData.notes);
      formData.append('status', feedbackData.status);
      // ✅ TAMBAHKAN INI - Backend memerlukan status_dari_sekretaris
      formData.append('status_dari_sekretaris', feedbackData.status);
      feedbackData.files.forEach(file => {
        formData.append('feedback_files', file);
      });
      const response = await atasanDisposisiService.createFeedback(role, id, formData);
      setFeedbackSuccess(true);
      setShowFeedbackForm(false);
      setFeedbackData({ notes: '', status: 'diproses', files: [] });
      // Refresh feedback data
      fetchDisposisiDetail();
      fetchFeedbackForDisposisi();
      toast.success('Feedback berhasil dikirim!');
    } catch (err) {
      setFeedbackError(err.message);
      toast.error(`Error: ${err.message}`);
    } finally {
      setFeedbackLoading(false);
    }
  };

  // Handler untuk edit feedback
  const handleEditFeedbackChange = (e) => {
    const { name, value } = e.target;
    setEditFeedbackData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleEditFileChange = (e) => {
    const files = Array.from(e.target.files);
    setEditFeedbackData(prev => ({
      ...prev,
      newFiles: files.slice(0, 5) // Maksimal 5 file
    }));
  };
  const handleRemoveExistingFile = (fileId) => {
    setEditFeedbackData(prev => ({
      ...prev,
      removeFileIds: [...prev.removeFileIds, fileId],
      existingFiles: prev.existingFiles.filter(file => file.id !== fileId)
    }));
  };
  const handleEditFeedbackSubmit = async (e, role = 'sekretaris') => {
    e.preventDefault();
    try {
      setEditLoading(true);
      setFeedbackError(null);
      const formData = new FormData();
      formData.append('notes', editFeedbackData.notes);
      formData.append('status', editFeedbackData.status);
      formData.append('status_dari_sekretaris', editFeedbackData.status);
      // Tambahkan file baru
      editFeedbackData.newFiles.forEach(file => {
        formData.append('new_feedback_files', file);
      });
      // Tambahkan ID file yang akan dihapus
      editFeedbackData.removeFileIds.forEach(fileId => {
        formData.append('remove_file_ids', fileId);
      });
      const response = await atasanDisposisiService.updateFeedback(role, editingFeedbackId, formData);
      setEditingFeedbackId(null);
      setEditFeedbackData({
        notes: '',
        status: 'diproses',
        newFiles: [],
        removeFileIds: [],
        existingFiles: []
      });
      // Refresh feedback data
      fetchDisposisiDetail();
      fetchFeedbackForDisposisi();
      toast.success('Feedback berhasil diperbarui!');
    } catch (err) {
      setFeedbackError(err.message);
      toast.error(`Error: ${err.message}`);
    } finally {
      setEditLoading(false);
    }
  };
  const cancelEditFeedback = () => {
    setEditingFeedbackId(null);
    setEditFeedbackData({
      notes: '',
      status: 'diproses',
      newFiles: [],
      removeFileIds: [],
      existingFiles: []
    });
    setFeedbackError(null);
  };

  // Fungsi untuk mengambil detail feedback untuk edit
  const fetchFeedbackForEdit = async (feedbackId, role = 'sekretaris') => {
    try {
      setEditLoading(true);
      const response = await atasanDisposisiService.getFeedbackForEdit(role, feedbackId);
      const feedback = response.data;
      setEditFeedbackData({
        notes: feedback.notes || '',
        status: feedback.disposisi?.status || 'diproses',
        newFiles: [],
        removeFileIds: [],
        existingFiles: feedback.files || []
      });
      setEditingFeedbackId(feedbackId);
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setEditLoading(false);
    }
  };

  useEffect(() => {
    if (disposisi) {
      fetchFeedbackForDisposisi();
      fetchSubordinateFeedback();
    }
  }, [disposisi?.id]);

  // ----- STYLE CONSTANTS (Zinc Aesthetic) -----
  const glassCardStyle = "bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden shadow-2xl shadow-black/20 p-6 md:p-8 relative group hover:border-white/10 transition-all duration-500";
  const sectionHeaderStyle = "flex items-center gap-3 mb-6 pb-4 border-b border-white/5";
  const sectionIconBoxStyle = "p-2 bg-zinc-800/50 rounded-xl border border-white/5 text-zinc-400 group-hover:text-white group-hover:bg-zinc-800 transition-colors";
  const sectionTitleStyle = "text-xs font-bold text-zinc-500 uppercase tracking-widest";
  // --------------------------------------------

  // Loading state updated to match dark theme
  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              {/* Menggunakan komponen LoadingSpinner jika tersedia, atau fallback manual */}
              {typeof LoadingSpinner !== 'undefined' ? <LoadingSpinner /> : (
                  <div className="flex flex-col items-center gap-3 text-zinc-400">
                      <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
                      <p className="text-sm font-medium tracking-widest uppercase">Memuat Data...</p>
                  </div>
              )}
          </div>
      );
  }

  // No data state updated to dark theme
  if (!disposisi) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className={glassCardStyle + " text-center max-w-md mx-auto"}>
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
             <FileText className="w-10 h-10 text-zinc-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Data Tidak Ditemukan</h3>
          <p className="text-zinc-400 mb-8 leading-relaxed">Disposisi tidak ditemukan atau Anda tidak memiliki izin untuk mengaksesnya saat ini.</p>
          <button
            onClick={() => navigate('/sekretaris')}
            className="px-6 py-3 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold transition-all shadow-lg shadow-white/5"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    // Ubah container utama menjadi tema gelap
    <div className="min-h-screen text-zinc-100 font-sans selection:bg-white/20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Header Section - Dibungkus agar sesuai dengan tema gelap jika komponen internalnya belum mendukung */}
        <div className="relative">
             {/* Background glow effect untuk header */}
             <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-3xl opacity-50 -z-10" />
             <DisposisiHeader
              disposisi={disposisi}
              onDownloadPDF={handleDownloadPDF}
              downloadLoading={downloadLoading}
              onAcceptDisposisi={handleAcceptDisposisi}
              acceptLoading={acceptLoading}
              acceptError={acceptError}
              onShowForwardModal={() => setShowForwardModal(true)}
              onShowFeedbackForm={() => setShowFeedbackForm(true)}
              showForwardModal={showForwardModal}
              showFeedbackForm={showFeedbackForm}
              editingFeedbackId={editingFeedbackId}
            />
        </div>


        {disposisi && (
          <div className="space-y-8">
            {/* Modals & Forms tetap ada secara logika */}
            <ForwardModal
              isOpen={showForwardModal}
              onClose={() => setShowForwardModal(false)}
              disposisi={disposisi}
              onSuccess={handleForwardSuccess}
            />

            {/* Form Feedback akan muncul di sini jika diaktifkan */}
            <div className={`${showFeedbackForm ? 'animate-in fade-in slide-in-from-top-4 duration-300' : ''}`}>
                <FeedbackForm
                  showFeedbackForm={showFeedbackForm}
                  setShowFeedbackForm={setShowFeedbackForm}
                  showForwardModal={showForwardModal}
                  feedbackData={feedbackData}
                  feedbackError={feedbackError}
                  feedbackLoading={feedbackLoading}
                  handleFeedbackChange={handleFeedbackChange}
                  handleFeedbackSubmit={handleFeedbackSubmit}
                  handleFileChange={handleFileChange}
                  editingFeedbackId={editingFeedbackId}
                />
            </div>


            {/* === MAIN CONTENT CARD (Menggantikan gradient div yang lama) === */}
            <div className={glassCardStyle}>
                {/* Background Glow Effect Internal */}
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500 pointer-events-none" />

              <div className="relative z-10 space-y-10">
                  {/* Section 1: Informasi Surat */}
                  <section>
                      <div className={sectionHeaderStyle}>
                          <div className={sectionIconBoxStyle}>
                              <LayoutGrid className="w-4 h-4" />
                          </div>
                          <h3 className={sectionTitleStyle}>Detail & Metadata Surat</h3>
                      </div>
                      <div className="text-zinc-300">
                        <DisposisiInfoCard disposisi={disposisi} />
                      </div>
                  </section>

                  {/* Section 2: Isi Disposisi & Lampiran */}
                  <section>
                      <div className={sectionHeaderStyle}>
                          <div className={sectionIconBoxStyle}>
                              <FileText className="w-4 h-4" />
                          </div>
                          <h3 className={sectionTitleStyle}>Instruksi & Konten Disposisi</h3>
                      </div>
                      <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                        <DisposisiContentSection
                          disposisi={disposisi}
                          onImageClick={setSelectedImage}
                        />
                      </div>
                  </section>
              </div>
            </div>

            {/* === Feedback dari Bawahan CARD === */}
            {/* Dibungkus dalam card terpisah agar sesuai style baru karena aslinya di luar main card */}
            {(disposisi.diteruskan_kepada_user_id) && (
                <div className={glassCardStyle + " border-l-4 border-l-indigo-500/50"}>
                   <div className={sectionHeaderStyle}>
                          <div className={sectionIconBoxStyle + " !text-indigo-400 !bg-indigo-500/10"}>
                              <Users className="w-4 h-4" />
                          </div>
                          <h3 className={sectionTitleStyle}>Respon / Feedback Bawahan</h3>
                      </div>
                  <div className="text-zinc-300">
                    <FeedbackBawahan
                      disposisi={disposisi}
                      setSelectedImage={setSelectedImage}
                      subFeedbackError={subFeedbackError}
                      subFeedbackLoading={subFeedbackLoading}
                      subordinateFeedback={subordinateFeedback}
                    />
                  </div>
                </div>
            )}


            {/* === Feedback yang Telah Dikirim CARD === */}
             {/* Dibungkus dalam card terpisah */}
            <div className={glassCardStyle}>
                   <div className={sectionHeaderStyle}>
                          <div className={sectionIconBoxStyle}>
                              <MessageSquare className="w-4 h-4" />
                          </div>
                          <h3 className={sectionTitleStyle}>Riwayat Feedback Anda</h3>
                      </div>
              <div className="text-zinc-300">
                <MyFeedback
                  feedbackList={feedbackList}
                  editFeedbackData={editFeedbackData}
                  editingFeedbackId={editingFeedbackId}
                  editLoading={editLoading}
                  showFeedbackForm={showFeedbackForm}
                  showForwardModal={showForwardModal}
                  fetchFeedbackForEdit={fetchFeedbackForEdit}
                  feedbackError={feedbackError}
                  handleEditFeedbackChange={handleEditFeedbackChange}
                  handleEditFeedbackSubmit={handleEditFeedbackSubmit}
                  handleEditFileChange={handleEditFileChange}
                  handleRemoveExistingFile={handleRemoveExistingFile}
                  cancelEditFeedback={cancelEditFeedback}
                  setSelectedImage={setSelectedImage}
                />
              </div>
            </div>

          </div>
        )}
      </div>
      {/* Modal Gambar Fullscreen */}
      <ImageModal
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />
    </div>
  );
};

export default SekretarisDisposisiDetail;