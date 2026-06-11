import React from 'react';

const DashboardLayout = ({ children }) => {
  return (
    <div className="pb-20 lg:pb-8 max-w-md lg:max-w-7xl mx-auto bg-white min-h-screen">
      {children}
    </div>
  );
};

export default DashboardLayout;
