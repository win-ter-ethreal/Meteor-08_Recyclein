import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, Save, CheckCircle } from 'lucide-react';

const Profile = () => {
  const { currentUser, updateProfile, changePassword } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!currentUser) {
    return <div className="p-8 text-center">Silakan login terlebih dahulu.</div>;
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    const res = await updateProfile({ name, email });
    if (res.success) {
      setSuccessMsg('Profil berhasil diperbarui!');
    } else {
      alert(res.msg);
    }
    setSaving(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert('Password baru minimal 6 karakter');
      return;
    }
    setChangingPass(true);
    const res = await changePassword({ currentPassword, newPassword });
    if (res.success) {
      setSuccessMsg('Password berhasil diubah!');
      setCurrentPassword('');
      setNewPassword('');
    } else {
      alert(res.msg);
    }
    setChangingPass(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-primary transition">
            <ArrowLeft />
          </button>
          <h1 className="font-bold text-lg">Profil Saya</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium">
            <CheckCircle className="w-5 h-5" /> {successMsg}
          </div>
        )}

        {/* Info Ringkas */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {currentUser.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold">{currentUser.name}</h2>
              <p className="text-gray-500 text-sm">{currentUser.email}</p>
              <span className="inline-block mt-1 bg-accent text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                {currentUser.points?.toLocaleString()} Poin
              </span>
            </div>
          </div>
        </div>

        {/* Edit Profil */}
        <form onSubmit={handleUpdateProfile} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <User className="text-primary w-5 h-5" /> Edit Profil
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Menyimpan...' : 'Simpan Profil'}
          </button>
        </form>

        {/* Ganti Password */}
        <form onSubmit={handleChangePassword} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Lock className="text-primary w-5 h-5" /> Ganti Password
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password Saat Ini</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition text-sm pr-12"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition text-sm pr-12"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                required
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={changingPass}
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
          >
            <Lock className="w-4 h-4" /> {changingPass ? 'Mengganti...' : 'Ganti Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
