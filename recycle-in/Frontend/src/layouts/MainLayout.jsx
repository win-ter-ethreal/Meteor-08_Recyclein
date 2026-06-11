import React from 'react';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white font-sans">
      {children}
    </div>
  );
};

export default MainLayout;
