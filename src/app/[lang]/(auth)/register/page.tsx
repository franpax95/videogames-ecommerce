import './styles.scss';
import { getLocale } from '@/lib/get-locale';
import { getLocalizedContent } from '@/app/api/get-localized-content';
import { LocalizedContent } from '@/types/localized-content';
import { RegisterForm } from '@/components/forms/register';
import constants from '@/lib/constants';
import { Dictionaries } from '@/types/Dictionaries';
import { TranslationsProvider } from '@/contexts/TranslationsContext';

const { localeEndpoints } = constants;

export default async function RegisterPage() {
  const locale = getLocale();

  const generalDictionaryReq = getLocalizedContent(localeEndpoints.general, locale)
    .then((content: LocalizedContent) => {
      return content;
    })
    .catch((err) => {
      console.error(err);
      return {};
    });

  const registerDictionaryReq = getLocalizedContent(localeEndpoints.register, locale)
    .then((content: LocalizedContent) => {
      return content;
    })
    .catch((err) => {
      console.error(err);
      return {} as LocalizedContent;
    });

  const [generalDictionary, dictionary] = await Promise.all([
    generalDictionaryReq,
    registerDictionaryReq
  ]);

  const dictionaries: Dictionaries = {
    [localeEndpoints.general]: generalDictionary,
    [localeEndpoints.register]: registerDictionaryReq
  };

  return (
    <TranslationsProvider locale={locale} dictionaries={dictionaries}>
      <div className="register">
        <h1 className="text-xl mb-4">{dictionary?.title || 'Register'}</h1>
        <RegisterForm />
      </div>
    </TranslationsProvider>
  );
}
