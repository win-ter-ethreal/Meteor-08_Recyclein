import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Leaf, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/katalog', label: 'Katalog' },
    { path: '/reservasi', label: 'Jemput Sampah' },
    { path: '/rewards', label: 'Reward' },
  ];

  return (
    <nav className="hidden lg:block bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
            <Leaf className="text-primary w-6 h-6" />
            <span className="text-xl font-bold text-primary">Recycle-In</span>
          </button>
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  location.pathname === link.path
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition group"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="text-left">
                <span className="font-medium block leading-tight">{currentUser?.name}</span>
                <span className="text-xs text-primary font-semibold">{currentUser?.points?.toLocaleString()} pts</span>
              </div>
            </button>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="text-gray-400 hover:text-red-500 transition p-2 hover:bg-red-50 rounded-lg"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
      </div>
    </nav>
  );
};

export default Navbar;
