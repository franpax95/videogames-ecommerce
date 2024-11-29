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
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { setZodLocale } from '@/lib/zod-locale';
import { API_ERROR } from '@/lib/constants';
import { useSession } from '@/hooks/use-session';
import { toast } from 'react-toastify';
import {
  changePasswordFormErrorMessages,
  changePasswordSchema,
  createChangePasswordFormErrorMap
} from '@/schemas/change-password';
import { ApiError } from '@/lib/api-error';
import { useTranslations } from '@/hooks/use-translations';
import constants from '@/lib/constants';

const { localeEndpoints: i18nSections } = constants;

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export interface ChangePasswordFormProps {
  onSucceed: () => void;
}

export function ChangePasswordForm({ onSucceed }: ChangePasswordFormProps) {
  const { loading, changePassword } = useSession();
  const {
    locale,
    dictionaries: { [i18nSections.changePassword]: dictionary }
  } = useTranslations();

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      password: '',
      passwordConfirmation: ''
    }
  });

  useEffect(() => {
    setZodLocale(
      createChangePasswordFormErrorMap(changePasswordFormErrorMessages(dictionary ?? {})),
      locale
    );
  }, [dictionary, locale]);

  async function onSubmit(values: ChangePasswordFormData) {
    const formData = new FormData();
    formData.append('currentPassword', values.currentPassword);
    formData.append('password', values.password);
    formData.append('passwordConfirmation', values.passwordConfirmation);

    try {
      await changePassword(formData);
      onSucceed();
      toast.info(dictionary?.succeed_toast_message || 'Password changed successful');
    } catch (err) {
      const error = err as ApiError;

      // Invalid credentials if current password is bad
      if (error.type === API_ERROR.INVALID_CREDENTIALS) {
        toast.error(dictionary?.invalid_credentials_message || 'Invalid credentials');
      }

      // Incorrect credentials because current password and new password equals
      else if (error.type === API_ERROR.INCORRECT_CREDENTIALS) {
        toast.error(dictionary?.incorrect_credentials_message || 'Incorrect credentials');
      }

      // Other errors
      else {
        toast.error(
          dictionary?.generic_error_toast || 'Something went wrong. Please, try again later.'
        );
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0 with-validation">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary?.current_password_label || 'Current Password'}</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary?.password_label || 'New Password'}</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="passwordConfirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {dictionary?.confirm_password_label || 'New Password Confirmation'}
              </FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : dictionary?.submit_message || 'Submit'}
        </Button>
      </form>
    </Form>
  );
}
