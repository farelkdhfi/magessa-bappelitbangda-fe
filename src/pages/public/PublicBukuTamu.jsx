import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Added Framer Motion
import { Canvas, useFrame } from '@react-three/fiber'; // Added Three.js
import * as THREE from 'three'; // Added Three.js
import {
  Camera,
  Upload,
  X,
  MapPin,
  Calendar,
  FileText,
  User,
  Building,
  Briefcase,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Loader,
  Lock,
  UserCircle2,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { guestBookAPI } from '../../utils/api';
import LoadingSpinner from '../../components/Ui/LoadingSpinner';
import imgLogo from '../../assets/img/logobapelit.png';

// === 1. VISUAL ASSETS (THREE.JS WAVE & BACKGROUND) ===

const ParticleWave = () => {
  const mesh = useRef();
  const count = 130;
  const sep = 2.5;

  const positions = useMemo(() => {
    let positions = [];
    for (let xi = 0; xi < count; xi++) {
      for (let zi = 0; zi < count; zi++) {
        let x = sep * (xi - count / 2);
        let z = sep * (zi - count / 2);
        let y = 0;
        positions.push(x, y, z);
      }
    }
    return new Float32Array(positions);
  }, [count, sep]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.8;
    const { array } = mesh.current.geometry.attributes.position;
    let i = 0;
    for (let xi = 0; xi < count; xi++) {
      for (let zi = 0; zi < count; zi++) {
        const x = sep * (xi - count / 2);
        const z = sep * (zi - count / 2);
        const waveX = Math.sin(x * 0.04 + t) * 2.5;
        const waveZ = Math.sin(z * 0.05 + t * 1.2) * 2.5;
        const baseSwell = Math.sin((x + z) * 0.01 + t * 0.5) * 2;
        array[i + 1] = waveX + waveZ + baseSwell;
        i += 3;
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh} rotation={[-Math.PI / 4, 0, 0]} position={[0, -25, -50]}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        attach="material"
        size={0.5}
        color="#9ca3af" // Cool Gray
        sizeAttenuation={true}
        transparent={true}
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const ThreeBackground = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 70, 120], fov: 40 }}>
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 60, 200]} />
        <ParticleWave />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,#050505_100%)] opacity-70"></div>
    </div>
  );
};

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: { duration: 0.5, ease: "easeInOut" }
  }
};

const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  },
  exit: {
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1
    }
  }
};

// === 2. REDESIGNED OPENING COMPONENT ===

const WelcomeSplash = ({ onComplete }) => {
  // Timer untuk auto-dismiss setelah animasi selesai dilihat
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4500); // Waktu total splash screen tampil

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] overflow-hidden font-sans text-white"
    >
      {/* 3D Background */}
      <ThreeBackground />

      {/* Content Container */}
      <motion.div
        className="relative z-10 text-center px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Logo Badge */}
        <motion.div variants={fadeInUp} className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-3 pl-2 pr-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            <img src={imgLogo} alt="Logo" className="h-6 w-auto brightness-110" />
            <span className="text-sm font-medium text-gray-300 tracking-wide border-l border-white/10 pl-3">
              Bappelitbangda
            </span>
          </div>
        </motion.div>

        {/* Main Heading - Clean Typography */}
        <motion.div variants={fadeInUp} className="mb-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-normal tracking-tight leading-[1.1]">
            Selamat Datang <br />
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              Digital Guestbook.
            </span>
          </h1>
        </motion.div>

        {/* Subtext */}
        <motion.div variants={fadeInUp} className="max-w-xl mx-auto">
          <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed tracking-wide">
            Sistem pencatatan kehadiran tamu terintegrasi Bappelitbangda Kota Tasikmalaya.
            Silakan isi data diri Anda untuk melanjutkan.
          </p>
        </motion.div>

        {/* Loading Indicator (Subtle) */}
        <motion.div 
            variants={fadeInUp} 
            className="mt-12 flex justify-center"
        >
             <div className="w-16 h-[2px] bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                    className="h-full bg-white"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3.5, ease: "easeInOut" }}
                />
             </div>
        </motion.div>

      </motion.div>
    </motion.div>
  );
};

// === 3. EXISTING COMPONENTS (UNCHANGED) ===

