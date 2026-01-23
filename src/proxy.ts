// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getLocale(request: NextRequest): string {
  try {
    const acceptLanguage = request.headers.get('accept-language');
    
    // Proteção contra o erro 'split' do log
    if (!acceptLanguage) return i18n.defaultLocale;

    const headers: Record<string, string> = { 'accept-language': acceptLanguage };
    const languages = new Negotiator({ headers }).languages();

    return matchLocale(languages, i18n.locales as unknown as string[], i18n.defaultLocale);
  } catch (err) {
    console.error('[Proxy] Erro ao detectar idioma:', err);
    return i18n.defaultLocale;
  }
}

/**
 * Migração conforme documentação Next.js 2026: 
 * Renomeado de middleware() para proxy()
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorar arquivos e rotas internas
  const ignoredPaths = ['/_next', '/api', '/favicon.ico', '/robots.txt', '/sitemap.xml', '/assets'];
  if (ignoredPaths.some((path) => pathname.startsWith(path)) || pathname.includes('.')) {
    return NextResponse.next();
  }

  const isMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (isMissingLocale) {
    const locale = getLocale(request);
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
    
    return NextResponse.redirect(redirectUrl, 307);
  }

  return NextResponse.next();
}

/**
 * O Matcher continua necessário para o Proxy
 */
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|.*\\..*).*)'],
};
