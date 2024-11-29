'use client';

import { Button } from '@/components/ui/button';
import { AtSign, Calendar1, Mail, Bell } from 'lucide-react';
import { toast } from 'react-toastify';
import { Switch } from '@/components/ui/switch';
import { TabsContent } from '@/components/ui/tabs';
import { useSession } from '@/hooks/use-session';
import { beautifyDate } from '@/utils';
import { ChangePasswordDialog } from '../dialogs/change-password';

export interface AccTabAccountProps {
  lang: string;
  changePasswordDictionary: { [key: string]: string } | null;
}

export default function AccTabAccount({ lang, changePasswordDictionary }: AccTabAccountProps) {
  const { user, logout } = useSession();

  const onLogoutClick = async () => {
    try {
      await logout('/');
      toast.info('You logout successfully');
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong.');
    }
  };

  return (
    <TabsContent value="account" className="acc-tab-account">
      <div className="acc-tab-account__section">
        <h1 className="acc-tab-account__section-title">Details</h1>

        <div className="app-badge">
          <div className="app-badge__icon">
            <AtSign />
          </div>
          <h2 className="app-badge__title">Email</h2>
          <p className="app-badge__subtitle">{user?.email || 'Email'}</p>
        </div>

        <div className="app-badge">
          <div className="app-badge__icon">
            <Calendar1 />
          </div>
          <h2 className="app-badge__title">Member Since</h2>
          <p className="app-badge__subtitle">{`${beautifyDate(user?.createdAt ?? '')}`}</p>
        </div>
      </div>

      <div className="acc-tab-account__section">
        <h1 className="acc-tab-account__section-title">Security</h1>

        <div className="acc-tab-account__option">
          <h2 className="acc-tab-account__option-name">Password</h2>
          <ChangePasswordDialog lang={lang} dictionary={changePasswordDictionary} />
        </div>
      </div>

      <div className="acc-tab-account__section">
        <h1 className="acc-tab-account__section-title">Preferences</h1>

        <div className="app-badge app-badge--interactive">
          <div className="app-badge__icon">
            <Mail />
          </div>
          <h2 className="app-badge__title">Newsletter</h2>
          <p className="app-badge__subtitle">
            Subscribe to our newsletter for product updates and promotions.
          </p>
        </div>

        <div className="app-badge app-badge--interactive">
          <div className="app-badge__icon">
            <Bell />
          </div>
          <h2 className="app-badge__title">Offers & Updates</h2>
          <p className="app-badge__subtitle">
            Receive news and offers from Game World and partners.
          </p>
        </div>

        <div className="acc-tab-account__option">
          <h2 className="acc-tab-account__option-name">Data Sharing</h2>
          <Switch className="data-[state=unchecked]:bg-slate-600" />
        </div>
      </div>

      <div className="acc-tab-account__section">
        <Button
          className="acc-tab-account__header-btn"
          variant="destructive"
          onClick={onLogoutClick}
        >
          Log out
        </Button>
      </div>
    </TabsContent>
  );
}
