import { AddressType } from './address-type';
import { StrapiRelatedField } from './strapi-related-field';
import { User } from './user';

export interface Address {
  id: number;
  documentId: string;
  title: string;
  name: string;
  address_type: AddressType;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  phone_number: string;
  user?: User;
}

export type AddressRequestData = Omit<Address, 'id' | 'documentId' | 'address_type' | 'user'> & {
  id?: number;
  address_type: StrapiRelatedField;
  user: StrapiRelatedField;
};
