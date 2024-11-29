'use server';

import './styles.scss';
import { User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User as UserInterface } from '@/types/user';
import AccTabAccount from '@/components/shop/acc-tab-account';
import AccTabAddresses from '@/components/shop/acc-tab-addresses';
import { getLocalizedContent } from '@/app/api/get-localized-content';
import { getLocale } from '@/lib/get-locale';
import { LocalizedContent } from '@/types/localized-content';
import { getSession } from '@/lib/session';
import { ProfileFormDialog } from '@/components/dialogs/profile-form';
import { TranslationsProvider } from '@/contexts/TranslationsContext';
import constants from '@/lib/constants';
import { Dictionaries } from '@/types/Dictionaries';

const { localeEndpoints } = constants;

const fullname = ({ firstname, lastname }: Partial<UserInterface>) =>
  `${firstname} ${lastname}`.trim();

export default async function AccountPage() {
  const lang = getLocale();

  const generalDictionaryReq = getLocalizedContent(localeEndpoints.general, lang)
    .then((content: LocalizedContent) => {
      return content;
    })
    .catch((err) => {
      console.error(err);
      return {};
    });

  const changePasswordDictionaryReq = getLocalizedContent(localeEndpoints.changePassword, lang)
    .then((content: LocalizedContent) => {
      return content;
    })
    .catch((err) => {
      console.error(err);
      return {};
    });

  const [session, generalDictionary, changePasswordDictionary] = await Promise.all([
    getSession(),
    generalDictionaryReq,
    changePasswordDictionaryReq
  ]);

  const dictionaries: Dictionaries = {
    [localeEndpoints.general]: generalDictionary,
    [localeEndpoints.changePassword]: changePasswordDictionary
  };

  return (
    <TranslationsProvider locale={lang} dictionaries={dictionaries}>
      <div className="account-page">
        <div className="app-badge app-badge--big">
          <div className="app-badge__icon">
            <User size={38} />
          </div>
          <h2 className="app-badge__title">{session?.user?.username || 'Username'}</h2>
          <p className="app-badge__subtitle">
            {session?.user ? fullname(session.user) : 'Full Name'}
          </p>
        </div>

        <div className="account-page__profile-dialog-wrapper">
          <ProfileFormDialog />
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <div className="flex justify-center">
            <TabsList className="content-center">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="wishlists">Wish Lists</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="orders">My orders</TabsContent>
          <TabsContent value="wishlists">My wishlists</TabsContent>
          <AccTabAddresses lang={lang} dictionary={null} />
          <AccTabAccount />
        </Tabs>
      </div>
    </TranslationsProvider>
  );
}
