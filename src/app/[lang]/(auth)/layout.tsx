import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import './layout.scss';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import wallpaper from '@public/images/sign-wallpaper.jpg';

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="layout-auth">
      <div className="layout-auth__content">
        <Link
          href="/"
          className={`layout-auth__back ${buttonVariants({
            variant: 'link',
            size: 'lg'
          })}`}
        >
          <ArrowLeft className="layout-auth__back-icon" size={70} />
        </Link>

        <div className="layout-auth__scroll-container">
          <main className="layout-auth__main">{children}</main>
        </div>

        <div className="layout-auth__cover">
          <Image
            className="layout-auth__cover-img"
            src={wallpaper}
            alt="Sign Wallpaper"
            width={2392}
            height={2000}
          />
        </div>
      </div>
    </div>
  );
}
