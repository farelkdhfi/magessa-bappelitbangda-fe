import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  FileText,
  ArrowLeft,
  LayoutGrid,
  Loader2,
  AlertCircle
} from 'lucide-react';
import ForwardModal from '../../components/Kabid/ForwardModal';
import toast from 'react-hot-toast';
import { atasanDisposisiService } from '../../services/atasanDisposisiService';
import DisposisiHeader from '../../components/Kabid/DisposisiHeader';
import DisposisiInfoCard from '../../components/Kabid/DisposisiInfoCard';
import { DisposisiContentSection } from '../../components/Kabid/DisposisiContentSection';
import MyFeedback from '../../components/Kabid/MyFeedback';
import FeedbackForm from '../../components/Kabid/FeedbackForm';
import FeedbackBawahan from '../../components/Kabid/FeedbackBawahan';
import ImageModal from '../../components/Kabid/ImageModal';

const KabidDisposisiDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [disposisi, setDisposisi] = useState(location.state?.disposisi || null);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [acceptError, setAcceptError] = useState(null);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  
  // State untuk edit feedback
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

  const fetchFeedbackForDisposisi = async (role = 'user') => {
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

  const fetchSubordinateFeedback = useCallback(async (role = 'user') => {
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

  const handleAcceptDisposisi = async () => {
    try {
      setAcceptLoading(true);
      setAcceptError(null);
      const response = await atasanDisposisiService.acceptDisposisiKabid(id);
      if (response.data) {
        const updatedData = response.data.data || response.data;
        setDisposisi(prevDisposisi => ({
          ...prevDisposisi,
          status_dari_kabid: updatedData.status_dari_kabid || 'diterima'
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
      const blob = new Blob([blobData], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const filename = `disposisi-${disposisi.nomor_surat || disposisi.id}.pdf`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

  const handleForwardSuccess = () => {
    setDisposisi(prevDisposisi => ({
      ...prevDisposisi,
      status_dari_kabid: 'diteruskan'
    }));
    toast.success('Disposisi berhasil diteruskan!');
    fetchDisposisiDetail();
  };

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
      files: files.slice(0, 5)
    }));
  };

  const handleFeedbackSubmit = async (e, role = 'user') => {
    e.preventDefault();
    try {
      setFeedbackLoading(true);
      setFeedbackError(null);

      const formData = new FormData();
      formData.append('notes', feedbackData.notes);
      formData.append('status', feedbackData.status);
      formData.append('status_dari_kabid', feedbackData.status);
      feedbackData.files.forEach(file => {
        formData.append('feedback_files', file);
      });

      const response = await atasanDisposisiService.createFeedback(role, id, formData);

      setFeedbackSuccess(true);
      setShowFeedbackForm(false);
      setFeedbackData({ notes: '', status: 'diproses', files: [] });
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
      newFiles: files.slice(0, 5)
    }));
  };

  const handleRemoveExistingFile = (fileId) => {
    setEditFeedbackData(prev => ({
      ...prev,
      removeFileIds: [...prev.removeFileIds, fileId],
      existingFiles: prev.existingFiles.filter(file => file.id !== fileId)
    }));
  };

  const handleEditFeedbackSubmit = async (e, role = 'user') => {
    e.preventDefault();
    try {
      setEditLoading(true);
      setFeedbackError(null);

      const formData = new FormData();
      formData.append('notes', editFeedbackData.notes);
      formData.append('status', editFeedbackData.status);
      formData.append('status_dari_kabid', editFeedbackData.status);

      editFeedbackData.newFiles.forEach(file => {
        formData.append('new_feedback_files', file);
      });

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

  const fetchFeedbackForEdit = async (feedbackId, role = 'user') => {
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

  // Loading State (Custom Dark Theme)
  if (loading && !disposisi) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Memuat Data...</p>
        </div>
      </div>
    );
  }

  // No Data State (Glassmorphism Style)
  if (!disposisi && !loading) {
    return (
      <div className="min-h-screen font-sans selection:bg-white/20 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-8 text-center relative overflow-hidden">
           {/* Background Glow */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          
           <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-zinc-800/50 rounded-2xl border border-white/5 flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-zinc-400" />
              </div>
              <h3 className="text-xl font-light text-white mb-2">Data Tidak Ditemukan</h3>
              <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
                Disposisi yang Anda cari tidak tersedia atau Anda tidak memiliki akses untuk melihatnya.
              </p>
              <button
                onClick={() => navigate('/kabid')}
                className="w-full py-3 px-4 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold transition-all shadow-lg shadow-white/5 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Daftar
              </button>
           </div>
        </div>
      </div>
    );
  }

  // Main Render (Bento Layout & Dark Glass Theme)
  return (
    <div className="min-h-screen text-zinc-300 font-sans selection:bg-white/20 pb-20 pt-6 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-8">        

        {/* Component Header Wrapper */}
        <div className="relative">
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
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Modals & Forms */}
            <ForwardModal
              isOpen={showForwardModal}
              onClose={() => setShowForwardModal(false)}
              disposisi={disposisi}
              onSuccess={handleForwardSuccess}
            />
            
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

            {/* Main Information Card (Glassmorphism Container) */}
            <div className="group relative bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-1 overflow-hidden">
               {/* Decorative Glow */}
               <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl pointer-events-none group-hover:bg-white/[0.05] transition-colors duration-500" />
               
               <div className="relative z-10 p-5 md:p-8 space-y-8">
                  {/* Top Info Section */}
                  <div className="border-b border-white/5 pb-8">
                     <DisposisiInfoCard disposisi={disposisi} />
                  </div>

                  {/* Content Detail Section */}
                  <div>
                      <DisposisiContentSection
                        disposisi={disposisi}
                        onImageClick={setSelectedImage}
                      />
                  </div>
               </div>
            </div>

            {/* Two Column Grid for Feedbacks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Bawahan Feedback */}
                <div className="bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl p-6 min-h-[300px]">
                    <div className="mb-4 flex items-center gap-3">
                         <div className="p-2 bg-zinc-800/50 rounded-xl border border-white/5">
                             <FileText className="w-4 h-4 text-zinc-400" />
                         </div>
                         <h3 className="text-sm font-semibold text-white">Feedback Bawahan</h3>
                    </div>
                    <FeedbackBawahan
                        disposisi={disposisi}
                        setSelectedImage={setSelectedImage}
                        subFeedbackError={subFeedbackError}
                        subFeedbackLoading={subFeedbackLoading}
                        subordinateFeedback={subordinateFeedback}
                    />
                </div>

                {/* Right Column: My Feedback */}
                <div className="bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl p-6 min-h-[300px]">
                    <div className="mb-4 flex items-center gap-3">
                         <div className="p-2 bg-zinc-800/50 rounded-xl border border-white/5">
                             <FileText className="w-4 h-4 text-zinc-400" />
                         </div>
                         <h3 className="text-sm font-semibold text-white">Feedback Saya</h3>
                    </div>
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

      {/* Global Image Modal */}
      <ImageModal
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />
    </div>
  );
};

export default KabidDisposisiDetail;