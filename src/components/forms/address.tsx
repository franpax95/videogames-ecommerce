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

export type AddressFormData = z.infer<typeof addressSchema>;

export interface AddressFormProps {
  address?: Address | null;
  onSucceed: () => void;
  lang: string;
  dictionary: { [key: string]: string } | null;
}

export function AddressForm({ address, onSucceed, lang, dictionary }: AddressFormProps) {
  const { loading, addressTypes, createAddress, updateAddress, fetchAddressTypes } = useAddress();
  const save = useCallback(
    (formData: Partial<AddressFormData>) => {
      if (address) {
        return updateAddress(formData, address.documentId);
      }

      return createAddress(formData as AddressFormData);
    },
    [address]
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
    setZodLocale(createAddressFormErrorMap(addressFormErrorMessages(dictionary)), lang);
  }, [dictionary, lang]);

  async function onSubmit(formData: AddressFormData) {
    try {
      await save(formData);
      onSucceed();
      toast.info(
        dictionary?.succeed_toast_message || `Address ${address ? 'updated' : 'created'} successful`
      );
    } catch (err) {
      const error = err as ApiError;
      console.error(error);
      toast.error(
        dictionary?.generic_error_toast || 'Something went wrong. Please, try again later.'
      );
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
                <FormLabel>Title</FormLabel>
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
                <FormLabel>Name</FormLabel>
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
                <FormLabel>Type</FormLabel>
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
                        {type.name}
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
                <FormLabel>Address</FormLabel>
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
                <FormLabel>City</FormLabel>
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
                <FormLabel>State</FormLabel>
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
                <FormLabel>Postal Code</FormLabel>
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
                <FormLabel>Phone Number</FormLabel>
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
