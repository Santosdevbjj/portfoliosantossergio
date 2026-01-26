/**
 * PROXY (Server-side Edge Logic)
 * -----------------------------------------------------------------------------
 * Gerencia Internacionalização, GDPR, Consent Mode e Feature Flags.
 */
import { NextRequest, NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import { i18n, type Locale } from '@/i18n-config';
import { LOCALE_COOKIE_NAME } from '@/lib/locale-cookie';

/* -------------------------------------------------------------------------- */
/* 🌎 REGION DETECTION                                                        */
/* -------------------------------------------------------------------------- */
type Region = 'eu' | 'br' | 'us' | 'unknown';

const EU_COUNTRIES = new Set([
  'AT','BE','BG','CY','CZ','DE','DK','EE','ES','FI','FR','GR','HR','HU',
  'IE','IT','LT','LU','LV','MT','NL','PL','PT','RO','SE','SI','SK'
]);

function detectRegion(request: NextRequest): Region {
  const country = request.headers.get('x-vercel-ip-country') || request.headers.get('cf-ipcountry');
  if (!country) return 'unknown';
  if (EU_COUNTRIES.has(country)) return 'eu';
  if (country === 'BR') return 'br';
  if (country === 'US') return 'us';
  return 'unknown';
}

/* -------------------------------------------------------------------------- */
/* 🌐 LOCALE LOGIC                                                            */
/* -------------------------------------------------------------------------- */
function detectLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value as Locale | undefined;
  if (cookieLocale && (i18n.locales as readonly string[]).includes(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return i18n.defaultLocale;

  const languages = new Negotiator({ headers: { 'accept-language': acceptLanguage } }).languages();
  
  try {
    return matchLocale(languages, i18n.locales as unknown as string[], i18n.defaultLocale) as Locale;
  } catch {
    return i18n.defaultLocale;
  }
}

/* -------------------------------------------------------------------------- */
/* 🧠 PROXY CORE                                                              */
/* -------------------------------------------------------------------------- */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Detecção de Locale na URL
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 2. Redirecionamento se não houver locale
  if (!pathnameHasLocale) {
    const locale = detectLocale(request);
    const redirectUrl = new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url);
    
    const response = NextResponse.redirect(redirectUrl, 307);
    response.cookies.set(LOCALE_COOKIE_NAME, locale, { path: '/', maxAge: 31536000 });
    return response;
  }

  // 3. Extração de dados para Headers
  const currentLocale = pathname.split('/')[1] as Locale;
  const region = detectRegion(request);
  const consent = request.cookies.get('cookie_consent')?.value;
  const isStrictGDPR = region === 'eu' && consent !== 'granted';

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-lang', currentLocale);
  requestHeaders.set('x-user-region', region);
  requestHeaders.set('x-gdpr-mode', isStrictGDPR ? 'strict' : 'standard');

  // GA4 Consent Mode v2 Headers
  const consentStatus = isStrictGDPR ? 'denied' : 'granted';
  requestHeaders.set('x-consent-analytics_storage', consentStatus);
  requestHeaders.set('x-consent-ad_storage', consentStatus);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // 4. SEO: Hreflang Dinâmico
  const baseUrl = 'https://portfoliosantossergio.vercel.app';
  response.headers.set(
    'Link',
    [
      `<${baseUrl}/pt>; rel="alternate"; hreflang="pt-BR"`,
      `<${baseUrl}/en>; rel="alternate"; hreflang="en-US"`,
      `<${baseUrl}/es>; rel="alternate"; hreflang="es-ES"`,
      `<${baseUrl}/pt>; rel="alternate"; hreflang="x-default"`,
    ].join(', ')
  );

  response.headers.set('Vary', 'Accept-Language');
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - assets/images (public files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata)
     */
    '/((?!api|_next/static|_next/image|assets|images|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
