import React from 'react';
import { Leaf, TreePine } from 'lucide-react';

const StatsCard = () => {
  return (
    <div className="bg-white p-4 lg:p-6 shadow-md rounded-xl lg:rounded-2xl flex justify-around border border-gray-100">
      <div className="text-center">
        <Leaf className="mx-auto text-primary mb-1" />
        <h4 className="font-bold text-lg lg:text-xl">45.2kg</h4>
        <p className="text-xs text-gray-500">Sampah Daur</p>
      </div>
      <div className="text-center border-l border-r px-4 lg:px-8">
        <TreePine className="mx-auto text-primary mb-1" />
        <h4 className="font-bold text-lg lg:text-xl">12</h4>
        <p className="text-xs text-gray-500">Pohon Diselamatkan</p>
      </div>
    </div>
  );
};

export default StatsCard;
