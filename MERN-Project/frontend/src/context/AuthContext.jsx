import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('feedbackhub_token'));
  const [loading, setLoading] = useState(true);

  // Initialize and verify existing auth token on page reload
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('feedbackhub_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.auth.getMe();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Session verification failed, logging out:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const loginStudent = async (identifier, password) => {
    const data = await api.auth.login(identifier, password);
    if (data.token && data.user) {
      localStorage.setItem('feedbackhub_token', data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const loginAdmin = async (username, password) => {
    const data = await api.auth.adminLogin(username, password);
    if (data.token && data.user) {
      localStorage.setItem('feedbackhub_token', data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const registerStudent = async (formData) => {
    const data = await api.auth.register(formData);
    if (data.token && data.user) {
      localStorage.setItem('feedbackhub_token', data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('feedbackhub_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isStudent: user?.role === 'student',
        isAdmin: user?.role === 'admin',
        loginStudent,
        loginAdmin,
        registerStudent,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
