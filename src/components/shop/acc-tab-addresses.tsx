'use client';

import { TabsContent } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import { ChevronRight } from 'lucide-react';
import { AddressTypeIcon } from './address-type-icon';
import { formatAddress } from '@/utils';
import { AddressFormDialog } from '../dialogs/address-form';
import { useAddress } from '@/hooks/use-address';
import { Address } from '@/types/address';
import { ApiError } from '@/lib/api-error';
import { toast } from 'react-toastify';
import { API_ERROR } from '@/lib/constants';
import { useApiErrorHandler } from '@/hooks/use-api-error-handler';
import { useTranslations } from '@/hooks/use-translations';
import constants from '@/lib/constants';

const { localeEndpoints: i18nSections } = constants;

export default function AccTabAddresses() {
  const {
    dictionaries: { [i18nSections.account]: dictionary }
  } = useTranslations();

  const { loading, addresses, fetchAddresses } = useAddress();
  const [address, setAddress] = useState<Address | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const apiErrorHandler = useApiErrorHandler();

  useEffect(() => {
    const fetch = async () => {
      try {
        await fetchAddresses();
      } catch (err) {
        const error = err as ApiError;
        if (error.type === API_ERROR.SERVER_ERROR) {
          toast.error(
            dictionary?.fetch_addresses_error || 'Something went wrong recovering your addresses.'
          );
        }
        apiErrorHandler(error);
      }
    };

    fetch();
  }, []);

  const onAddressClick = (addr: Address) => {
    setAddress(address?.id === addr.id ? null : addr);
    setOpen(true);
  };

  return (
    <TabsContent value="addresses" className="acc-tab-addresses space-y-1">
      <h1 className="acc-tab-addresses__title">My Addresses</h1>

      {loading && (
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      )}

      {!loading &&
        addresses.map((address) => (
          <button
            key={address.id}
            className="acc-tab-addresses__address"
            onClick={() => onAddressClick(address)}
          >
            <div className="acc-tab-addresses__address-icon-wrapper">
              <AddressTypeIcon
                className="acc-tab-addresses__address-icon"
                addressType={address.address_type}
              />
            </div>

            <h2 className="acc-tab-addresses__address-title">{address.title}</h2>
            <p className="acc-tab-addresses__address-info">{formatAddress(address)}</p>

            <ChevronRight className="acc-tab-addresses__address-chevron" />
          </button>
        ))}

      <AddressFormDialog
        address={address}
        open={open}
        setOpen={setOpen}
        onClick={() => setAddress(null)}
      />
    </TabsContent>
  );
}
