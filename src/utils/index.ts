import { Address } from '@/types/address';
import { StrapiRelatedField } from '@/types/strapi-related-field';
import { DateTime } from 'luxon';

export const beautifyDate = (date: string, locale: string = 'en') =>
  DateTime.fromISO(date, { locale }).toFormat('DDD');

export const formatAddress = (address: Address) =>
  `${address.address}, ${address.city} ${address.postal_code}, ${address.state}`.trim();

export const prepareRelatedFieldForRequest = (documentIds: Array<string>): StrapiRelatedField => {
  return {
    connect: documentIds.map((id) => ({ documentId: id }))
  };
};
