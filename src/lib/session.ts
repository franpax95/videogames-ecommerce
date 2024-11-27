'use server';

import { Session } from '@/types/session';
import { clearCookie, getCookie, setCookie } from './cookies';
import constants from './constants';
import { jwtDecode } from 'jwt-decode';

const { sessionCookieId } = constants.cookies;

export const setSession = async (session: Session) => {
  await setCookie(sessionCookieId, JSON.stringify(session));
};

export const getSession = async (): Promise<Session | null> => {
  const value = await getCookie(sessionCookieId);
  if (!value) {
    return null;
  }

  return JSON.parse(value);
};

export const clearSession = async () => {
  await clearCookie(sessionCookieId);
};

export async function hasExpired(token: string) {
  const tokenDecode = jwtDecode(token);
  const expiredDate = (tokenDecode.exp ?? 0) * 1000;
  const currentDate = new Date().getTime();
  return currentDate > expiredDate;
}
