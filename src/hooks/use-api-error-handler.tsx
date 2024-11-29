import { ApiError } from '@/lib/api-error';
import { useSession } from './use-session';
import { API_ERROR } from '@/lib/constants';
import constants from '@/lib/constants';
import { useTranslations } from './use-translations';
import { toast } from 'react-toastify';
import { useCallback } from 'react';

const { localeEndpoints: i18nSections } = constants;

export const useApiErrorHandler = () => {
  const { logout } = useSession();
  const { locale, dictionaries } = useTranslations();
  const { [i18nSections.general]: dictionary } = dictionaries;

  const handler = useCallback(
    (error: ApiError) => {
      if (error.type === API_ERROR.SESSION_EXPIRED) {
        toast.error(
          dictionary?.session_expired_logout_message ||
            'You have been logged out due to inactivity. Sign in again.'
        );
        logout('/login');
        return;
      }

      if (error.type === API_ERROR.SESSION_INVALID) {
        toast.error(
          dictionary?.session_expired_logout_message ||
            'An error has occurred. Please, log in again.'
        );
        logout(`/${locale}/login`);
        return;
      }

      toast.error(
        dictionary?.generic_server_error_message || 'Something went wrong. Please, try again later.'
      );
      return;
    },
    [locale, dictionary, logout]
  );

  return handler;
};
