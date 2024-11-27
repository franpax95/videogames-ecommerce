import { AddressContext } from '@/contexts/AddressContext';
import { useContext } from 'react';

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (context === undefined) {
    throw new Error('useAddress must be used within a AddressProvider');
  }
  return context;
};
