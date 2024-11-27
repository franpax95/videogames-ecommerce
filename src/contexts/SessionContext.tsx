'use client';

import React, { createContext, useState, ReactNode } from 'react';
import { User } from '@/types/user';
import { getSession } from '@/lib/session';
import { changePassword, login, logout, register } from '@/app/api/auth';
import { Session } from '@/types/session';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/lib/api-error';
import { SerializedError } from '@/types/serialized-error';

interface SessionContextType {
  loading: boolean;
  user: User | null;
  token: string | null;
  updateSession: () => Promise<void>;
  register: (formData: FormData) => Promise<void>;
  login: (formData: FormData) => Promise<void>;
  logout: (redirectUrl?: string) => Promise<void>;
  changePassword: (formData: FormData) => Promise<void>;
}

interface SessionProviderProps {
  children: ReactNode;
  initialSession: Session | null;
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<SessionProviderProps> = ({ initialSession, children }) => {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(initialSession?.user ?? null);
  const [token, setToken] = useState<string | null>(initialSession?.token ?? '');
  const [loading, setLoading] = useState<boolean>(false);

  const updateSession = async () => {
    await getSession().then((session) => {
      setUser(session?.user ?? null);
      setToken(session?.token ?? '');
    });
  };

  const authCall = async (
    action: (formData: FormData) => Promise<void | SerializedError>,
    formData: FormData
  ) => {
    setLoading(true);

    const error = await action(formData);
    if (error) {
      setLoading(false);
      throw new ApiError(error);
    }

    const session = await getSession();
    if (session) {
      setUser(session.user);
      setToken(session.token);
    }

    setLoading(false);
  };

  const handleRegister = async (formData: FormData) => {
    return authCall(register, formData);
  };

  const handleLogin = async (formData: FormData) => {
    return authCall(login, formData);
  };

  const handleLogout = async (redirectUrl?: string) => {
    await logout();
    setUser(null);
    setToken(null);

    if (redirectUrl) {
      router.push(redirectUrl);
    }
  };

  const handleChangePassword = async (formData: FormData) => {
    return authCall(changePassword, formData);
  };

  return (
    <SessionContext.Provider
      value={{
        loading,
        user,
        token,
        updateSession,
        register: handleRegister,
        login: handleLogin,
        logout: handleLogout,
        changePassword: handleChangePassword
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
