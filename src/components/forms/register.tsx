'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, buttonVariants } from '@/components/ui/button';
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
import Link from 'next/link';
import { useEffect } from 'react';
import { setZodLocale } from '@/lib/zod-locale';
import { API_ERROR } from '@/lib/constants';
import { useSession } from '@/hooks/use-session';
import {
  createRegisterErrorMap,
  registerFormErrorMessages,
  registerSchema
} from '@/schemas/register';
import { toast } from 'react-toastify';
import { ApiError } from '@/lib/api-error';
import constants from '@/lib/constants';
import { useTranslations } from '@/hooks/use-translations';
import { useApiErrorHandler } from '@/hooks/use-api-error-handler';

const { localeEndpoints: i18nSections } = constants;

export type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { loading, register } = useSession();
  const apiErrorHandler = useApiErrorHandler();
  const {
    locale,
    dictionaries: { [i18nSections.register]: dictionary }
  } = useTranslations();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirm: ''
    }
  });

  useEffect(() => {
    setZodLocale(createRegisterErrorMap(registerFormErrorMessages(dictionary)), locale);
  }, []);

  async function onSubmit(values: RegisterFormData) {
    const formData = new FormData();
    formData.append('username', values.username);
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('confirm', values.confirm);

    try {
      await register(formData);
      toast.info(dictionary?.succeed_register_message || 'Register successful');
    } catch (err) {
      const error = err as ApiError;
      if (error.type === API_ERROR.INCORRECT_CREDENTIALS) {
        toast.error(dictionary?.incorrect_credentials || 'Incorrect credentials');
      } else if (error.type === API_ERROR.INVALID_CREDENTIALS) {
        toast.error(dictionary?.invalid_credentials || 'Invalid credentials');
      } else {
        apiErrorHandler(error);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0 with-validation">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary?.email_label || 'Email'}</FormLabel>
              <FormControl>
                <Input placeholder="test@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary?.username_label || 'Username'}</FormLabel>
              <FormControl>
                <Input placeholder="User1234" {...field} />
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
              <FormLabel>{dictionary?.password_label || 'Password'}</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary?.confirm_password_label || 'Confirm password'}</FormLabel>
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

        <Link href="/login" className={buttonVariants({ variant: 'link', size: 'sm' })}>
          {dictionary?.login_link_message || 'Click here if you have already an account'}
        </Link>
      </form>
    </Form>
  );
}
