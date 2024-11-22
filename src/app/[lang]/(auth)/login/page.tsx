import { LoginForm } from '@/components/forms/login';
import './styles.scss';
import { getLocale } from '@/lib/get-locale';
import { getLocalizedContent } from '@/app/api/get-localized-content';
import { LocalizedContent } from '@/types/localized-content';

export default async function LoginPage() {
  const lang = getLocale();
  const dictionary = await getLocalizedContent('login', lang)
    .then((content: LocalizedContent) => {
      return content;
    })
    .catch((err) => {
      console.error(err);
      return null;
    });

  return (
    <div className="login">
      <h1 className="text-xl mb-4">{dictionary?.title || 'Login'}</h1>
      <LoginForm lang={lang} dictionary={dictionary} />
    </div>
  );
}
