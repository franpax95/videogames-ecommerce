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

export interface ChangePasswordDialogProps {
  lang: string;
  dictionary: { [key: string]: string } | null;
}

export function ChangePasswordDialog({ lang, dictionary }: ChangePasswordDialogProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">{dictionary?.password_button_content || 'Change'}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[350px]">
        <DialogHeader>
          <DialogTitle>{dictionary?.title}</DialogTitle>
        </DialogHeader>
        <ChangePasswordForm onSucceed={() => setOpen(false)} lang={lang} dictionary={dictionary} />
      </DialogContent>
    </Dialog>
  );
}
