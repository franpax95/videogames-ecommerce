'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { setZodLocale } from '@/lib/zod-locale';
import { toast } from 'react-toastify';
import {
  addressFormErrorMessages,
  addressSchema,
  createAddressFormErrorMap
} from '@/schemas/address';
import { Address } from '@/types/address';
import { useAddress } from '@/hooks/use-address';
import { ApiError } from '@/lib/api-error';
import { useApiErrorHandler } from '@/hooks/use-api-error-handler';
import constants from '@/lib/constants';
import { useTranslations } from '@/hooks/use-translations';
import { useAddressType } from '@/hooks/use-address-type';

const { localeEndpoints: i18nSections } = constants;

export type AddressFormData = z.infer<typeof addressSchema>;

export interface AddressFormProps {
  address?: Address | null;
  onSucceed: () => void;
}

export function AddressForm({ address, onSucceed }: AddressFormProps) {
  const {
    locale,
    dictionaries: { [i18nSections.addressForm]: dictionary }
  } = useTranslations();

  const apiErrorHandler = useApiErrorHandler();
  const { loading, createAddress, updateAddress } = useAddress();
  const { addressTypes, fetchAddressTypes } = useAddressType();

  const save = useCallback(
    (formData: Partial<AddressFormData>) => {
      if (address) {
        return updateAddress(formData, address.documentId);
      }

      return createAddress(formData as AddressFormData);
    },
    [address, createAddress, updateAddress]
  );

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      title: address?.title ?? '',
      name: address?.name ?? '',
      address: address?.address ?? '',
      address_type: address?.address_type?.documentId ?? addressTypes[0]?.documentId ?? '',
      city: address?.city ?? '',
      state: address?.state ?? '',
      postal_code: address?.postal_code ?? '',
      phone_number: address?.phone_number ?? ''
    }
  });

  useEffect(() => {
    if (!addressTypes.length) {
      fetchAddressTypes();
    }
  }, []);

  useEffect(() => {
    if (form.getValues('address_type') === '' && addressTypes.length) {
      form.setValue('address_type', addressTypes[0].documentId);
    }
  }, [form, addressTypes]);

  useEffect(() => {
    setZodLocale(createAddressFormErrorMap(addressFormErrorMessages(dictionary)), locale);
  }, [dictionary, locale]);

  async function onSubmit(formData: AddressFormData) {
    try {
      await save(formData);
      onSucceed();
      const succeedMessage = address
        ? dictionary?.create_succeed_toast || 'Address created successful'
        : dictionary?.update_succeed_toast || 'Address updated successful';
      toast.info(succeedMessage);
    } catch (err) {
      const error = err as ApiError;
      apiErrorHandler(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0 with-validation">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary?.title_label || 'Title'}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary?.name_label || 'Name'}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary?.type_label || 'Type'}</FormLabel>
                <Select
                  defaultValue={field.value}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {addressTypes.map((type) => (
                      <SelectItem key={type.documentId} value={type.documentId}>
                        {type[locale]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary?.address_label || 'Address'}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary?.city_label || 'City'}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary?.state_label || 'State'}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postal_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary?.postal_code_label || 'Postal Code'}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary?.phone_number_label || 'Phone Number'}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : dictionary?.submit_message || 'Submit'}
        </Button>
      </form>
    </Form>
  );
}
