import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios.config';
import { User, Warehouse, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadWarehouses = async () => {
    try {
      const res = await api.get('/almacenes');
      setWarehouses(res.data || []);
      if (!selectedWarehouse && res.data?.length > 0) setSelectedWarehouse(res.data[0]);
    } catch {
      // Offline / Unauth
    }
  };

  const refreshProfile = async () => {
    try {
      const res = await api.get('/auth/profile');
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      await loadWarehouses();
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) refreshProfile();
    else setIsLoading(false);
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('token', receivedToken);
    localStorage.setItem('user', JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);
    await loadWarehouses();
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setSelectedWarehouse(null);
  };

  const hasRole = (...roles: string[]): boolean => {
    if (!user || !user.rol) return false;
    const userRol = user.rol.nombre.toLowerCase();
    return roles.some((r) => r.toLowerCase() === userRol);
  };

  const hasWarehouseAccess = (warehouseId?: number): boolean => {
    if (!warehouseId || hasRole('Administrador')) return true;
    if (!user || !user.almacenes) return false;
    return user.almacenes.some((w) => w.id === warehouseId);
  };

  return (
    <AuthContext.Provider
      value={{
        user, token, selectedWarehouse, warehouses,
        isAuthenticated: !!token && !!user, isLoading,
        login, logout, hasRole, hasWarehouseAccess,
        setSelectedWarehouse, refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
