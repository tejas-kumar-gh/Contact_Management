import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);
      const { data } = await api.post('/auth/register', { name, email, password });
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.get('/auth/logout');
      setUser(null);
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  const updateProfile = async (name) => {
    try {
      setError(null);
      const { data } = await api.put('/auth/profile', { name });
      setUser(data.data);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateProfile, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};
