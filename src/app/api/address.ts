'use server';

import { Address, AddressRequestData } from '@/types/address';
import { authGET, authPOST, authPUT } from './fetch-auth';
import constants from '@/lib/constants';
import { StrapiResponse } from '@/types/strapi-response';

const { address: endpoint } = constants.endpoints;

export const getAddresses = () => {
  return authGET<{ data: Array<Address> }>(`/${endpoint}?populate=address_type`).then((res) =>
    'data' in res ? res.data : res
  );
};

export const createAddress = async (data: AddressRequestData) => {
  return await authPOST<StrapiResponse<Address>, { data: AddressRequestData }>(`/${endpoint}`, {
    data
  }).then((res) => ('data' in res ? res.data : res));
};

export const updateAddress = async (data: Partial<AddressRequestData>, documentId: string) => {
  return await authPUT<StrapiResponse<Address>, { data: Partial<AddressRequestData> }>(
    `/${endpoint}/${documentId}`,
    {
      data
    }
  ).then((res) => ('data' in res ? res.data : res));
};
