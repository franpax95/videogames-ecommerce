import { Button } from '@/components/ui/button';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useSession } from '@/hooks/use-session';
import { profileFormErrorMessages, profileSchema } from '@/schemas/profile';
import { User } from '@/types/user';
import { createErrorMap, setZodLocale } from '@/lib/zod-locale';
import { authPUT } from '@/app/api/fetch-auth';
import { API_ERROR } from '@/lib/constants';
import { setSession } from '@/lib/session';

export type ProfileFormData = z.infer<typeof profileSchema>;

export type ProfileFormProps = {
  onSucceed: () => void;
  lang: string;
  dictionary: { [key: string]: string } | null;
};

export function ProfileForm({ onSucceed, lang, dictionary }: ProfileFormProps) {
  const { token, user, updateSession, logout } = useSession();
  const [loading, setLoading] = useState<boolean>(false);

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
    setZodLocale(createErrorMap(profileFormErrorMessages(dictionary)), lang);
  }, []);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) {
      toast.error('Something went wrong. Please reload the page or log in again.');
      return;
    }

    try {
      setLoading(true);

      // Edit user via API
      const userEditted = await authPUT<User, Partial<User>>(`/users/${user.id}`, data);

      // Update server session cookie
      await setSession({ token: token ?? '', user: userEditted });

      // Update client session state
      await updateSession();

      toast.success('Profile edited successfully');
      onSucceed();
    } catch (err) {
      const error = err as Error;

      // If unauthorized, then redirect to login
      if (
        error.message === API_ERROR.SESSION_EXPIRED ||
        error.message === API_ERROR.SESSION_INVALID
      ) {
        toast('Se ha cerrado la sesión por inactividad. Inicia sesión de nuevo.');
        logout('/login');
        return;
      }

      toast.error('Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="with-validation">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Email</FormLabel>
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
                <FormLabel className="text-right">Username</FormLabel>
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
                <FormLabel className="text-right">First Name</FormLabel>
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
                <FormLabel className="text-right">Last Name</FormLabel>
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
            {loading ? <Loader2 className="animate-spin" /> : 'Save changes'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
