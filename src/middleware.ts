import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

/**
 * DETECÇÃO DE IDIOMA (LOCALE)
 * Analisa as preferências do navegador do usuário e cruza com os idiomas suportados.
 */
function getLocale(request: NextRequest): string {
  try {
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => (headers[key] = value));

    const userLanguages = new Negotiator({ headers }).languages();
    return matchLocale(userLanguages, i18n.locales, i18n.defaultLocale);
  } catch (err) {
    console.error('[Middleware] Erro ao detectar idioma:', err);
    return i18n.defaultLocale;
  }
}

/**
 * MIDDLEWARE DE ROTEAMENTO
 * Redireciona automaticamente para /pt, /en ou /es caso não haja prefixo na URL.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Ignora rotas internas do Next.js, API, assets ou arquivos específicos
  const ignoredPaths = [
    '/_next',
    '/api',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/sw.js',
  ];
  if (
    ignoredPaths.some((path) => pathname.startsWith(path)) ||
    pathname.includes('.') // arquivos com extensão
  ) {
    return NextResponse.next();
  }

  // Verifica se a URL já contém um prefixo de idioma
  const isMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (isMissingLocale) {
    const locale = getLocale(request);
    const cleanPath = pathname.replace(/^\/+/, ''); // remove barras iniciais extras
    const redirectUrl = new URL(`/${locale}/${cleanPath}${search}`, request.url);
    return NextResponse.redirect(redirectUrl, 307); // SEO-friendly
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
