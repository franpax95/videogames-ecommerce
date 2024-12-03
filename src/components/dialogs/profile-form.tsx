'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ProfileForm } from '../forms/profile';
import constants from '@/lib/constants';
import { useTranslations } from '@/hooks/use-translations';

const { localeEndpoints: i18nSections } = constants;

export function ProfileFormDialog() {
  const [open, setOpen] = useState<boolean>(false);

  const {
    dictionaries: { [i18nSections.profileForm]: dictionary }
  } = useTranslations();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">{dictionary?.main_button_content || 'Edit Profile'}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <ProfileForm onSucceed={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
