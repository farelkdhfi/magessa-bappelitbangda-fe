import React, { useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { ArrowRight, PlayCircle, Crown } from 'lucide-react';
import * as THREE from 'three';
import LoginPopup from './Login';
import img from '../assets/img/logobapelit.png';


// --- 1. ADVANCED THREE.JS WAVE COMPONENT ---
const ParticleWave = () => {
  const mesh = useRef();

  // Konfigurasi Grid: Sedikit lebih padat untuk detail pola yang lebih baik
  const count = 130; // 130x130 = 16.900 partikel
  const sep = 2.5; // Jarak antar partikel

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

  // Animasi Loop "Selang-seling" (Interference Pattern)
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.8; // Kecepatan waktu diperlambat agar elegan
    const { array } = mesh.current.geometry.attributes.position;

    let i = 0;
    for (let xi = 0; xi < count; xi++) {
      for (let zi = 0; zi < count; zi++) {
        const x = sep * (xi - count / 2);
        const z = sep * (zi - count / 2);

        // RUMUS BARU: Pola Interferensi "Selang-seling"
        // Kita menggabungkan gelombang yang bergerak di sumbu X dan sumbu Z secara terpisah.
        // Perbedaan frekuensi (0.04 vs 0.05) menciptakan pola yang tidak berulang dengan cepat.
        const waveX = Math.sin(x * 0.04 + t) * 2.5;
        const waveZ = Math.sin(z * 0.05 + t * 1.2) * 2.5;
        // Gelombang tambahan yang lebih besar dan lambat untuk gerakan dasar
        const baseSwell = Math.sin((x + z) * 0.01 + t * 0.5) * 2;

        // Ketinggian Y adalah hasil kombinasi gelombang-gelombang tersebut
        array[i + 1] = waveX + waveZ + baseSwell;

        i += 3;
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    // Rotasi sedikit disesuaikan untuk melihat pola selang-seling lebih baik
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
        size={0.5} // Ukuran titik sedikit diperkecil agar lebih halus
        // WARNA GANTI JADI ABU ELEGANT (Cool Gray)
        color="#9ca3af"
        sizeAttenuation={true}
        transparent={true}
        opacity={0.5}
        blending={THREE.AdditiveBlending} // Tetap gunakan ini agar terlihat bercahaya saat bertumpuk
      />
    </points>
  );
};

// --- 2. MAIN SCENE WRAPPER ---
const ThreeBackground = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 70, 120], fov: 40 }}>
        <color attach="background" args={['#050505']} /> {/* Background sedikit lebih terang dari hitam pekat */}
        {/* Fog warna abu gelap agar wave menyatu dengan kejauhan */}
        <fog attach="fog" args={['#050505', 60, 200]} />
        <ParticleWave />
      </Canvas>

      {/* Vignette Overlay yang lebih halus */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,#050505_100%)] opacity-70 pointer-events-none"></div>
    </div>
  );
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  },
};

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-white font-sans overflow-hidden selection:bg-gray-500/30">

      <ThreeBackground />

      <div className="relative z-10 container mx-auto px-6 h-screen flex flex-col justify-center pointer-events-none">

        <div className="flex flex-col items-center text-center -mt-10 md:-mt-16 pointer-events-auto">

          {/* Badge - Typography Updated */}
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-8">
            <div className="inline-flex items-center gap-2 pl-1 pr-4 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md cursor-pointer hover:border-white/20 transition-all group">
              <img src={img} alt="Logo Bapelitbangda" className="h-5" />
              <p className='text-sm'>Bappelitbangda Kota Tasikmalaya</p>
            </div>
          </motion.div>

          {/* Heading - Typography Updated (Max font-medium) */}
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-5xl mx-auto mb-8">
            {/* Removed font-bold, added font-medium. Removed purple gradient, used clean white/gray gradient */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-[1.05]">
              How Magessa is <br />
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                Redefining Success.
              </span>
            </h1>
          </motion.div>

          {/* Subtext */}
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-2xl mx-auto mb-12">
            <p className="text-gray-400 text-base md:text-lg font-light leading-relaxed tracking-wide">
              Portal ini hanya dapat diakses oleh pegawai internal Bapelitbangda. Silakan login menggunakan akun resmi untuk mengelola dan memantau surat masuk instansi.
            </p>
          </motion.div>

          {/* Buttons - Typography Updated */}
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto justify-center">
            <button
              onClick={() => setShowLogin(true)}
              // Changed font-bold to font-medium
              className="px-8 py-4 bg-white text-black font-medium text-sm md:text-base rounded-xl hover:bg-gray-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              Login
            </button>

            <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-medium text-sm md:text-base rounded-xl hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 backdrop-blur-sm group">
              <PlayCircle className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              See How it works
            </button>
          </motion.div>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
            <LoginPopup onClose={() => setShowLogin(false)} />
      )}
    </div>
  );
};

export default LandingPage;