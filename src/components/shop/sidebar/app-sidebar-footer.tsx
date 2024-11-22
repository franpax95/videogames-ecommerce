'use client';

import Link from 'next/link';
import { SidebarFooter } from '@/components/ui/sidebar';
import { Button, buttonVariants } from '@/components/ui/button';
import { Locale } from '@/types/locale';
import { useSession } from '@/hooks/use-session';
import { ShoppingCart, User } from 'lucide-react';

export function AppSidebarFooter({ lang }: { lang: Locale }) {
  const { user } = useSession();

  return (
    <SidebarFooter>
      {user ? (
        <div className="flex w-full justify-between space-x-2 p-4">
          <Link
            href={`/${lang}/account`}
            className={`${buttonVariants({
              variant: 'outline',
              size: 'lg'
            })} flex-1`}
          >
            <User />
          </Link>

          <Button className={`${buttonVariants({ variant: 'default', size: 'lg' })} flex-1`}>
            <ShoppingCart />
          </Button>
        </div>
      ) : (
        <div className="flex w-full justify-between space-x-2 p-4">
          <Link
            href={`/${lang}/login`}
            className={`${buttonVariants({
              variant: 'outline'
            })} flex-1`}
          >
            Sign In
          </Link>

          <Link href={`/${lang}/register`} className={`${buttonVariants({})} flex-1`}>
            Sign Up
          </Link>
        </div>
      )}
    </SidebarFooter>
  );
}
