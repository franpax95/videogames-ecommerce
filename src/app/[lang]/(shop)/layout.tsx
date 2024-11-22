import { AppSidebar } from '@/components/shop/sidebar/app-sidebar';
import './styles.scss';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="main-layout__main">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
