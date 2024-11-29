'use client';

import React, { createContext, useState, ReactNode } from 'react';
import { useSession } from '@/hooks/use-session';
import { ApiError } from '@/lib/api-error';
import { API_ERROR } from '@/lib/constants';
import { User } from '@/types/user';
import { updateUser } from '@/app/api/user';
import { ProfileFormData } from '@/components/forms/profile';
import { setSession } from '@/lib/session';

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
  const { token, user: sessionUser, updateSession } = useSession();
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpdateUser = async (formData: Partial<User>, id: number) => {
    setLoading(true);

    const result = await updateUser(formData, id);
    if ('error' in result) {
      setLoading(false);
      throw new ApiError(result);
      // const error = new ApiError(result);
      // return handleAuthApiError(error);

      // if (
      //   error.type === API_ERROR.SESSION_EXPIRED ||
      //   error.type === API_ERROR.SESSION_INVALID
      // ) {
      //   logout('/login');
      // }

      // throw error;
    }

    setLoading(false);
    return result;
  };

  const updateProfile = async (formData: Partial<ProfileFormData>) => {
    if (!sessionUser) {
      throw new ApiError(API_ERROR.SESSION_INVALID);
    }

    const user = await handleUpdateUser(formData, sessionUser.id);

    // Update server session cookie
    await setSession({ token: token ?? '', user });

    // Update client session state
    await updateSession();

    return user;
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
