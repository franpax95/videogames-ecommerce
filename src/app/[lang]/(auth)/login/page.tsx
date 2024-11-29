import { LoginForm } from '@/components/forms/login';
import './styles.scss';
import { getLocale } from '@/lib/get-locale';
import { getLocalizedContent } from '@/app/api/get-localized-content';
import { LocalizedContent } from '@/types/localized-content';
import { TranslationsProvider } from '@/contexts/TranslationsContext';
import constants from '@/lib/constants';
import { Dictionaries } from '@/types/Dictionaries';

const { localeEndpoints } = constants;

export default async function LoginPage() {
  const locale = getLocale();

  const generalDictionaryReq = getLocalizedContent(localeEndpoints.general, locale)
    .then((content: LocalizedContent) => {
      return content;
    })
    .catch((err) => {
      console.error(err);
      return {};
    });

  const loginDictionaryReq = getLocalizedContent(localeEndpoints.login, locale)
    .then((content: LocalizedContent) => {
      return content;
    })
    .catch((err) => {
      console.error(err);
      return {} as LocalizedContent;
    });

  const [generalDictionary, dictionary] = await Promise.all([
    generalDictionaryReq,
    loginDictionaryReq
  ]);

  const dictionaries: Dictionaries = {
    [localeEndpoints.general]: generalDictionary,
    [localeEndpoints.login]: loginDictionaryReq
  };

  return (
    <TranslationsProvider locale={locale} dictionaries={dictionaries}>
      <div className="login">
        <h1 className="text-xl mb-4">{dictionary?.title || 'Login'}</h1>
        <LoginForm />
      </div>
    </TranslationsProvider>
  );
}
