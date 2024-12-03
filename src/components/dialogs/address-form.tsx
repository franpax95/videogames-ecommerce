import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { AddressForm } from '../forms/address';
import { Address } from '@/types/address';
import constants from '@/lib/constants';
import { useTranslations } from '@/hooks/use-translations';

const { localeEndpoints: i18nSections } = constants;

export interface AddressFormDialogProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  address: Address | null;
  onClick: () => void;
}

export function AddressFormDialog({ open, setOpen, address, onClick }: AddressFormDialogProps) {
  const {
    dictionaries: { [i18nSections.addressForm]: dictionary }
  } = useTranslations();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" onClick={onClick}>
          {dictionary?.creation_button_content || `Add Address`}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{dictionary?.dialog_title || 'Addresses'}</DialogTitle>
          <DialogDescription>
            {address
              ? dictionary?.dialog_description_update ||
                "Update your address and click save when you're done."
              : dictionary?.dialog_description_create ||
                "Fill the address info and click save when you're done."}
          </DialogDescription>
        </DialogHeader>

        <AddressForm address={address} onSucceed={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
