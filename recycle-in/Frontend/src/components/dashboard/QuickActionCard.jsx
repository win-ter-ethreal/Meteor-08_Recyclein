import React from 'react';

const QuickActionCard = ({ icon, label, onClick, variant = 'vertical' }) => {
  if (variant === 'horizontal') {
    return (
      <button
        onClick={onClick}
        className="bg-bg p-4 rounded-2xl flex items-center gap-4 hover:shadow-md transition border border-primary/10 w-full text-left"
      >
        <div className="text-primary w-10 h-10 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <span className="font-semibold text-primary">{label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="bg-bg p-6 rounded-2xl flex flex-col items-center justify-center hover:shadow-lg transition border border-primary/10"
    >
      <div className="text-primary w-10 h-10 mb-2">{icon}</div>
      <span className="font-semibold text-primary">{label}</span>
    </button>
  );
};

export default QuickActionCard;
