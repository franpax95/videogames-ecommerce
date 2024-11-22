import Link from 'next/link';
import { SidebarFooter } from '@/components/ui/sidebar';
import { buttonVariants } from '@/components/ui/button';
import { Locale } from '@/types/locale';

export function AppSidebarFooter({ lang }: { lang: Locale }) {
  return (
    <SidebarFooter>
      <div className="flex w-full justify-between space-x-2 p-4">
        <Link
          href={`/${lang}/login`}
          className={`${buttonVariants({
            variant: 'outline',
            className: 'text-sm'
          })} flex-1`}
        >
          Sign In
        </Link>

        <Link href={`/${lang}/register`} className={`${buttonVariants({})} flex-1`}>
          Sign Up
        </Link>
      </div>
    </SidebarFooter>
  );
}
