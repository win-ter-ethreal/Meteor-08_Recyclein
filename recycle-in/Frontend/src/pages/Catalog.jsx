import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Recycle } from 'lucide-react';

const trashCatalog = [
  { id: 1, name: 'Botol & Plastik', category: 'Anorganik', value: 'Tinggi', desc: 'Dapat diolah menjadi biji plastik.' },
  { id: 2, name: 'Kertas Campuran', category: 'Anorganik', value: 'Sedang', desc: 'Harus dipisahkan dari plastik pembungkus.' },
  { id: 3, name: 'Sisa Makanan', category: 'Organik', value: 'Sedang', desc: 'Dapat diolah menjadi kompos.' },
];

const Catalog = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <div className="p-4 flex items-center border-b">
        <button onClick={() => navigate('/dashboard')} className="text-primary"><ArrowLeft /></button>
        <h2 className="flex-1 text-center font-bold text-lg">Katalog Sampah</h2>
      </div>
      
      <div className="p-6 space-y-4">
        {trashCatalog.map(item => (
          <div key={item.id} className="border rounded-xl p-4 flex gap-4 hover:shadow-md transition">
            <div className="bg-bg p-3 rounded-lg h-fit">
              <Recycle className="text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{item.category}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${item.value === 'Tinggi' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  Nilai: {item.value}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;