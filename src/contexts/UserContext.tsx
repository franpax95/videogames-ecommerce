'use client';

import React, { createContext, useState, ReactNode } from 'react';
import { useSession } from '@/hooks/use-session';
import { ApiError } from '@/lib/api-error';
import { API_ERROR } from '@/lib/constants';
import { User } from '@/types/user';
import { updateUser } from '@/app/api/user';
import { ProfileFormData } from '@/components/forms/profile';

interface UserContextType {
  loading: boolean;
  updateUser: (formData: Partial<User>, id: number) => Promise<User>;
  updateProfile: (formData: Partial<ProfileFormData>) => Promise<User>;
}

interface UserProviderProps {
  children: ReactNode;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { user: sessionUser } = useSession();
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpdateUser = async (formData: Partial<User>, id: number) => {
    setLoading(true);

    const result = await updateUser(formData, id);
    if ('error' in result) {
      setLoading(false);
      throw new ApiError(result);
    }

    setLoading(false);
    return result;
  };

  const updateProfile = async (formData: Partial<ProfileFormData>) => {
    if (!sessionUser) {
      throw new ApiError(API_ERROR.SESSION_INVALID);
    }

    return handleUpdateUser(formData, sessionUser?.id);
  };

  return (
    <UserContext.Provider
      value={{
        loading,
        updateUser: handleUpdateUser,
        updateProfile
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
