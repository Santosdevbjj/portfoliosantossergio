// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { i18n } from '@/i18n-config';
import { LOCALE_COOKIE, LOCALE_COOKIE_OPTIONS } from '@/lib/locale-cookie';

import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

/* -------------------------------------------------------------------------- */
/* LOCALE DETECTION                                                            */
/* -------------------------------------------------------------------------- */

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;

  if (
    cookieLocale &&
    i18n.locales.includes(cookieLocale as (typeof i18n.locales)[number])
  ) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return i18n.defaultLocale;

  const headers = { 'accept-language': acceptLanguage };
  const languages = new Negotiator({ headers }).languages();

  return matchLocale(languages, i18n.locales, i18n.defaultLocale);
}

/* -------------------------------------------------------------------------- */
/* EDGE PROXY                                                                  */
/* -------------------------------------------------------------------------- */

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isIgnored =
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    /\.[^/]+$/.test(pathname);

  if (isIgnored) return NextResponse.next();

  const missingLocale = i18n.locales.every(
    (locale) =>
      pathname !== `/${locale}` &&
      !pathname.startsWith(`/${locale}/`)
  );

  if (missingLocale) {
    const locale = getLocale(request);
    const normalizedPath = pathname === '/' ? '' : pathname;

    const redirectUrl = new URL(
      `/${locale}${normalizedPath}`,
      request.url
    );

    request.nextUrl.searchParams.forEach((v, k) =>
      redirectUrl.searchParams.set(k, v)
    );

    const response = NextResponse.redirect(redirectUrl, 307);

    response.cookies.set(LOCALE_COOKIE, locale, LOCALE_COOKIE_OPTIONS);

    // CDN correctness
    response.headers.set('Vary', 'Accept-Language');

    return response;
  }

  const response = NextResponse.next();

  /* --------------------------- Security Headers --------------------------- */
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set(
    'Referrer-Policy',
    'strict-origin-when-cross-origin'
  );
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  /* --------------------------- CDN Awareness ------------------------------- */
  response.headers.append('Vary', 'Accept-Language');

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)',
  ],
};
