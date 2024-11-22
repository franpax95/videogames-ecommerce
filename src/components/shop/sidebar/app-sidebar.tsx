import { Sidebar, SidebarHeader } from '@/components/ui/sidebar';
import Link from 'next/link';
import Image from 'next/image';
import { AppSidebarFooter } from './app-sidebar-footer';
import { AppSidebarMenu } from './app-sidebar-menu';
import { getPlatforms } from '@/app/api/platforms';
import { getLocale } from '@/lib/get-locale';
import logo from '@public/images/logo.png';

export async function AppSidebar() {
  // Ask for platforms on server action and pass to AppSidebarMenu to render inmediately
  const platforms = await getPlatforms().then(({ data }) => data);
  const lang = getLocale();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href={`/${lang}`}>
          <Image src={logo} alt="Logo Ecommerce" width={486} height={90} priority={true} />
        </Link>
      </SidebarHeader>

      <AppSidebarMenu platforms={platforms} lang={lang} />

      <AppSidebarFooter lang={lang} />
    </Sidebar>
  );
}
