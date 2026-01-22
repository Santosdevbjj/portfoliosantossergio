// src/proxy.ts
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
    // Converte headers do NextRequest para objeto padrão
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => (headers[key] = value));

    // Obtém idiomas preferidos do usuário
    const userLanguages = new Negotiator({ headers }).languages();

    // Retorna o idioma compatível ou padrão
    return matchLocale(userLanguages, i18n.locales, i18n.defaultLocale);
  } catch (err) {
    console.error('[Proxy] Erro ao detectar idioma:', err);
    return i18n.defaultLocale;
  }
}

/**
 * PROXY DE ROTEAMENTO
 * Redireciona automaticamente para /pt, /en ou /es caso não haja prefixo na URL.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Rotas, assets e arquivos a serem ignorados
  const ignoredPaths = [
    '/_next',
    '/api',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/sw.js',
  ];

  // Ignora rotas internas, arquivos públicos ou qualquer arquivo com extensão
  if (
    ignoredPaths.some((path) => pathname.startsWith(path)) ||
    pathname.includes('.')
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
    return NextResponse.redirect(redirectUrl, 307); // redirecionamento temporário (SEO-friendly)
  }

  return NextResponse.next();
}

/**
 * CONFIGURAÇÃO DO MATCHER
 * Define quais rotas passam pelo proxy
 */
export const config = {
  matcher: [
    // Todas as rotas, exceto APIs, _next/static, imagens e arquivos públicos
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|.*\\..*).*)',
  ],
};
