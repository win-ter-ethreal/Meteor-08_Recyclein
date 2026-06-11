import React, { createContext, useContext } from 'react';
import { useApp } from './AppContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { currentUser, login, register, logout } = useApp();

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
