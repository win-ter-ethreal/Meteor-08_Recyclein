import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Camera, CheckCircle, ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';

const Reservation = () => {
  const [step, setStep] = useState(1);
  const { addReservation, categories, fetchCategories } = useApp();
  const navigate = useNavigate();

  const [tanggal, setTanggal] = useState('');
  const [waktu, setWaktu] = useState('08:00 - 12:00');
  const [catatan, setCatatan] = useState('');
  
  const [items, setItems] = useState([
    { id_kategori: '', estimasi_berat: '' }
  ]);

  const [isSeparated, setIsSeparated] = useState(false);
  const [isWeighed, setIsWeighed] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddItem = () => {
    setItems([...items, { id_kategori: '', estimasi_berat: '' }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleConfirm = async () => {
    if (!isSeparated || !isWeighed) {
      alert("Sampah harus dipilah dan ditimbang terlebih dahulu!");
      return;
    }

    const validItems = items.filter(item => item.id_kategori !== '' && item.estimasi_berat !== '');
    if (validItems.length === 0) {
      alert("Tambahkan minimal 1 jenis sampah!");
      return;
    }

    const payload = {
      tanggal_penjemputan: tanggal,
      waktu_penjemputan: waktu,
      catatan: catatan,
      items: validItems.map(item => ({
        id_kategori: parseInt(item.id_kategori),
        estimasi_berat: parseFloat(item.estimasi_berat)
      }))
    };

    const result = await addReservation(payload);
    if (result.success) {
      alert("Reservasi berhasil dikonfirmasi!");
      navigate('/dashboard');
    } else {
      alert(result.msg || "Gagal melakukan reservasi.");
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
            <label className="block text-sm font-semibold mb-1">Tanggal Penjemputan</label>
            <input 
              type="date" 
              className="w-full border p-3 rounded-lg bg-gray-50" 
              value={tanggal} 
              onChange={e => setTanggal(e.target.value)} 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-1">Waktu</label>
            <select className="w-full border p-3 rounded-lg bg-gray-50" value={waktu} onChange={e => setWaktu(e.target.value)}>
              <option>08:00 - 12:00</option>
              <option>13:00 - 17:00</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Jenis & Berat Sampah</label>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <select 
                    className="flex-1 border p-3 rounded-lg bg-gray-50 text-sm"
                    value={item.id_kategori}
                    onChange={(e) => handleItemChange(index, 'id_kategori', e.target.value)}
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map(cat => (
                      <option key={cat.id_kategori} value={cat.id_kategori}>
                        {cat.ikon} {cat.nama_kategori}
                      </option>
                    ))}
                  </select>
                  <input 
                    type="number" 
                    placeholder="Kg" 
                    className="w-20 border p-3 rounded-lg bg-gray-50 text-sm"
                    value={item.estimasi_berat}
                    onChange={(e) => handleItemChange(index, 'estimasi_berat', e.target.value)}
                  />
                  {items.length > 1 && (
                    <button onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button 
              onClick={handleAddItem} 
              className="mt-3 text-primary font-semibold text-sm flex items-center gap-1 hover:underline"
            >
              <PlusCircle size={16} /> Tambah Jenis Sampah
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Catatan untuk Petugas (Opsional)</label>
            <textarea 
              className="w-full border p-3 rounded-lg bg-gray-50 text-sm"
              rows="2"
              placeholder="Cth: Taruh di depan pagar..."
              value={catatan}
              onChange={e => setCatatan(e.target.value)}
            ></textarea>
          </div>

          <button onClick={() => setStep(2)} className="w-full bg-primary text-white py-3 rounded-lg font-bold mt-4">
            Lanjut ke Verifikasi →
          </button>
        </div>
      ) : (
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <label className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="checkbox" className="w-5 h-5 accent-primary" checked={isSeparated} onChange={e => setIsSeparated(e.target.checked)} />
              <span className="text-sm">Apakah sampah sudah dipilah per kategori?</span>
            </label>
            <label className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="checkbox" className="w-5 h-5 accent-primary" checked={isWeighed} onChange={e => setIsWeighed(e.target.checked)} />
              <span className="text-sm">Apakah estimasi berat sudah sesuai?</span>
            </label>
          </div>

          <div className="border-dashed border-2 border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 h-40 cursor-pointer hover:bg-gray-50">
            <Camera size={40} />
            <p className="mt-2 text-sm">Ambil Foto Sampah (Opsional)</p>
          </div>

          <button onClick={handleConfirm} className="w-full bg-primary text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition">
            <CheckCircle size={20} /> Konfirmasi Reservasi
          </button>
        </div>
      )}
    </div>
  );
};

export default Reservation;
