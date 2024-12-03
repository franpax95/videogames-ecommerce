import { AddressType } from '@/types/address-type';
import { Briefcase, House, LucideProps, MapPin } from 'lucide-react';

export interface AddressTypeIconProps extends LucideProps {
  addressType: AddressType;
}

export function AddressTypeIcon({ addressType, ...props }: AddressTypeIconProps) {
  const { identifier } = addressType;

  if (identifier === 'home') {
    return <House {...props} />;
  }

  if (identifier === 'work') {
    return <Briefcase {...props} />;
  }

  return <MapPin {...props} />;
}
