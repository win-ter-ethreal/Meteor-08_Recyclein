import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Recycle, Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, register } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // PERBAIKAN: Bungkus email dan password di dalam { }
        const res = await login({ email, password });

        if (res.success) {
          navigate(res.role === 'admin' ? '/admin' : '/dashboard');
        } else {
          alert(res.msg || 'Login gagal, periksa email dan password');
        }
      } else {
        // PERBAIKAN: Bungkus name, email, dan password di dalam { }
        const res = await register({ name, email, password });

        if (res.success) {
          setIsLogin(true);
          alert('Registrasi berhasil! Silakan login.');
        } else {
          alert(res.msg || 'Registrasi gagal');
        }
      }
    } catch (error) {
      alert('Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ==================== SISI KIRI: HERO SECTION ==================== */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 relative overflow-hidden flex-col justify-between p-12">

        {/* Dekorasi Background */}
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-120px] right-[-120px] w-96 h-96 bg-green-900/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl"></div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Recycle className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-wide">Recycle-In</h1>
              <p className="text-green-200 text-xs font-medium tracking-[0.2em] uppercase">Jemput Sampah</p>
            </div>
          </div>
        </div>

        {/* Tagline Tengah */}
        <div className="relative z-10 space-y-6">
          <h2 className="text-5xl font-extrabold text-white leading-[1.2]">
            Jaga Bumi,<br />
            Mulai dari<br />
            <span className="text-yellow-300">Sampahmu.</span>
          </h2>
          <p className="text-green-100 text-lg max-w-md leading-relaxed">
            Ubah sampah menjadi poin, dan poin menjadi reward. Ayo mulai gaya hidup ramah lingkungan bersama Recycle-In!
          </p>

          {/* Stats Mini */}
          <div className="flex gap-6">
            <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl">
              <p className="text-yellow-300 text-2xl font-bold">1,284+</p>
              <p className="text-green-100 text-xs">Pelestari Bumi</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl">
              <p className="text-yellow-300 text-2xl font-bold">45.2kg</p>
              <p className="text-green-100 text-xs">Sampah Daur</p>
            </div>
          </div>
        </div>

        {/* Footer Kiri */}
        <div className="relative z-10">
          <p className="text-green-200/60 text-sm">© 2024 Recycle-In. All rights reserved.</p>
        </div>
      </div>

      {/* ==================== SISI KANAN: FORM SECTION ==================== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white min-h-screen">
        <div className="w-full max-w-[420px]">

          {/* Logo Mobile (Hanya muncul di HP) */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="bg-green-50 p-2 rounded-lg">
              <Recycle className="text-primary w-6 h-6" />
            </div>
            <h1 className="text-xl font-extrabold text-primary tracking-wide">Recycle-In</h1>
          </div>

          {/* Header Form */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {isLogin ? 'Login Akun' : 'Registrasi Akun'}
            </h2>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              {isLogin ? 'Selamat datang kembali! Silakan masukkan data anda.' : 'Buat akun untuk mulai berkontribusi menjaga bumi.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Nama (Register only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="text-gray-400 w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-gray-50 focus:bg-white text-sm"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="text-gray-400 w-5 h-5" />
                </div>
                <input
                  type="email"
                  placeholder="contoh@email.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-gray-50 focus:bg-white text-sm"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* No HP (Register only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nomor Handphone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className="text-gray-400 w-5 h-5" />
                  </div>
                  <input
                    type="tel"
                    placeholder="08xx xxxx xxxx"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-gray-50 focus:bg-white text-sm"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                {isLogin && (
                  <a href="#" className="text-xs text-primary font-semibold hover:underline">Lupa Password?</a>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="text-gray-400 w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-gray-50 focus:bg-white text-sm"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? 'Masuk' : 'Daftar Sekarang'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-4 text-gray-400 text-xs font-medium uppercase">atau masuk dengan</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Social Login */}
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-700 font-medium text-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-700 font-medium text-sm">
              <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>

          {/* Toggle Login/Register */}
          <div className="text-center mt-8 bg-gray-50 py-4 rounded-xl">
            <p className="text-gray-500 text-sm">
              {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-green-600 font-bold ml-1.5 hover:underline"
              >
                {isLogin ? 'Daftar Sekarang' : 'Masuk di sini'}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;