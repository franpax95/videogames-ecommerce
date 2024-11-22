import { Locale } from '@/types/locale';
import { headers } from 'next/headers';

export function getLocale(): Locale {
  const headersList = headers();
  const pathname = headersList.get('x-invoke-path') || '';
  const lang = pathname.split('/')[1] as Locale;

  if (['en', 'es'].includes(lang)) {
    return lang;
  }

  return 'en'; // Default locale
}
