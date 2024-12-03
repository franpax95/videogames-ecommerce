'use client';

import { Button } from '@/components/ui/button';
import { AtSign, Calendar1, Mail, Bell } from 'lucide-react';
import { toast } from 'react-toastify';
import { Switch } from '@/components/ui/switch';
import { TabsContent } from '@/components/ui/tabs';
import { useSession } from '@/hooks/use-session';
import { beautifyDate } from '@/utils';
import { ChangePasswordDialog } from '../dialogs/change-password';
import { useTranslations } from '@/hooks/use-translations';
import constants from '@/lib/constants';

const { localeEndpoints: i18nSections } = constants;

export default function AccTabAccount() {
  const { user, logout } = useSession();
  const {
    dictionaries: { [i18nSections.account]: dictionary, [i18nSections.general]: generalDictionary }
  } = useTranslations();

  const onLogoutClick = async () => {
    try {
      await logout('/');
      toast.info(generalDictionary?.logout_success_message || 'You logout successfully');
    } catch (error) {
      console.error(error);
      toast.error(
        generalDictionary?.generic_server_error_message ||
          'Something went wrong. Please, try again later.'
      );
    }
  };

  return (
    <TabsContent value="account" className="acc-tab-account">
      <div className="acc-tab-account__section">
        <h1 className="acc-tab-account__section-title">
          {dictionary?.account_tab_details_section_title || 'Details'}
        </h1>

        <div className="app-badge">
          <div className="app-badge__icon">
            <AtSign />
          </div>
          <h2 className="app-badge__title">
            {dictionary?.account_tab_details_section_email_label || 'Email'}
          </h2>
          <p className="app-badge__subtitle">{user?.email || 'Email'}</p>
        </div>

        <div className="app-badge">
          <div className="app-badge__icon">
            <Calendar1 />
          </div>
          <h2 className="app-badge__title">
            {dictionary?.account_tab_details_section_created_at_label || 'Member Since'}
          </h2>
          <p className="app-badge__subtitle">{`${beautifyDate(user?.createdAt ?? '')}`}</p>
        </div>
      </div>

      <div className="acc-tab-account__section">
        <h1 className="acc-tab-account__section-title">
          {dictionary?.account_tab_security_section_title || 'Security'}
        </h1>

        <div className="acc-tab-account__option">
          <h2 className="acc-tab-account__option-name">
            {dictionary?.account_tab_security_section_password_label || 'Password'}
          </h2>
          <ChangePasswordDialog />
        </div>
      </div>

      <div className="acc-tab-account__section">
        <h1 className="acc-tab-account__section-title">
          {dictionary?.account_tab_preferences_section_title || 'Preferences'}
        </h1>

        <div className="app-badge app-badge--interactive">
          <div className="app-badge__icon">
            <Mail />
          </div>
          <h2 className="app-badge__title">
            {dictionary?.account_tab_preferences_section_newsletter_label || 'Newsletter'}
          </h2>
          <p className="app-badge__subtitle">
            {dictionary?.account_tab_preferences_section_newsletter_content ||
              'Subscribe to our newsletter for product updates and promotions.'}
          </p>
        </div>

        <div className="app-badge app-badge--interactive">
          <div className="app-badge__icon">
            <Bell />
          </div>
          <h2 className="app-badge__title">
            {dictionary?.account_tab_preferences_section_offers_label || 'Offers & Updates'}
          </h2>
          <p className="app-badge__subtitle">
            {dictionary?.account_tab_preferences_section_offers_content ||
              'Receive news and offers from Game World and partners.'}
          </p>
        </div>

        <div className="acc-tab-account__option">
          <h2 className="acc-tab-account__option-name">
            {dictionary?.account_tab_preferences_section_data_sharing_label || 'Data Sharing'}
          </h2>
          <Switch className="data-[state=unchecked]:bg-slate-600" />
        </div>
      </div>

      <div className="acc-tab-account__section">
        <Button
          className="acc-tab-account__header-btn"
          variant="destructive"
          onClick={onLogoutClick}
        >
          {dictionary?.account_tab_logout_button || 'Log out'}
        </Button>
      </div>
    </TabsContent>
  );
}
