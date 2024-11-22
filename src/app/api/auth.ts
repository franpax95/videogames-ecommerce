'use server';

import { redirect } from 'next/navigation';
import { loginSchema } from '@/schemas/login';
import { clearSession, setSession } from '@/lib/session';
import { registerSchema } from '@/schemas/register';
import { api } from '.';
import { AUTH_ERROR } from '@/lib/constants';
import { Session } from '@/types/session';
import { getLocale } from '@/lib/get-locale';

export async function login(formData: FormData) {
  const validatedFields = loginSchema.safeParse({
    identifier: formData.get('identifier'),
    password: formData.get('password')
  });
  if (!validatedFields.success) {
    throw new Error(AUTH_ERROR.INVALID_CREDENTIALS);
  }

  try {
    const response = await api.post(`auth/local`, validatedFields.data);

    if (response.status === 200) {
      const { jwt: token, user } = response?.data;
      const session: Session = { token, user };
      await setSession(session);
    } else {
      throw new Error(AUTH_ERROR.INCORRECT_CREDENTIALS);
    }
  } catch (error) {
    console.error('Error durante el login:', error);
    throw new Error(AUTH_ERROR.SERVER_ERROR);
  }

  // redirect in server action because router.push() doesn't work properly in client
  const locale = getLocale();
  redirect(`/${locale}`);
}

export async function register(formData: FormData) {
  const validatedFields = registerSchema.safeParse({
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirm: formData.get('confirm')
  });
  if (!validatedFields.success) {
    throw new Error(AUTH_ERROR.INVALID_CREDENTIALS);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { confirm, ...validatedData } = validatedFields.data;

  try {
    const response = await api.post(`auth/local/register`, validatedData);

    if (response.status === 200) {
      const { jwt: token, user } = response?.data;
      await setSession({ user, token });
    } else {
      throw new Error(AUTH_ERROR.INCORRECT_CREDENTIALS);
    }
  } catch (error) {
    console.error('Error durante el registro:', error);
    throw new Error(AUTH_ERROR.SERVER_ERROR);
  }

  // redirect in server action because router.push() doesn't work properly in client
  const locale = getLocale();
  redirect(`/${locale}`);
}

export async function logout() {
  return clearSession();
}
