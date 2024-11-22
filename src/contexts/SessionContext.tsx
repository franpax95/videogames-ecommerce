'use client';

import React, { createContext, useState, ReactNode } from 'react';
import { User } from '@/types/user';
import { getSession } from '@/lib/session';
import { login, logout, register } from '@/app/api/auth';
import { Session } from '@/types/session';

interface SessionContextType {
  user: User | null;
  token: string | null;
  register: (formData: FormData) => Promise<void>;
  login: (formData: FormData) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

interface SessionProviderProps {
  children: ReactNode;
  initialSession: Session | null;
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<SessionProviderProps> = ({ initialSession, children }) => {
  const [user, setUser] = useState<User | null>(initialSession?.user ?? null);
  const [token, setToken] = useState<string | null>(initialSession?.token ?? '');
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async (formData: FormData) => {
    try {
      setLoading(true);
      await register(formData);
      const session = await getSession();
      if (session) {
        setUser(session.user);
        setToken(session.token);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (formData: FormData) => {
    try {
      setLoading(true);
      await login(formData);
      const session = await getSession();
      if (session) {
        setUser(session.user);
        setToken(session.token);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setToken(null);
  };

  return (
    <SessionContext.Provider
      value={{
        loading,
        user,
        token,
        register: handleRegister,
        login: handleLogin,
        logout: handleLogout
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
