import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, login, logout } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogin = async (email, password) => {
    setAuthError(null);
    try {
      const user = await login(email, password);
      setCurrentUser(user);
    } catch (error) {
      setAuthError(error.response?.data?.message || 'Login failed'); 
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setAuthError(null); 
  };

  return (
    <AuthContext.Provider value={{ currentUser, handleLogin, handleLogout, authError }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
