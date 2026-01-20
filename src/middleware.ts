// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

/**
 * DETECÇÃO DE LOCALE
 * Analisa os headers do navegador para sugerir o idioma mais adequado.
 */
function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore: Tipagem do Negotiator vs Readonly locales
  const locales: string[] = [...i18n.locales];
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  try {
    return matchLocale(languages, locales, i18n.defaultLocale);
  } catch (error) {
    return i18n.defaultLocale;
  }
}

/**
 * MIDDLEWARE DE ROTEAMENTO INTERNACIONAL
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. IGNORAR ARQUIVOS PÚBLICOS E ESTÁTICOS
  // Protege imagens, robotos.txt, sitemaps e favicon de serem redirecionados
  const publicFiles = [
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/manifest.json',
    '/og-image.png',
    '/apple-touch-icon.png',
    '/icon.png',
  ];

  if (
    publicFiles.includes(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // Ignora qualquer arquivo com extensão (ex: .pdf, .jpg)
  ) {
    return NextResponse.next();
  }

  // 2. VERIFICA SE O IDIOMA JÁ ESTÁ PRESENTE NA URL
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // 3. REDIRECIONAMENTO SE O IDIOMA ESTIVER AUSENTE
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // Preserva o caminho original e os query params (importante para campanhas/ads)
    const redirectUrl = new URL(
      `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}${request.nextUrl.search}`,
      request.url
    );

    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

/**
 * MATCHER DE ALTA PERFORMANCE
 * Exclui rotas técnicas para garantir que o middleware só rode em requisições de páginas.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - all items inside public folder
     */
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|.*\\..*).*)',
  ],
};
