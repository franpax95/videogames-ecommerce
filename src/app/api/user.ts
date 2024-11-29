import { User } from '@/types/user';
import { authPUT } from './fetch-auth';
import { StrapiResponse } from '@/types/strapi-response';
import constants from '@/lib/constants';

const { user: endpoint } = constants.endpoints;

export const updateUser = async (data: Partial<User>, id: number) => {
  return await authPUT<StrapiResponse<User>, { data: Partial<User> }>(`/${endpoint}/${id}`, {
    data
  }).then((res) => ('data' in res ? res.data : res));
};
