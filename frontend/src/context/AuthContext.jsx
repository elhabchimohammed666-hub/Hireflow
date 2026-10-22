import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('hireflow_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('hireflow_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('hireflow_token');
      if (storedToken) {
        try {
          const res = await API.get('/auth/me');
          setUser(res.data.user);
          localStorage.setItem('hireflow_user', JSON.stringify(res.data.user));
        } catch (err) {
          console.error('Session expired or invalid:', err);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('hireflow_token', token);
    localStorage.setItem('hireflow_user', JSON.stringify(user));
    setToken(token);
    setUser(user);
    return user;
  };

  const register = async (userData) => {
    const res = await API.post('/auth/register', userData);
    const { token, user } = res.data;
    localStorage.setItem('hireflow_token', token);
    localStorage.setItem('hireflow_user', JSON.stringify(user));
    setToken(token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('hireflow_token');
    localStorage.removeItem('hireflow_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('hireflow_user', JSON.stringify(updatedUser));
  };

  const demoLogin = async (role) => {
    if (role === 'recruiter') {
      return await login('recruiter@atlasdigital.com', 'password123');
    } else {
      return await login('sara@example.com', 'password123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        demoLogin,
        isRecruiter: user?.role === 'recruiter',
        isCandidate: user?.role === 'candidate'
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
