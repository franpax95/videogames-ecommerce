import { NextRequest, NextResponse } from 'next/server';
import { Locale } from './types/locale';

const locales: Locale[] = ['en', 'es'];

function getLocale(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get('accept-language');
  return (acceptLanguage ? acceptLanguage.split(',')[0].split('-')[0] : 'en') as Locale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
