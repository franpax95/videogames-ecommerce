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
  const locale = getLocale();

  const generalDictionaryReq = getLocalizedContent(localeEndpoints.general, locale)
    .then((content: LocalizedContent) => {
      return content;
    })
    .catch((err) => {
      console.error(err);
      return {};
    });

  const accountDictionaryReq = getLocalizedContent(localeEndpoints.account, locale)
    .then((content: LocalizedContent) => {
      return content;
    })
    .catch((err) => {
      console.error(err);
      return {} as LocalizedContent;
    });

  const profileFormDictionaryReq = getLocalizedContent(localeEndpoints.profileForm, locale)
    .then((content: LocalizedContent) => {
      return content;
    })
    .catch((err) => {
      console.error(err);
      return {};
    });

  const addressFormDictionaryReq = getLocalizedContent(localeEndpoints.addressForm, locale)
    .then((content: LocalizedContent) => {
      return content;
    })
    .catch((err) => {
      console.error(err);
      return {};
    });

  const changePasswordDictionaryReq = getLocalizedContent(localeEndpoints.changePassword, locale)
    .then((content: LocalizedContent) => {
      return content;
    })
    .catch((err) => {
      console.error(err);
      return {};
    });

  const [
    session,
    generalDictionary,
    dictionary,
    profileFormDictionary,
    addressFormDictionary,
    changePasswordDictionary
  ] = await Promise.all([
    getSession(),
    generalDictionaryReq,
    accountDictionaryReq,
    profileFormDictionaryReq,
    addressFormDictionaryReq,
    changePasswordDictionaryReq
  ]);

  const dictionaries: Dictionaries = {
    [localeEndpoints.general]: generalDictionary,
    [localeEndpoints.account]: dictionary,
    [localeEndpoints.profileForm]: profileFormDictionary,
    [localeEndpoints.addressForm]: addressFormDictionary,
    [localeEndpoints.changePassword]: changePasswordDictionary
  };

  return (
    <TranslationsProvider locale={locale} dictionaries={dictionaries}>
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
              <TabsTrigger value="orders">{dictionary?.orders_tab || 'Orders'}</TabsTrigger>
              <TabsTrigger value="wishlists">
                {dictionary?.wishlists_tab || 'Wish Lists'}
              </TabsTrigger>
              <TabsTrigger value="addresses">
                {dictionary?.addresses_tab || 'Addresses'}
              </TabsTrigger>
              <TabsTrigger value="account">{dictionary?.account_tab || 'Account'}</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="orders">My orders</TabsContent>
          <TabsContent value="wishlists">My wishlists</TabsContent>
          <AccTabAddresses />
          <AccTabAccount />
        </Tabs>
      </div>
    </TranslationsProvider>
  );
}
