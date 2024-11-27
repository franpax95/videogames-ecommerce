import { AddressType } from '@/types/address-type';
import { Briefcase, House, LucideProps, MapPin } from 'lucide-react';

export interface AddressTypeIconProps extends LucideProps {
  addressType: AddressType;
}

export function AddressTypeIcon({ addressType, ...props }: AddressTypeIconProps) {
  const { name } = addressType;

  if (name === 'Home') {
    return <House {...props} />;
  }

  if (name === 'Work') {
    return <Briefcase {...props} />;
  }

  return <MapPin {...props} />;
}
