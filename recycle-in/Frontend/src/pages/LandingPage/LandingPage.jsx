import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Recycle, Truck, Gift, BookOpen, Leaf, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    visible: { transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Recycle className="text-green-600 w-8 h-8" />
              <span className="text-xl font-extrabold text-gray-900">Recycle-<span className="text-green-600">In</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#fitur" className="text-gray-600 hover:text-green-600 font-medium transition">Fitur</a>
              <a href="#tentang" className="text-gray-600 hover:text-green-600 font-medium transition">Tentang</a>
              <button onClick={() => navigate('/login')} className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition shadow-lg shadow-green-600/20 flex items-center gap-2">
                Masuk <ArrowRight size={16}/>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-200 rounded-full filter blur-3xl opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 relative z-10">
          <motion.div
            className="lg:w-1/2 text-center lg:text-left"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="inline-block bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              🌍 Jaga Bumi Mulai Hari Ini
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Ubah Sampahmu Jadi <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">Reward!</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Recycle-In membantu Anda memilah sampah dengan benar, menjemputnya langsung ke rumah, dan memberikan poin yang bisa ditukar dengan saldo e-wallet atau voucher belanja.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button onClick={() => navigate('/login')} className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-xl shadow-green-600/30 flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95">
                Daftar Gratis <ArrowRight size={20} />
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:w-1/2 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative w-full max-w-lg">
              <img
                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Recycle"
                className="rounded-3xl shadow-2xl border-4 border-white transform hover:rotate-1 transition-transform duration-500"
              />
              <motion.div
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <div className="bg-green-100 p-2 rounded-full">
                  <Leaf className="text-green-600 w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">Sampah Didaur</p>
                  <p className="text-green-600 font-extrabold">128.5 Kg</p>
                </div>
              </motion.div>

              <motion.div
                className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 4, delay: 1 }}
              >
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Gift className="text-yellow-600 w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">Poin Didapat</p>
                  <p className="text-yellow-600 font-extrabold">12,450</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="fitur" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">Fitur Unggulan Kami</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Semua yang Anda butuhkan untuk memulai gaya hidup ramah lingkungan ada di sini.</p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all duration-300 group cursor-pointer">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-600 transition-colors duration-300">
                <BookOpen className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Edukasi Sampah</h3>
              <p className="text-gray-600 text-sm">Pelajari cara memilah sampah organik dan anorganik dengan panduan lengkap.</p>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all duration-300 group cursor-pointer">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-green-600 transition-colors duration-300">
                <Truck className="w-7 h-7 text-green-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Penjemputan Mudah</h3>
              <p className="text-gray-600 text-sm">Reservasi penjemputan sampah langsung dari rumah Anda tanpa repot.</p>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all duration-300 group cursor-pointer">
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-yellow-500 transition-colors duration-300">
                <Gift className="w-7 h-7 text-yellow-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tukar Poin</h3>
              <p className="text-gray-600 text-sm">Dapatkan poin dari setiap sampah yang dikumpulkan, tukar dengan saldo atau voucher.</p>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all duration-300 group cursor-pointer">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-emerald-600 transition-colors duration-300">
                <Leaf className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Jejak Karbon</h3>
              <p className="text-gray-600 text-sm">Pantau kontribusi Anda dalam menyelamatkan bumi secara real-time.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer id="tentang" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Recycle className="w-6 h-6 text-green-400" />
            <span className="text-xl font-bold">Recycle-In</span>
          </div>
          <p className="text-gray-400 max-w-md mx-auto mb-6">Jemput Sampah, Jaga Bumi. Platform pengelolaan sampah berbasis reward terbaik di Indonesia.</p>
          <p className="text-gray-500 text-sm">© 2024 Recycle-In. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
