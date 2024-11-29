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

export interface AccTabAddressesProps {
  lang: string;
  dictionary: { [key: string]: string } | null;
}

export default function AccTabAddresses({ lang, dictionary }: AccTabAddressesProps) {
  const { loading, addresses, fetchAddresses } = useAddress();
  const [address, setAddress] = useState<Address | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchAddresses();
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
        lang={lang}
        dictionary={dictionary}
        onClick={() => setAddress(null)}
      />
    </TabsContent>
  );
}
