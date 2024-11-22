'use server';

import { cookies } from 'next/headers';

export async function getCookie(cookieId: string): Promise<string | null> {
  return cookies().get(cookieId)?.value || null;
}

export async function setCookie(cookieId: string, value: string) {
  cookies().set(cookieId, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600, // 1 hour
    path: '/'
  });
}

export async function clearCookie(cookieId: string) {
  cookies().delete(cookieId);
}
