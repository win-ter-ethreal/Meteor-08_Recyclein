import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Camera, CheckCircle, ArrowLeft } from 'lucide-react';

const Reservation = () => {
  const [step, setStep] = useState(1); // 1: Reservasi, 2: Verifikasi
  const [formData, setFormData] = useState({ category: 'Plastik', date: '', time: '08:00 - 12:00', photo: null, isSeparated: false, isWeighed: false });
  const { addReservation } = useApp();
  const navigate = useNavigate();

  // Fungsi handleConfirm digabung menjadi satu saja
  const handleConfirm = async () => {
    if (!formData.isSeparated || !formData.isWeighed) {
      alert("Sampah harus dipilah dan ditimbang terlebih dahulu!");
      return;
    }
    
    try {
      // Kirim ke database via API
      await addReservation({
        category: formData.category,
        date: formData.date,
        time: formData.time
      });
      
      alert("Reservasi berhasil dikonfirmasi!");
      navigate('/dashboard');
    } catch (error) {
      alert("Gagal melakukan reservasi. Coba lagi.");
    }
  };  

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <div className="p-4 flex items-center border-b">
        <button onClick={() => step === 1 ? navigate('/dashboard') : setStep(1)} className="text-primary"><ArrowLeft /></button>
        <h2 className="flex-1 text-center font-bold text-lg">{step === 1 ? 'Reservasi Penjemputan' : 'Verifikasi Sampah'}</h2>
      </div>

      {step === 1 ? (
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Kategori Sampah</label>
            <select className="w-full border p-3 rounded-lg" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option>Plastik</option>
              <option>Kertas</option>
              <option>Logam</option>
              <option>Organik</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Tanggal Penjemputan</label>
            <input type="date" className="w-full border p-3 rounded-lg" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Waktu</label>
            <select className="w-full border p-3 rounded-lg" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}>
              <option>08:00 - 12:00</option>
              <option>13:00 - 17:00</option>
            </select>
          </div>
          <button onClick={() => setStep(2)} className="w-full bg-primary text-white py-3 rounded-lg font-bold mt-4">
            Lanjut ke Verifikasi →
          </button>
        </div>
      ) : (
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <label className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer">
              <input type="checkbox" className="w-5 h-5" checked={formData.isSeparated} onChange={e => setFormData({...formData, isSeparated: e.target.checked})} />
              <span>Apakah sampah sudah dipilah per kategori?</span>
            </label>
            <label className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer">
              <input type="checkbox" className="w-5 h-5" checked={formData.isWeighed} onChange={e => setFormData({...formData, isWeighed: e.target.checked})} />
              <span>Apakah sampah sudah ditimbang?</span>
            </label>
          </div>

          <div className="border-dashed border-2 border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 h-40">
            <Camera size={40} />
            <p className="mt-2 text-sm">Ambil Foto Sampah</p>
          </div>

          <button onClick={handleConfirm} className="w-full bg-primary text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2">
            <CheckCircle size={20} /> Konfirmasi Reservasi
          </button>
        </div>
      )}
    </div>
  );
};

export default Reservation;