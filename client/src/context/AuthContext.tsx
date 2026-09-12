'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAuthToken, removeAuthToken, getAuthToken } from '@/lib/api';

export interface IUserProfile {
  heightCm?: number;
  weightKg?: number;
  chestCm?: number;
  waistCm?: number;
  shoulderCm?: number;
  preferredFit?: 'tight' | 'regular' | 'relaxed' | 'oversized';
  usualSizes?: Record<string, string>;
  preferredBrands?: string[];
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin' | 'product_manager';
  profile?: IUserProfile;
  walletBalance?: number;
}

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  register: (name: string, email: string, pass: string, role?: string) => Promise<any>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: IUserProfile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get<{ user: IUser }>('/auth/me');
        setUser(res.user);
      } catch (err) {
        removeAuthToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await api.post<any>('/auth/login', { email, password: pass });
    if (res.token) {
      setAuthToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const register = async (name: string, email: string, pass: string, role?: string) => {
    const res = await api.post<any>('/auth/register', { name, email, password: pass, role });
    if (res.token) {
      setAuthToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const verifyOtp = async (email: string, otp: string) => {
    const res = await api.post<{ token: string; user: IUser }>('/auth/verify-otp', { email, otp });
    setAuthToken(res.token);
    setUser(res.user);
  };

  const googleLogin = async (credential: string) => {
    const res = await api.post<{ token: string; user: IUser }>('/auth/google', { credential });
    setAuthToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
  };

  const updateProfile = async (profileData: IUserProfile) => {
    const res = await api.put<{ profile: IUserProfile }>('/users/profile', profileData);
    if (user) {
      setUser({ ...user, profile: res.profile });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, verifyOtp, googleLogin, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
