'use server';

import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { api } from '.';
import { getSession, hasExpired } from '@/lib/session';
import { logout } from './auth';
import { API_ERROR } from '@/lib/constants';
import { SerializedError } from '@/types/serialized-error';
import { serializeError } from '@/lib/serialize-error';

export async function authenticatedFetch<T>(
  url: string,
  options: AxiosRequestConfig = {}
): Promise<T | SerializedError> {
  const session = await getSession();
  if (!session) {
    return serializeError(API_ERROR.SESSION_EXPIRED);
  }

  const expired = await hasExpired(session.token);
  if (expired) {
    await logout();
    return serializeError(API_ERROR.SESSION_EXPIRED);
  }

  try {
    const response: AxiosResponse<T> = await api({
      ...options,
      url,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${session.token}`
      }
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    // console.dir(error);

    if (axiosError.response?.status === 401) {
      // Token expired or invalid
      await logout();
      return serializeError(API_ERROR.SESSION_INVALID, axiosError);
    }

    if (axiosError.response?.status === 405) {
      // User without role permissions or endpoint doesn't exist
      return serializeError(API_ERROR.METHOD_NOT_ALLOWED, axiosError);
    }

    // Custom error with the Axios Response
    return serializeError(API_ERROR.SERVER_ERROR, axiosError);
  }
}

export async function authGET<T>(
  url: string,
  options: AxiosRequestConfig = {}
): Promise<T | SerializedError> {
  return authenticatedFetch<T>(url, { ...options, method: 'GET' });
}

export async function authPOST<T, U>(
  url: string,
  data?: U,
  options: AxiosRequestConfig = {}
): Promise<T | SerializedError> {
  return authenticatedFetch<T>(url, { ...options, method: 'POST', data });
}

export async function authPUT<T, U>(
  url: string,
  data?: U,
  options: AxiosRequestConfig = {}
): Promise<T | SerializedError> {
  return authenticatedFetch<T>(url, { ...options, method: 'PUT', data });
}

export async function authDELETE<T>(
  url: string,
  options: AxiosRequestConfig = {}
): Promise<T | SerializedError> {
  return authenticatedFetch<T>(url, { ...options, method: 'DELETE' });
}
