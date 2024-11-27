import { SerializedError } from '@/types/serialized-error';
import { AxiosError } from 'axios';
import { API_ERROR } from './constants';

export const serializeError = (type: API_ERROR, axiosError?: AxiosError): SerializedError => ({
  error: {
    type,
    axiosError: axiosError ? JSON.stringify(axiosError) : undefined
  }
});
