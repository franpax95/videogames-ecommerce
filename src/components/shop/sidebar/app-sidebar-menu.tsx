import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import Link from 'next/link';
import Image from 'next/image';
import { Platform } from '@/types/platform';
import { Locale } from '@/types/locale';

export type AppSidebarMenuProps = {
  platforms: Array<Platform>;
  lang: Locale;
};

export function AppSidebarMenu({ platforms, lang }: AppSidebarMenuProps) {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Platforms</SidebarGroupLabel>

        <SidebarGroupContent>
          <SidebarMenu>
            {platforms.map((item) => (
              <SidebarMenuItem key={item.documentId}>
                <SidebarMenuButton asChild>
                  <Link href={`/${lang}/platforms/${item.slug}`}>
                    <Image
                      src={item.icon.url}
                      alt={item.name}
                      width={16}
                      height={16}
                      style={{ filter: 'invert(1)' }}
                      priority={true}
                    />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
