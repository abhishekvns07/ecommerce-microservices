import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getStoredUser());
  const [token, setToken] = useState(authService.getToken());
  const [isAuthenticated, setIsAuthenticated] = useState(!!authService.getToken());
  const [loading, setLoading] = useState(true);

  const verifyUser = async () => {
    const currentToken = authService.getToken();
    if (!currentToken) {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setToken(currentToken);
      setIsAuthenticated(true);
    } catch (err) {
      console.warn('JWT Verification failed on startup:', err);
      authService.logout();
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyUser();

    const handleAuthLogout = () => {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    };

    window.addEventListener('auth-logout-event', handleAuthLogout);
    return () => window.removeEventListener('auth-logout-event', handleAuthLogout);
  }, []);

  const login = async (usernameOrEmail, password) => {
    const res = await authService.login(usernameOrEmail, password);
    setUser(res.user);
    setToken(res.token);
    setIsAuthenticated(true);
    return res;
  };

  const register = async (username, email, password, role) => {
    const res = await authService.register(username, email, password, role);
    setUser(res.user);
    setToken(res.token);
    setIsAuthenticated(true);
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, register, logout, verifyUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
