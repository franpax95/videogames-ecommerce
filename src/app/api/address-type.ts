import constants, { API_ERROR } from '@/lib/constants';
import { AddressType } from '@/types/address-type';
import { api } from '.';
import { AxiosError } from 'axios';
import { StrapiResponse } from '@/types/strapi-response';
import { serializeError } from '@/lib/serialize-error';

const { addressType: endpoint } = constants.endpoints;

export const getAddressTypes = () => {
  try {
    return api<StrapiResponse<Array<AddressType>>>(`/${endpoint}`).then(({ data }) => data.data);
  } catch (err) {
    const error = err as AxiosError;
    return serializeError(API_ERROR.SERVER_ERROR, error);
  }
};
