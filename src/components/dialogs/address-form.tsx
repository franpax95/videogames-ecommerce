import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { AddressForm } from '../forms/address';
import { Address } from '@/types/address';

export interface AddressFormDialogProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  address: Address | null;
  lang: string;
  dictionary: { [key: string]: string } | null;
  onClick: () => void;
}

export function AddressFormDialog({
  open,
  setOpen,
  address,
  lang,
  dictionary,
  onClick
}: AddressFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" onClick={onClick}>
          {dictionary?.creation_button_content || `Add Address`}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{dictionary?.title || 'Addresses'}</DialogTitle>
        </DialogHeader>

        <AddressForm
          address={address}
          onSucceed={() => setOpen(false)}
          lang={lang}
          dictionary={dictionary}
        />
      </DialogContent>
    </Dialog>
  );
}
