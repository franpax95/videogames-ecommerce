import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { ChangePasswordForm } from '../forms/change-password';
import { useTranslations } from '@/hooks/use-translations';
import constants from '@/lib/constants';

const { localeEndpoints: i18nSections } = constants;

export function ChangePasswordDialog() {
  const [open, setOpen] = useState<boolean>(false);
  const {
    dictionaries: { [i18nSections.changePassword]: dictionary }
  } = useTranslations();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">{dictionary?.password_button_content || 'Change'}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[350px]">
        <DialogHeader>
          <DialogTitle>{dictionary?.title}</DialogTitle>
        </DialogHeader>
        <ChangePasswordForm onSucceed={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