// 2. Custom Styled Modal (Matching Reference)
const StyledModal = ({ isOpen, onClose, title, message, type = 'default' }) => {
  if (!isOpen) return null;

  let Icon = Info;
  let iconColor = 'text-zinc-400';
  let iconBg = 'bg-zinc-800';

  if (type === 'error') {
    Icon = AlertTriangle;
    iconColor = 'text-red-500';
    iconBg = 'bg-red-500/10';
  } else if (type === 'success') {
    Icon = CheckCircle2;
    iconColor = 'text-emerald-500';
    iconBg = 'bg-emerald-500/10';
  } else if (type === 'warning') {
    Icon = AlertCircle;
    iconColor = 'text-amber-500';
    iconBg = 'bg-amber-500/10';
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="relative bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl shadow-black/50 max-w-sm w-full transform transition-all animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="p-8 text-center">
          <div className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5`}>
            <Icon className={`h-8 w-8 ${iconColor}`} />
          </div>

          <h3 className="text-xl font-light text-white mb-2">{title}</h3>
          <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
            {message}
          </p>

          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold transition-all shadow-lg shadow-white/5"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};


 const FormInput = ({ icon: Icon, label, ...props }) => (
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                 <Icon size={12} className="text-zinc-400" />
                {label}
            </label>
            <div className="relative group">
                <input
                     {...props}
                     className={`w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/10 focus:bg-black/40 transition-all ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
            </div>
        </div>
    );

// Logic Hooks (Unchanged)
const useDeviceSubmission = () => {
    const STORAGE_KEY = 'guestbook_submissions';
    const [submissionState, setSubmissionState] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return new Map(parsed);
            }
        } catch (error) {
            console.warn('Failed to load submission state:', error);
        }
        return new Map();
    });

    useEffect(() => {
        try {
            const serialized = JSON.stringify([...submissionState]);
            localStorage.setItem(STORAGE_KEY, serialized);
        } catch (error) {
            console.warn('Failed to save submission state:', error);
        }
    }, [submissionState]);

    const checkSubmission = (qrToken, deviceId) => {
        const key = `${qrToken}_${deviceId}`;
        return submissionState.get(key) || null;
    };

    const markSubmitted = (qrToken, deviceId, data) => {
        const key = `${qrToken}_${deviceId}`;
        const submissionInfo = {
            submitted: true,
            data,
            timestamp: new Date().toISOString()
        };
        setSubmissionState(prev => new Map(prev).set(key, submissionInfo));
        return submissionInfo;
    };

    return { checkSubmission, markSubmitted };
};

