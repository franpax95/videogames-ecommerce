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
import { createLoginErrorMap, loginFormErrorMessages, loginSchema } from '@/schemas/login';
import { useEffect } from 'react';
import { setZodLocale } from '@/lib/zod-locale';
import { API_ERROR } from '@/lib/constants';
import { useSession } from '@/hooks/use-session';
import { toast } from 'react-toastify';
import { ApiError } from '@/lib/api-error';
import constants from '@/lib/constants';
import { useTranslations } from '@/hooks/use-translations';

const { localeEndpoints: i18nSections } = constants;

export type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { loading, login } = useSession();
  const {
    locale,
    dictionaries: { [i18nSections.login]: dictionary }
  } = useTranslations();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  });

  useEffect(() => {
    setZodLocale(createLoginErrorMap(loginFormErrorMessages(dictionary)), locale);
  }, []);

  async function onSubmit(values: LoginFormData) {
    const formData = new FormData();
    formData.append('identifier', values.identifier);
    formData.append('password', values.password);

    try {
      await login(formData);
      toast.info(dictionary?.succeed_login_message || 'Login successful');
    } catch (err) {
      const error = err as ApiError;
      if (error.type === API_ERROR.INCORRECT_CREDENTIALS) {
        toast.error(dictionary?.incorrect_credentials || 'Incorrect credentials');
      } else if (error.type === API_ERROR.INVALID_CREDENTIALS) {
        toast.error(dictionary?.invalid_credentials || 'Invalid credentials');
      } else if (error.type === API_ERROR.SERVER_ERROR) {
        toast.error(dictionary?.server_error || 'Something went wrong. Please, try again later.');
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0 with-validation">
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary?.identifier_label || 'Username or email'}</FormLabel>
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

        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : dictionary?.submit_message || 'Submit'}
        </Button>

        <Link href="/register" className={buttonVariants({ variant: 'link', size: 'sm' })}>
          {dictionary?.register_link_message || "Click here if you don't have an account"}
        </Link>
      </form>
    </Form>
  );
}
