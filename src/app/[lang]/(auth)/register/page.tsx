import './styles.scss';
import { getLocale } from '@/lib/get-locale';
import { getLocalizedContent } from '@/app/api/get-localized-content';
import { LocalizedContent } from '@/types/localized-content';
import { RegisterForm } from '@/components/forms/register';

export default async function RegisterPage() {
  const lang = getLocale();
  const dictionary = await getLocalizedContent('register', lang)
    .then((content: LocalizedContent) => {
      return content;
    })
    .catch((err) => {
      console.error(err);
      return null;
    });

  return (
    <div className="register">
      <h1 className="text-xl mb-4">{dictionary?.title || 'Register'}</h1>
      <RegisterForm lang={lang} dictionary={dictionary} />
    </div>
  );
}
