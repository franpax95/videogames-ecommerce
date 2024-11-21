import axios from 'axios';
import { api } from '.';
import { Locale } from '@/types/locale';
import { StrapiResponse } from '@/types/strapi-response';

export async function fetchAPI<T>(path: string, lang: Locale): Promise<StrapiResponse<T>> {
  try {
    const response = await api.get<StrapiResponse<T>>(`/${path}`, {
      params: { locale: lang }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw new Error('Failed to fetch API');
  }
}