// File Preview (Styled)
const FilePreview = ({ files, onRemove, disabled = false }) => {
    if (files.length === 0) return null;
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {files.map((file, index) => (
                <div key={file.id} className="relative group rounded-xl overflow-hidden border border-white/10">
                    <img
                        src={file.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    {!disabled && (
                        <button
                            type="button"
                            onClick={() => onRemove(index)}
                            className="absolute top-1 right-1 bg-black/60 hover:bg-red-500/80 text-white rounded-lg p-1.5 transition-colors backdrop-blur-md"
                        >
                            <X size={12} />
                        </button>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm text-zinc-400 text-[10px] px-2 py-1 text-center font-mono">
                        {(file.file.size / 1024 / 1024).toFixed(1)}MB
                    </div>
                </div>
            ))}
        </div>
    );
};

// Already Submitted (Styled)
const AlreadySubmitted = ({ eventData, submissionData }) => {
    const DetailRow = ({ icon: Icon, label, value }) => (
        <div className="group flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/30 border border-white/5 hover:bg-zinc-800/30 hover:border-white/10 transition-all">
            <div className="p-2 bg-zinc-800 rounded-xl border border-white/5 text-zinc-400 group-hover:text-white transition-colors">
                <Icon size={18} />
            </div>
            <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-zinc-200 font-medium text-sm">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 font-sans selection:bg-white/20 py-10 px-4">
            <div className="max-w-lg mx-auto">
                <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                      {/* Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-full mb-6 border border-white/10">
                            <Lock className="text-white" size={24} />
                        </div>
                        <h2 className="text-2xl font-light text-white tracking-tight mb-2">Terima Kasih</h2>
                        <p className="text-zinc-500 text-sm">Data kehadiran Anda telah tersimpan dalam sistem.</p>
                    </div>

                    <div className="space-y-3 relative z-10">
                        <DetailRow icon={User} label="Nama Lengkap" value={submissionData.nama_lengkap} />
                        {submissionData.instansi && <DetailRow icon={Building} label="Instansi" value={submissionData.instansi} />}
                        {submissionData.jabatan && <DetailRow icon={Briefcase} label="Jabatan" value={submissionData.jabatan} />}
                        <DetailRow 
                            icon={Calendar} 
                            label="Waktu Submit" 
                            value={new Date(submissionData.submitted_at).toLocaleString('id-ID')} 
                        />
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center relative z-10">
                         <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Event Info</p>
                        <p className="text-lg font-semibold text-white">{eventData.nama_acara}</p>
                        <p className="text-zinc-500 text-xs mt-1">{eventData.lokasi}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Component
const PublikBukuTamu = () => {
    const [showSplash, setShowSplash] = useState(true);
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [modal, setModal] = useState({ isOpen: false, type: 'default', title: '', message: '' });
    const [alreadySubmitted, setAlreadySubmitted] = useState(false);
    const [submissionData, setSubmissionData] = useState(null);
    const [deviceId, setDeviceId] = useState(null);

    const { checkSubmission, markSubmitted } = useDeviceSubmission();

    const [formData, setFormData] = useState({
        nama_lengkap: '',
        instansi: '',
        jabatan: '',
        keperluan: ''
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewFiles, setPreviewFiles] = useState([]);

    const getQRTokenFromURL = () => {
        const path = window.location.pathname;
        const matches = path.match(/\/guest\/([^\/]+)/);
        return matches ? matches[1] : 'sample-qr-token';
    };

    const qrToken = getQRTokenFromURL();

    const generateDeviceId = () => {
        try {
            let deviceId = localStorage.getItem('guest_device_id');
            if (deviceId) {
                return deviceId;
            }

            const screen = window.screen;
            const navigator = window.navigator;
            const fingerprint = [
                navigator.userAgent,
                navigator.language,
                screen.width,
                screen.height,
                screen.colorDepth,
                Intl.DateTimeFormat().resolvedOptions().timeZone,
                navigator.hardwareConcurrency || 'unknown',
                navigator.platform
            ].join('|');

            let hash = 0;
            for (let i = 0; i < fingerprint.length; i++) {
                const char = fingerprint.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }

            const today = new Date().toISOString().split('T')[0];
            const todayHash = today.split('-').join('');
            deviceId = `device_${Math.abs(hash).toString(36)}_${todayHash}`;

            localStorage.setItem('guest_device_id', deviceId);
            return deviceId;
        } catch (error) {
            let deviceId = localStorage.getItem('guest_device_id_fallback');
            if (!deviceId) {
                deviceId = `fallback_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
                localStorage.setItem('guest_device_id_fallback', deviceId);
            }
            return deviceId;
        }
    };

    useEffect(() => {
        const id = generateDeviceId();
        setDeviceId(id);
    }, []);

    const fetchEventData = async () => {
        if (!qrToken || !deviceId) {
            if (!qrToken) {
                showModal('error', 'Token Tidak Valid', 'QR Code atau link yang Anda gunakan tidak valid.');
            }
            setLoading(false);
            return;
        }

        try {
            const response = await guestBookAPI.checkDeviceSubmission(qrToken, deviceId);
            setEventData(response.event);
            if (response.hasSubmitted) {
                setAlreadySubmitted(true);
                setSubmissionData(response.submission);
            }
        } catch (error) {
            if (error.response?.status === 404) {
                try {
                    const eventResponse = await guestBookAPI.getEventInfo(qrToken);
                    setEventData(eventResponse.event);
                } catch (fallbackError) {
                    showModal('error', 'Acara Tidak Ditemukan',
                        'Acara tidak ditemukan atau sudah tidak aktif.'
                    );
                }
            } else {
                showModal('error', 'Gagal Memuat Data',
                    'Terjadi kesalahan saat menghubungi server. Periksa koneksi internet Anda.'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (deviceId && !showSplash) {
            fetchEventData();
        }
    }, [deviceId, showSplash]);

    useEffect(() => {
        let interval;
        if (submitting) {
            setUploadProgress(0);
            interval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        return 90;
                    }
                    return prev + Math.random() * 8 + 2;
                });
            }, 300);
        } else {
            setUploadProgress(0);
        }
        return () => clearInterval(interval);
    }, [submitting]);

    const showModal = (type, title, message) => {
        setModal({ isOpen: true, type, title, message });
    };

    const closeModal = () => {
        setModal({ isOpen: false, type: 'default', title: '', message: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateFile = (file) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        const maxSize = 5 * 1024 * 1024;
        if (!allowedTypes.includes(file.type)) {
            return { valid: false, error: 'Hanya file JPEG, JPG, dan PNG yang diperbolehkan.' };
        }
        if (file.size > maxSize) {
            return { valid: false, error: 'Ukuran file maksimal 5MB.' };
        }
        return { valid: true };
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            showModal('error', 'Terlalu Banyak File', 'Maksimal 5 foto yang dapat diunggah.');
            return;
        }
        const validFiles = [];
        const newPreviews = [];
        let processedFiles = 0;
        files.forEach((file, index) => {
            const validation = validateFile(file);
            if (!validation.valid) {
                showModal('error', 'File Tidak Valid', validation.error);
                return;
            }
            validFiles.push(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                newPreviews.push({
                    id: `${Date.now()}-${index}`,
                    file,
                    preview: e.target.result
                });
                processedFiles++;
                if (processedFiles === validFiles.length) {
                    setPreviewFiles(prev => [...prev, ...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });
        setSelectedFiles(prev => [...prev, ...validFiles]);
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewFiles(prev => prev.filter((_, i) => i !== index));
    };

    const clearAllFiles = () => {
        setSelectedFiles([]);
        setPreviewFiles([]);
        const fileInput = document.getElementById('photo-upload');
        if (fileInput) fileInput.value = '';
    };

    const handleSubmit = async () => {
        if (!formData.nama_lengkap.trim()) {
            showModal('error', 'Data Tidak Lengkap', 'Nama lengkap harus diisi.');
            return;
        }
        if (!deviceId) {
            showModal('error', 'System Error', 'Device ID tidak tersedia. Silakan refresh halaman.');
            return;
        }
        setSubmitting(true);
        try {
            const submitData = new FormData();
            submitData.append('nama_lengkap', formData.nama_lengkap);
            submitData.append('instansi', formData.instansi);
            submitData.append('jabatan', formData.jabatan);
            submitData.append('keperluan', formData.keperluan);
            submitData.append('device_id', deviceId);
            selectedFiles.forEach(file => {
                submitData.append('photos', file);
            });

            const response = await guestBookAPI.submitAttendance(qrToken, submitData);

            const submissionInfo = markSubmitted(qrToken, deviceId, {
                nama_lengkap: formData.nama_lengkap,
                instansi: formData.instansi,
                jabatan: formData.jabatan,
                keperluan: formData.keperluan,
                submitted_at: new Date().toISOString(),
                photo_count: selectedFiles.length
            });

            setUploadProgress(100);

            showModal('success', 'Berhasil!',
                `Kehadiran Anda berhasil dicatat. ${selectedFiles.length > 0 ? `${response.photo_count || selectedFiles.length} foto berhasil diunggah.` : ''}`
            );

            setTimeout(() => {
                setAlreadySubmitted(true);
                setSubmissionData(submissionInfo.data);
            }, 2000);
        } catch (error) {
            setUploadProgress(0);
            if (error.response?.status === 409) {
                showModal('warning', 'Sudah Pernah Mengisi',
                    error.response.data.error || 'Anda sudah mengisi buku tamu untuk acara ini.'
                );
                if (error.response.data.existing_submission) {
                    const existing = error.response.data.existing_submission;
                    setAlreadySubmitted(true);
                    setSubmissionData({
                        nama_lengkap: existing.nama_lengkap,
                        submitted_at: existing.submitted_at,
                        instansi: existing.instansi || '',
                        jabatan: existing.jabatan || '',
                        keperluan: existing.keperluan || '',
                        photo_count: existing.photo_count || 0
                    });
                }
            } else {
                showModal('error', 'Gagal Menyimpan',
                    error.response?.data?.error || 'Terjadi kesalahan saat menyimpan data.'
                );
            }
        } finally {
            setTimeout(() => {
                setSubmitting(false);
            }, 1000);
        }
    };

    // Show splash screen first with AnimatePresence for smooth exit
    return (
        <AnimatePresence mode="wait">
            {showSplash ? (
                <WelcomeSplash key="splash" onComplete={() => setShowSplash(false)} />
            ) : (
                <div className="min-h-screen bg-zinc-950">
                    {loading ? (
                        <div className="flex items-center justify-center min-h-screen">
                            <LoadingSpinner />
                        </div>
                    ) : !eventData ? (
                        <div className="min-h-screen flex items-center justify-center p-4">
                            <div className="text-center p-8 bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl max-w-sm">
                                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                                    <AlertTriangle className="text-red-500" size={32} />
                                </div>
                                <h1 className="text-lg font-semibold text-white mb-2">Acara Tidak Ditemukan</h1>
                                <p className="text-zinc-500 text-sm">QR Code atau link yang Anda gunakan tidak valid.</p>
                            </div>
                        </div>
                    ) : alreadySubmitted && submissionData ? (
                         <AlreadySubmitted eventData={eventData} submissionData={submissionData} />
                    ) : (
                        // MAIN FORM RENDER
                        <div className="min-h-screen bg-zinc-950 font-sans text-white pb-20">
                            <div className="container mx-auto px-4 py-8 max-w-2xl">
                                
                                {/* Header */}
                                <div className="flex flex-col items-center mb-10 text-center">
                                    <div className="p-3 bg-zinc-900/50 rounded-2xl border border-white/5 mb-4 backdrop-blur-md">
                                        <UserCircle2 className="w-8 h-8 text-zinc-400" />
                                    </div>
                                    <h1 className="text-2xl font-light tracking-tight text-white mb-1">
                                        Buku Tamu <span className="font-semibold text-zinc-400">Digital</span>
                                    </h1>
                                    <p className="text-xs text-zinc-500 uppercase tracking-widest">Guest Access Control System</p>
                                </div>

                                {/* Event Info Card (Bento Style) */}
                                <div className="bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl p-6 mb-8 relative overflow-hidden">
                                    {/* Decoration */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                    
                                    <div className="relative z-10">
                                        <h2 className="text-xl font-light text-white mb-6 border-b border-white/5 pb-4">{eventData.nama_acara}</h2>
                                        <div className="grid gap-4">
                                            <div className="flex items-start gap-3 p-4 bg-zinc-900/50 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                                <Calendar className="text-zinc-400 mt-0.5" size={16} />
                                                <div>
                                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Tanggal</p>
                                                    <p className="text-sm text-zinc-200">
                                                        {new Date(eventData.tanggal_acara).toLocaleDateString('id-ID', {
                                                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-4 bg-zinc-900/50 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                                <MapPin className="text-zinc-400 mt-0.5" size={16} />
                                                <div>
                                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Lokasi</p>
                                                    <p className="text-sm text-zinc-200">{eventData.lokasi}</p>
                                                </div>
                                            </div>
                                            {eventData.deskripsi && (
                                                <div className="flex items-start gap-3 p-4 bg-zinc-900/50 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                                    <FileText className="text-zinc-400 mt-0.5" size={16} />
                                                    <div>
                                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Deskripsi</p>
                                                        <p className="text-sm text-zinc-400 leading-relaxed">{eventData.deskripsi}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Form */}
                                <div className="bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl p-6 md:p-8">
                                    <div className="space-y-6">
                                        <FormInput 
                                            icon={User}
                                            label="Nama Lengkap *" 
                                            name="nama_lengkap"
                                            value={formData.nama_lengkap}
                                            onChange={handleInputChange}
                                            placeholder="Masukkan nama Anda"
                                            required
                                            disabled={submitting}
                                        />
                                        
                                        <FormInput 
                                            icon={Building}
                                            label="Instansi / Organisasi" 
                                            name="instansi"
                                            value={formData.instansi}
                                            onChange={handleInputChange}
                                            placeholder="Asal instansi"
                                            disabled={submitting}
                                        />

                                        <FormInput 
                                            icon={Briefcase}
                                            label="Jabatan" 
                                            name="jabatan"
                                            value={formData.jabatan}
                                            onChange={handleInputChange}
                                            placeholder="Posisi jabatan"
                                            disabled={submitting}
                                        />

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                                <MessageSquare size={12} className="text-zinc-400" />
                                                Keperluan
                                            </label>
                                            <textarea
                                                name="keperluan"
                                                value={formData.keperluan}
                                                onChange={handleInputChange}
                                                rows={3}
                                                disabled={submitting}
                                                className={`w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/10 focus:bg-black/40 transition-all resize-none ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                placeholder="Tujuan kunjungan"
                                            />
                                        </div>

                                        {/* Photo Upload Section */}
                                        <div className="pt-2">
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Camera size={12} className="text-zinc-400" />
                                                    Foto (Opsional)
                                                </label>
                                                {previewFiles.length > 0 && !submitting && (
                                                    <button
                                                        type="button"
                                                        onClick={clearAllFiles}
                                                        className="text-[10px] font-bold text-red-500 hover:text-red-400 uppercase tracking-widest flex items-center gap-1 transition-colors"
                                                    >
                                                        <X size={10} />
                                                        Reset
                                                    </button>
                                                )}
                                            </div>
                                            
                                            <label
                                                htmlFor="photo-upload"
                                                className={`relative group flex flex-col items-center justify-center w-full h-32 border border-dashed border-white/10 rounded-2xl cursor-pointer bg-black/20 hover:bg-zinc-900/50 hover:border-white/20 transition-all duration-300 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <div className="p-3 bg-zinc-800/50 rounded-full text-zinc-400 mb-2 group-hover:text-white transition-colors">
                                                        <Upload className="w-5 h-5" />
                                                    </div>
                                                    <p className="mb-1 text-xs text-zinc-400 font-medium">
                                                        <span className="text-white">Klik upload</span> atau drag & drop
                                                    </p>
                                                    <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Max 5MB (JPG/PNG)</p>
                                                </div>
                                                <input
                                                    id="photo-upload"
                                                    type="file"
                                                    multiple
                                                    accept="image/jpeg,image/jpg,image/png"
                                                    onChange={handleFileSelect}
                                                    className="hidden"
                                                    disabled={submitting}
                                                />
                                            </label>

                                            <div className="mt-4">
                                                 <FilePreview
                                                    files={previewFiles}
                                                    onRemove={removeFile}
                                                    disabled={submitting}
                                                />
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        {submitting && uploadProgress > 0 && (
                                            <div className="space-y-2 pt-2">
                                                <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                                    <span>Processing</span>
                                                    <span>{Math.min(100, Math.round(uploadProgress))}%</span>
                                                </div>
                                                <div className="w-full bg-zinc-800 rounded-full h-1 overflow-hidden">
                                                    <div
                                                        className="bg-white h-1 rounded-full transition-all duration-300"
                                                        style={{ width: `${Math.min(100, uploadProgress)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <div className="pt-6">
                                            <button
                                                type="button"
                                                onClick={handleSubmit}
                                                disabled={submitting || !formData.nama_lengkap.trim()}
                                                className="w-full bg-white text-black hover:bg-zinc-200 font-bold py-4 px-6 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl shadow-white/5 transform active:scale-[0.98]"
                                            >
                                                {submitting ? (
                                                    <>
                                                        <Loader className="animate-spin" size={18} />
                                                        <span className="uppercase tracking-widest text-xs">Mohon Tunggu...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle size={18} />
                                                        <span className="uppercase tracking-widest text-xs">Simpan Data</span>
                                                    </>
                                                )}
                                            </button>
                                            
                                            <p className="mt-4 text-center text-[10px] text-zinc-600 font-medium flex items-center justify-center gap-2">
                                                <Lock size={10} />
                                                Satu perangkat hanya untuk satu kali pengisian
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            {/* Reusable Modal Component (Outside AnimatePresence wrapper for Splash) */}
             <StyledModal
                isOpen={modal.isOpen}
                onClose={closeModal}
                title={modal.title}
                message={modal.message}
                type={modal.type}
            />
        </AnimatePresence>
    );
};

export default PublikBukuTamu;