'use server';

import { redirect } from 'next/navigation';
import { loginSchema } from '@/schemas/login';
import { clearSession, setSession } from '@/lib/session';
import { registerSchema } from '@/schemas/register';
import { api } from '.';
import constants, { API_ERROR, STRAPI_API_VALIDATION_MESSAGES } from '@/lib/constants';
import { Session } from '@/types/session';
import { getLocale } from '@/lib/get-locale';
import { authPOST } from './fetch-auth';
import { ChangePasswordFormData } from '@/components/forms/change-password';
import { changePasswordSchema } from '@/schemas/change-password';
import { User } from '@/types/user';
import { ApiError } from '@/lib/api-error';
import { StrapiValidationErrorResponse } from '@/types/strapi-validation-error';
import { SerializedError } from '@/types/serialized-error';
import { serializeError } from '@/lib/serialize-error';
import { AxiosError } from 'axios';

const { auth: authEndPoint } = constants.endpoints;

export async function login(formData: FormData): Promise<void | SerializedError> {
  const validatedFields = loginSchema.safeParse({
    identifier: formData.get('identifier'),
    password: formData.get('password')
  });
  if (!validatedFields.success) {
    return serializeError(API_ERROR.INVALID_CREDENTIALS);
  }

  try {
    const response = await api.post(`${authEndPoint}/local`, validatedFields.data);
    if (response.status === 200) {
      const { jwt: token, user } = response?.data;
      const session: Session = { token, user };
      await setSession(session);
    } else {
      return serializeError(API_ERROR.INCORRECT_CREDENTIALS);
    }
  } catch (err) {
    const error = err as AxiosError;
    return serializeError(API_ERROR.SERVER_ERROR, error);
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
    return serializeError(API_ERROR.INVALID_CREDENTIALS);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { confirm, ...validatedData } = validatedFields.data;

  try {
    const response = await api.post(`${authEndPoint}/local/register`, validatedData);

    if (response.status === 200) {
      const { jwt: token, user } = response?.data;
      await setSession({ user, token });
    } else {
      return serializeError(API_ERROR.INCORRECT_CREDENTIALS);
    }
  } catch (err) {
    const error = err as AxiosError;
    return serializeError(API_ERROR.SERVER_ERROR, error);
  }

  // redirect in server action because router.push() doesn't work properly in client
  const locale = getLocale();
  redirect(`/${locale}`);
}

export async function logout() {
  return clearSession();
}

export async function changePassword(formData: FormData) {
  const validatedFields = changePasswordSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    password: formData.get('password'),
    passwordConfirmation: formData.get('passwordConfirmation')
  });
  if (!validatedFields.success) {
    return serializeError(API_ERROR.INVALID_CREDENTIALS);
  }

  const result = await authPOST<{ jwt: string; user: User }, ChangePasswordFormData>(
    `${authEndPoint}/change-password`,
    validatedFields.data
  );

  if ('error' in result) {
    const { axiosError } = new ApiError<StrapiValidationErrorResponse>(result);

    // Catch validation messages from strapi and send custom serialized error if necessary
    if (axiosError?.response?.status === 400) {
      if (
        axiosError?.response?.data?.error?.message ===
        STRAPI_API_VALIDATION_MESSAGES.CHANGE_PASSWORD_BAD_CURRENT_PASSWORD
      ) {
        return serializeError(API_ERROR.INVALID_CREDENTIALS, axiosError);
      }

      if (
        axiosError?.response?.data?.error?.message ===
        STRAPI_API_VALIDATION_MESSAGES.CHANGE_PASSWORD_SAME_PASSWORD
      ) {
        return serializeError(API_ERROR.INCORRECT_CREDENTIALS, axiosError);
      }
    }

    // Propagate the serialized error if other status code or message
    return result;
  }

  const { jwt: token, user } = result;
  await setSession({ user, token });
}
