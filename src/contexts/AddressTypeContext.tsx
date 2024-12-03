'use client';

import React, { createContext, useState, ReactNode } from 'react';
import { AddressType } from '@/types/address-type';
import { ApiError } from '@/lib/api-error';
import { getAddressTypes } from '@/app/api/address-type';

interface AddressTypeContextType {
  loading: boolean;
  addressTypes: Array<AddressType>;
  fetchAddressTypes: () => Promise<void>;
}

interface AddressTypeProviderProps {
  children: ReactNode;
}

export const AddressTypeContext = createContext<AddressTypeContextType | undefined>(undefined);

export const AddressTypeProvider: React.FC<AddressTypeProviderProps> = ({ children }) => {
  const [addressTypes, setAddressTypes] = useState<Array<AddressType>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAddressTypes = async () => {
    setLoading(true);

    const result = await getAddressTypes();
    if ('error' in result) {
      setLoading(false);
      throw new ApiError(result);
    }

    setAddressTypes(result);
    setLoading(false);
  };

  return (
    <AddressTypeContext.Provider
      value={{
        loading,
        addressTypes,
        fetchAddressTypes
      }}
    >
      {children}
    </AddressTypeContext.Provider>
  );
};
