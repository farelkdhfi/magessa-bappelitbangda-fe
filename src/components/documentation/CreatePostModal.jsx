import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  X,
  Camera,
  Image,
  FileText,
  Plus,
  Trash2,
  Loader2, // Menggunakan Loader2 untuk spinner yang lebih baik
  CheckCircle,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';

// --- COMPONENTS ---

const SuccessModal = ({ isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
      <div className="bg-neutral-900 rounded-2xl p-6 shadow-2xl transform animate-pulse border border-neutral-800">
        <div className="text-center">
          <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">
            Post Berhasil Dibagikan!
          </h3>
          <p className="text-neutral-400 text-sm">
            Post Anda telah berhasil dipublikasikan
          </p>
        </div>
      </div>
    </div>
  );
};

const AlertModal = ({ isVisible, message, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[80]">
      <div className="bg-neutral-900 rounded-2xl p-6 shadow-2xl border border-neutral-800 max-w-sm w-full animate-in fade-in zoom-in duration-200">
        <div className="text-center">
          <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Perhatian</h3>
          <p className="text-neutral-400 text-sm mb-6">{message}</p>
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-white hover:bg-neutral-200 text-black rounded-xl font-medium transition-colors text-sm"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};

const CreatePostModal = ({
  showCreatePost,
  setShowCreatePost,
  handleCreatePost
}) => {
  // --- CONFIG ---
  const categories = useMemo(() => [
    { id: 1, name: 'umum', label: 'Umum' },
    { id: 2, name: 'pekerjaan', label: 'Pekerjaan' },
    { id: 3, name: 'tutorial', label: 'Tutorial' },
    { id: 4, name: 'hiburan', label: 'Hiburan' }
  ], []);

  // --- STATE ---
  const [mobileStep, setMobileStep] = useState('upload'); // 'upload' | 'details'
  
  const [postData, setPostData] = useState({
    caption: '',
    files: [],
    kategori: '',
    tags: ''
  });

  const [filePreviews, setFilePreviews] = useState([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [alertState, setAlertState] = useState({
    isVisible: false,
    message: ''
  });

  // --- HELPERS ---
  const showAlert = useCallback((message) => {
    setAlertState({ isVisible: true, message });
  }, []);

  const closeAlert = useCallback(() => {
    setAlertState(prev => ({ ...prev, isVisible: false }));
  }, []);

  const defaultCategory = useMemo(() => {
    return categories && categories.length > 0 ? categories[0].name : '';
  }, [categories]);

  // --- EFFECTS ---

  // 1. Reset Form on Open
  useEffect(() => {
    if (showCreatePost) {
      setPostData({
        caption: '',
        files: [],
        kategori: defaultCategory,
        tags: ''
      });
      setSelectedFileIndex(0);
      setFilePreviews([]);
      setIsLoading(false);
      setShowSuccessModal(false);
      setAlertState({ isVisible: false, message: '' });
      setMobileStep('upload');
    }
  }, [showCreatePost, defaultCategory]);

  // 2. Manage Previews & URLs
  useEffect(() => {
    const previews = postData.files.map(file => {
      if (file?.type?.startsWith('image/')) {
        return { type: 'image', url: URL.createObjectURL(file) };
      }
      return { type: 'document', url: null };
    });

    setFilePreviews(previews);

    // Safety check for index
    if (postData.files.length === 0) {
      setSelectedFileIndex(0);
    } else if (selectedFileIndex >= postData.files.length) {
      setSelectedFileIndex(postData.files.length - 1);
    }

    // Cleanup function
    return () => {
      previews.forEach(preview => {
        if (preview.url) URL.revokeObjectURL(preview.url);
      });
    };
  }, [postData.files]); // Dependency on files array is intentional

  // --- HANDLERS ---

  const handleLocalFileUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf'
    ];

    // 1. Validasi Tipe
    const validFiles = files.filter(file => allowedTypes.includes(file.type));
    if (validFiles.length !== files.length) {
      showAlert("Hanya file gambar (JPG, PNG, GIF, WebP) dan PDF yang diizinkan.");
      e.target.value = ''; // Reset input
      return;
    }

    // 2. Validasi Jumlah (Current + New <= 5)
    if (postData.files.length + validFiles.length > 5) {
      showAlert("Maksimal 5 file yang bisa diunggah.");
      e.target.value = ''; // Reset input
      return;
    }

    // 3. Update State
    setPostData(prev => ({
      ...prev,
      files: [...prev.files, ...validFiles]
    }));
    
    e.target.value = '';
  }, [postData.files.length, showAlert]);

  const removeFile = useCallback((indexToRemove) => {
    setPostData(prev => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== indexToRemove)
    }));

    // Adjust selected index safely
    setSelectedFileIndex(prev => {
      if (indexToRemove === prev) {
         // Jika menghapus yg sedang dipilih, mundur 1 langkah (min 0)
        return Math.max(0, prev - 1);
      } else if (indexToRemove < prev) {
        // Jika menghapus item SEBELUM yg dipilih, index geser kiri
        return prev - 1;
      }
      // Jika menghapus item SETELAH yg dipilih, index tetap
      return prev;
    });
  }, []);

  const handleInputChange = useCallback((field, value) => {
    setPostData(prev => ({ ...prev, [field]: value }));
  }, []);

  const validateForm = useCallback(() => {
    if (!postData.caption || postData.caption.trim().length === 0) {
      showAlert("Caption wajib diisi");
      return false;
    }
    if (!postData.files || postData.files.length === 0) {
      showAlert("Minimal 1 file harus diunggah");
      return false;
    }
    return true;
  }, [postData, showAlert]);

  const handleSave = useCallback(async () => {
    if (!validateForm() || isLoading) return;

    setIsLoading(true);
    try {
      await handleCreatePost(postData);
      
      // Success handling
      setShowSuccessModal(true);
      
      // Reset logic
      setPostData({
        caption: '',
        files: [],
        kategori: defaultCategory,
        tags: ''
      });

      // Close modal after delay
      setTimeout(() => {
        setShowCreatePost(false);
      }, 500);

    } catch (error) {
      console.error("Error creating post:", error);
      showAlert("Gagal membuat post. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }, [postData, handleCreatePost, defaultCategory, setShowCreatePost, validateForm, isLoading, showAlert]);

  const handleClose = useCallback(() => {
    if (!isLoading) setShowCreatePost(false);
  }, [setShowCreatePost, isLoading]);


  // --- RENDER HELPERS (Untuk Mengurangi Duplikasi Kode) ---

  const renderMainPreview = () => (
    <div className="flex-1 bg-black rounded-xl overflow-hidden mb-4 relative border border-neutral-800 aspect-square lg:aspect-auto">
      {postData.files.length > 0 ? (
        <div className="w-full h-full flex items-center justify-center">
          {filePreviews[selectedFileIndex]?.type === 'image' && filePreviews[selectedFileIndex]?.url ? (
            <img
              src={filePreviews[selectedFileIndex].url}
              alt={`Preview ${selectedFileIndex + 1}`}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full bg-neutral-800 flex flex-col items-center justify-center">
              <FileText className="w-12 h-12 text-neutral-400 mb-2" />
              <span className="text-neutral-400 text-sm font-medium px-4 text-center truncate max-w-full">
                {postData.files[selectedFileIndex]?.name || 'File PDF'}
              </span>
            </div>
          )}
          
          {/* File Counter Indicator */}
          {postData.files.length > 1 && (
             <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
               {selectedFileIndex + 1} / {postData.files.length}
             </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600">
           {/* Tampilan Kosong berbeda untuk Mobile/Desktop bisa diatur disini */}
           <div className="lg:hidden flex flex-col items-center">
             <Camera className="w-16 h-16 mb-4" />
             <p className="text-sm text-neutral-400">Belum ada media dipilih</p>
           </div>
           <div className="hidden lg:block text-center">
             <Image className="w-16 h-16 mx-auto mb-4" />
             <p className="text-neutral-500">Tidak ada file dipilih</p>
           </div>
        </div>
      )}
    </div>
  );

  const renderThumbnails = () => (
    <div className="space-y-3">
      {postData.files.length > 0 ? (
        <div className="flex space-x-2 overflow-x-auto pt-2 pb-2 scrollbar-thin scrollbar-thumb-neutral-700">
          {postData.files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className={`relative flex-shrink-0 cursor-pointer rounded-lg border-2 transition-all w-16 h-16 lg:w-20 lg:h-20 ${
                selectedFileIndex === index
                  ? 'border-white ring-2 ring-white/20'
                  : 'border-neutral-700 hover:border-neutral-500'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFileIndex(index);
              }}
            >
              <div className="w-full h-full bg-neutral-800 rounded-md overflow-hidden">
                {filePreviews[index]?.type === 'image' && filePreviews[index]?.url ? (
                  <img
                    src={filePreviews[index].url}
                    alt={`Thumb ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-neutral-400" />
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-neutral-700 hover:bg-red-500 text-white rounded-full flex items-center justify-center shadow-md transition-colors z-10"
                disabled={isLoading}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        // Empty State Upload Box (Desktop Only mostly, or shared)
        <label
          htmlFor="file-upload-main"
          className="hidden lg:flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-700 rounded-lg cursor-pointer hover:border-neutral-500 hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-8 h-8 text-neutral-500 mb-2" />
          <div className="text-center">
            <p className="text-sm font-medium text-white">Tambahkan foto atau PDF</p>
            <p className="text-xs text-neutral-500 mt-1">Klik untuk mengunggah</p>
          </div>
        </label>
      )}

      {/* Add More Button (When files exist) */}
      {postData.files.length > 0 && postData.files.length < 5 && (
        <label
          htmlFor="file-upload-main"
          className="flex items-center justify-center py-3 px-4 border border-dashed border-neutral-600 rounded-xl cursor-pointer hover:bg-neutral-800 transition-colors text-sm text-neutral-300 font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah File ({postData.files.length}/5)
        </label>
      )}
      
      {/* Empty State Button (Mobile Only) */}
      {postData.files.length === 0 && (
         <label
         htmlFor="file-upload-main"
         className="lg:hidden w-full py-3 px-6 bg-white text-black rounded-xl text-sm font-bold text-center cursor-pointer hover:bg-neutral-200 transition-colors flex items-center justify-center"
       >
         <Plus className="w-5 h-5 mr-2" />
         Pilih Media
       </label>
      )}
    </div>
  );

  const renderFormFields = () => (
    <div className="space-y-6">
      <div className="relative border-b border-neutral-800 pb-2">
        <textarea
          placeholder="Tulis caption untuk post Anda..."
          value={postData.caption}
          onChange={(e) => postData.caption.length < 2200 && handleInputChange('caption', e.target.value)}
          className="w-full h-32 bg-transparent text-white placeholder-neutral-500 resize-none focus:outline-none p-2 text-sm leading-relaxed"
          disabled={isLoading}
        />
        <div className="text-right text-xs text-neutral-500 mt-1">
          {postData.caption.length}/2200
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-white mb-2">Kategori</label>
          <select
            value={postData.kategori}
            onChange={(e) => handleInputChange('kategori', e.target.value)}
            className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-white transition-all text-white text-sm"
            disabled={isLoading}
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">Tags</label>
          <input
            type="text"
            placeholder="Contoh: #olahraga #liburan"
            value={postData.tags}
            onChange={(e) => handleInputChange('tags', e.target.value)}
            className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-white transition-all text-white placeholder-neutral-500 text-sm"
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );

  // --- MAIN RENDER ---

  if (!showCreatePost) return null;

  return (
    <>
      {/* GLOBAL FILE INPUT (Shared by both Mobile & Desktop) */}
      <input
        type="file"
        multiple
        accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
        onChange={handleLocalFileUpload}
        className="hidden"
        id="file-upload-main"
        disabled={isLoading}
      />

      {/* --- DESKTOP MODAL --- */}
      <div className="hidden lg:flex fixed inset-0 bg-black/80 backdrop-blur-sm items-center justify-center p-4 z-50">
        <div className="bg-neutral-900 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden border border-neutral-800 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="relative px-6 py-4 border-b border-neutral-800 flex-shrink-0">
            <h2 className="text-lg font-semibold text-center text-white">Buat Post Baru</h2>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-800 transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Left Column: Media */}
            <div className="w-1/2 bg-black/20 p-6 flex flex-col border-r border-neutral-800">
              {renderMainPreview()}
              {renderThumbnails()}
            </div>

            {/* Right Column: Form */}
            <div className="w-1/2 p-6 flex flex-col bg-neutral-900 overflow-y-auto">
              <div className="flex-1">
                {renderFormFields()}
              </div>
              
              <div className="flex space-x-3 pt-6 mt-4 border-t border-neutral-800">
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 px-6 text-white bg-transparent border border-neutral-700 rounded-xl font-medium hover:bg-neutral-800 transition-all disabled:opacity-50"
                  disabled={isLoading}
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading || !postData.caption.trim() || postData.files.length === 0}
                  className="flex-1 py-3 px-6 bg-white hover:bg-neutral-200 text-black rounded-xl font-bold transition-all shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Memposting...
                    </>
                  ) : (
                    'Bagikan'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MOBILE FULLSCREEN --- */}
      <div className="lg:hidden fixed inset-0 bg-neutral-900 z-50 flex flex-col">
        {/* Mobile Header */}
        <header className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between bg-neutral-900">
          {mobileStep === 'upload' ? (
            <>
              <button onClick={handleClose} disabled={isLoading} className="text-white p-2">
                <X className="w-6 h-6" />
              </button>
              <h1 className="text-base font-semibold text-white">Pilih Media</h1>
              <button
                onClick={() => {
                   if(postData.files.length === 0) return showAlert("Minimal 1 file harus diunggah");
                   setMobileStep('details');
                }}
                disabled={postData.files.length === 0}
                className="text-blue-400 font-semibold disabled:opacity-50"
              >
                Lanjut
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setMobileStep('upload')} disabled={isLoading} className="text-white p-2">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-base font-semibold text-white">Detail Post</h1>
              <button
                onClick={handleSave}
                disabled={isLoading || !postData.caption.trim()}
                className="text-blue-400 font-semibold disabled:opacity-50 flex items-center"
              >
                {isLoading && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                Bagikan
              </button>
            </>
          )}
        </header>

        {/* Mobile Content */}
        <div className="flex-1 overflow-y-auto bg-neutral-900 p-4">
          {mobileStep === 'upload' ? (
            <div className="space-y-6 h-full flex flex-col">
               <div className="flex-1">
                 {renderMainPreview()}
               </div>
               <div className="mt-auto">
                 {renderThumbnails()}
               </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex gap-4">
                 {/* Mini preview next to caption input for context */}
                 <div className="w-20 h-20 bg-neutral-800 rounded-lg overflow-hidden flex-shrink-0 border border-neutral-700">
                    {filePreviews[selectedFileIndex]?.url ? (
                       <img src={filePreviews[selectedFileIndex].url} alt="Mini" className="w-full h-full object-cover" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center"><FileText className="text-neutral-500" /></div>
                    )}
                 </div>
                 <div className="flex-1">
                    {/* Simplified Caption Input for Mobile */}
                    <textarea 
                       placeholder="Tulis caption..."
                       value={postData.caption}
                       onChange={(e) => handleInputChange('caption', e.target.value)}
                       className="w-full h-20 bg-transparent text-white placeholder-neutral-500 resize-none focus:outline-none text-sm"
                    />
                 </div>
              </div>
              <hr className="border-neutral-800" />
              
              {/* Reuse the form fields renderer but maybe style slightly differently via CSS if needed, 
                  but structure is same */}
              <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Kategori</label>
                    <select
                      value={postData.kategori}
                      onChange={(e) => handleInputChange('kategori', e.target.value)}
                      className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-sm"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Tags</label>
                    <input
                      type="text"
                      placeholder="#tags"
                      value={postData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-sm"
                    />
                  </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      <SuccessModal isVisible={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
      <AlertModal isVisible={alertState.isVisible} message={alertState.message} onClose={closeAlert} />
    </>
  );
};

export default CreatePostModal;