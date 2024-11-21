import { fetchAPI } from './fetch-api';
import { LocalizedContent } from '@/types/localized-content';
import { Locale } from '@/types/locale';

export async function getLocalizedContent(
  contentType: string,
  lang: Locale
): Promise<LocalizedContent> {
  const { data } = await fetchAPI<LocalizedContent>(contentType, lang);
  return data;
}
