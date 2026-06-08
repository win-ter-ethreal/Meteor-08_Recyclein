import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { ArrowLeft, Recycle } from 'lucide-react';

const Catalog = () => {
  const navigate = useNavigate();
  const { categories, fetchCategories } = useApp();

  useEffect(() => {
    fetchCategories(); // Ambil data kategori dari MySQL
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <div className="p-4 flex items-center border-b">
        <button onClick={() => navigate('/dashboard')} className="text-primary"><ArrowLeft /></button>
        <h2 className="flex-1 text-center font-bold text-lg">Katalog Sampah</h2>
      </div>
      
      <div className="p-6 space-y-4">
        {categories.length === 0 ? (
          <p className="text-center text-gray-400">Memuat kategori...</p>
        ) : (
          categories.map(cat => (
            <div key={cat.id_kategori} className="border rounded-xl p-4 flex gap-4 hover:shadow-md transition bg-gray-50">
              <div className="bg-white p-3 rounded-lg shadow-sm text-3xl h-fit">
                {cat.ikon || <Recycle className="text-primary w-8 h-8" />}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{cat.nama_kategori}</h3>
                <p className="text-sm text-gray-500 mt-1">{cat.deskripsi || 'Bisa didaur ulang'}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Catalog;