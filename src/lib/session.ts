'use server';

import { Session } from '@/types/session';
import { clearCookie, getCookie, setCookie } from './cookies';
import { sessionCookieId } from './constants';

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
