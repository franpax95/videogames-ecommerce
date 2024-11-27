import { NextRequest, NextResponse } from 'next/server';
import { Locale } from './types/locale';
import constants from './lib/constants';

const { sessionCookieId } = constants.cookies;
const locales: Locale[] = ['en', 'es'];
const protectedRoutes = ['/account'];
const authRoutes = ['/login', '/register'];

function getLocale(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get('accept-language');
  return (acceptLanguage ? acceptLanguage.split(',')[0].split('-')[0] : 'en') as Locale;
}

function redirect(url: URL) {
  const redirected = NextResponse.redirect(url);
  redirected.headers.set('x-invoke-path', `${url}`);
  return redirected;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const rawSession = request.cookies.get(sessionCookieId)?.value;
  const session = rawSession ? JSON.parse(rawSession) : null;

  // Check if the pathname starts with a locale
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}`));
  const locale = pathnameHasLocale ? (pathname.split('/')[1] as Locale) : getLocale(request);

  // Remove locale from pathname for easier processing
  const pathnameWithoutLocale = pathnameHasLocale
    ? `/${pathname.split('/').slice(2).join('/')}`
    : pathname;

  // Check if it's a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathnameWithoutLocale.startsWith(route));

  // Check if it's an auth route
  const isAuthRoute = authRoutes.some((route) => pathnameWithoutLocale.startsWith(route));

  // Redirect to login if not authenticated and trying to access a protected route
  if (isProtectedRoute && !session) {
    return redirect(new URL(`/${locale}/login`, request.url));
  }

  // Redirect to home if authenticated and trying to access an auth route
  if (isAuthRoute && session) {
    return redirect(new URL(`/${locale}`, request.url));
  }

  // If pathname is missing locale, redirect to the same page with locale
  if (!pathnameHasLocale) {
    return redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  const response = NextResponse.next();
  response.headers.set('x-invoke-path', pathname);
  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',

    // Match all pathnames within each locale for login, register, and account
    '/:locale(en|es)/login',
    '/:locale(en|es)/register',
    '/:locale(en|es)/account/:path*'
  ]
};
