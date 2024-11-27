'use client';

import React, { createContext, useState, ReactNode } from 'react';
import { AddressType } from '@/types/address-type';
import { Address, AddressRequestData } from '@/types/address';
import { createAddress, getAddresses, updateAddress } from '@/app/api/address';
import { AddressFormData } from '@/components/forms/address';
import { useSession } from '@/hooks/use-session';
import { prepareRelatedFieldForRequest } from '@/utils';
import { ApiError } from '@/lib/api-error';
import { API_ERROR } from '@/lib/constants';
import { getAddressTypes } from '@/app/api/address-type';

interface AddressContextType {
  loading: boolean;
  addresses: Array<Address>;
  addressTypes: Array<AddressType>;
  fetchAddresses: () => Promise<void>;
  fetchAddressTypes: () => Promise<void>;
  createAddress: (formData: AddressFormData) => Promise<Address>;
  updateAddress: (formData: Partial<AddressFormData>, documentId: string) => Promise<Address>;
}

interface AddressProviderProps {
  children: ReactNode;
}

export const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider: React.FC<AddressProviderProps> = ({ children }) => {
  const { user } = useSession();
  const [addressTypes, setAddressTypes] = useState<Array<AddressType>>([]);
  const [addresses, setAddresses] = useState<Array<Address>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAddresses = async () => {
    setLoading(true);
    const result = await getAddresses();
    if ('error' in result) {
      setLoading(false);
      throw new ApiError(result);
    }
    setAddresses(result);
    setLoading(false);
  };

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

  const handleCreateAddress = async (formData: AddressFormData) => {
    if (!user) {
      throw new ApiError(API_ERROR.SESSION_INVALID);
    }

    setLoading(true);
    const data: AddressRequestData = {
      ...formData,
      address_type: prepareRelatedFieldForRequest([formData.address_type]),
      user: prepareRelatedFieldForRequest([user?.documentId])
    };
    const result = await createAddress(data);
    if ('error' in result) {
      setLoading(false);
      throw new ApiError(result);
    }

    await fetchAddresses(); // TODO: Mover lógica de refrescar addresses al componente tab addresses
    setLoading(false);
    return result;
  };

  const handleUpdateAddress = async (formData: Partial<AddressFormData>, documentId: string) => {
    if (!user) {
      throw new ApiError(API_ERROR.SESSION_INVALID);
    }

    setLoading(true);
    const { address_type, ...formValues } = formData;
    const data: Partial<AddressRequestData> = { ...formValues };
    if (address_type) {
      data.address_type = prepareRelatedFieldForRequest([address_type]);
    }

    const result = await updateAddress(data, documentId);
    if ('error' in result) {
      setLoading(false);
      throw new ApiError(result);
    }

    await fetchAddresses(); // TODO: Mover lógica de refrescar addresses al componente tab addresses
    setLoading(false);
    return result;
  };

  return (
    <AddressContext.Provider
      value={{
        loading,
        addresses,
        addressTypes,
        fetchAddresses,
        fetchAddressTypes,
        createAddress: handleCreateAddress,
        updateAddress: handleUpdateAddress
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};
