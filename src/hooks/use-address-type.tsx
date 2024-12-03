import { AddressTypeContext } from '@/contexts/AddressTypeContext';
import { useContext } from 'react';

export const useAddressType = () => {
  const context = useContext(AddressTypeContext);
  if (context === undefined) {
    throw new Error('useAddressType must be used within a AddressTypeProvider');
  }
  return context;
};
