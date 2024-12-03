import { Button } from '@/components/ui/button';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useSession } from '@/hooks/use-session';
import { profileFormErrorMessages, profileSchema } from '@/schemas/profile';
import { createErrorMap, setZodLocale } from '@/lib/zod-locale';
import { useUser } from '@/hooks/use-user';
import { useApiErrorHandler } from '@/hooks/use-api-error-handler';
import { ApiError } from '@/lib/api-error';
import constants from '@/lib/constants';
import { useTranslations } from '@/hooks/use-translations';

const { localeEndpoints: i18nSections } = constants;

export type ProfileFormData = z.infer<typeof profileSchema>;

export type ProfileFormProps = {
  onSucceed: () => void;
};

export function ProfileForm({ onSucceed }: ProfileFormProps) {
  const { user } = useSession();
  const {
    locale,
    dictionaries: { [i18nSections.profileForm]: dictionary }
  } = useTranslations();
  const apiErrorHandler = useApiErrorHandler();
  const { loading, updateProfile } = useUser();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: user?.email ?? '',
      username: user?.username ?? '',
      firstname: user?.firstname ?? '',
      lastname: user?.lastname ?? ''
    }
  });

  useEffect(() => {
    setZodLocale(createErrorMap(profileFormErrorMessages(dictionary)), locale);
  }, []);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data);
      toast.info(dictionary?.success_update_message || 'Profile edited successfully');
      onSucceed();
    } catch (err) {
      const error = err as ApiError;
      apiErrorHandler(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="with-validation">
        <DialogHeader>
          <DialogTitle>{dictionary?.dialog_title || 'Edit profile'}</DialogTitle>
          <DialogDescription>
            {dictionary?.dialog_description ||
              "Make changes to your profile here. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">{dictionary?.email_label || 'Email'}</FormLabel>
                <FormControl>
                  <Input className="col-span-3" {...field} />
                </FormControl>
                <FormMessage className="col-span-3 col-start-2" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">
                  {dictionary?.username_label || 'Username'}
                </FormLabel>
                <FormControl>
                  <Input className="col-span-3" {...field} />
                </FormControl>
                <FormMessage className="col-span-3 col-start-2" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">
                  {dictionary?.firstname_label || 'First Name'}
                </FormLabel>
                <FormControl>
                  <Input className="col-span-3" {...field} />
                </FormControl>
                <FormMessage className="col-span-3 col-start-2" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">
                  {dictionary?.lastname_label || 'Last Name'}
                </FormLabel>
                <FormControl>
                  <Input className="col-span-3" {...field} />
                </FormControl>
                <FormMessage className="col-span-3 col-start-2" />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              dictionary?.submit_button || 'Save changes'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
