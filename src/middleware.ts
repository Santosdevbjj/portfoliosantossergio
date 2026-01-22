import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

/**
 * DETECÇÃO DE IDIOMA (LOCALE)
 * Analisa as preferências do navegador do usuário e cruza com os idiomas suportados (PT, EN, ES).
 */
function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: string[] = [...i18n.locales];
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  try {
    return matchLocale(languages, locales, i18n.defaultLocale);
  } catch (err) {
    console.error('Erro ao detectar idioma:', err);
    return i18n.defaultLocale;
  }
}

/**
 * MIDDLEWARE DE ROTEAMENTO
 * Redireciona automaticamente para /pt, /en ou /es caso não haja prefixo na URL.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Ignora arquivos internos, API e assets
  const isInternalFile =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/favicon.ico' ||
    pathname === '/sw.js';

  if (isInternalFile) return NextResponse.next();

  // Redireciona se não houver prefixo de idioma
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    const cleanPath = pathname.replace(/^\/+/, ''); // remove barras iniciais extras
    const redirectUrl = new URL(`/${locale}/${cleanPath}${search}`, request.url);
    return NextResponse.redirect(redirectUrl, 307); // redirecionamento temporário (SEO-friendly)
  }

  return NextResponse.next();
}

/**
 * CONFIGURAÇÃO DO MATCHER
 * Define quais rotas passam pelo middleware
 */
export const config = {
  matcher: [
    // Todas as rotas, exceto APIs, _next/static, imagens e arquivos públicos
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|.*\\..*).*)',
  ],
};
