// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

/**
 * Helper para detecção de idioma baseado nas preferências do navegador
 */
function getLocale(request: NextRequest): string {
  // Tenta ler o cookie de preferência manual primeiro (Rigor técnico)
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && i18n.locales.includes(cookieLocale as any)) {
    return cookieLocale;
  }

  try {
    const acceptLanguage = request.headers.get('accept-language');
    if (!acceptLanguage) return i18n.defaultLocale;

    const headers: Record<string, string> = { 'accept-language': acceptLanguage };
    const languages = new Negotiator({ headers }).languages();

    // @ts-ignore - Tipagem compatível com i18n-config
    return matchLocale(languages, i18n.locales, i18n.defaultLocale);
  } catch (err) {
    console.error('[Proxy] Falha na detecção de locale, usando default.');
    return i18n.defaultLocale;
  }
}

/**
 * CONVENÇÃO PROXY (Substituta do Middleware)
 * Atua na fronteira da rede para gerenciar o roteamento internacional.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Filtro de Exclusão: Ignorar arquivos estáticos e rotas de sistema
  // Essencial para manter a performance e evitar loops no Proxy
  const ignoredPaths = ['/_next', '/api', '/favicon.ico', '/robots.txt', '/sitemap.xml', '/assets'];
  if (ignoredPaths.some((path) => pathname.startsWith(path)) || pathname.includes('.')) {
    return NextResponse.next();
  }

  // 2. Verificar se a URL atual já possui o prefixo de idioma (ex: /pt/...)
  const isMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // 3. Se não houver locale, aplica a lógica de Proxy para redirecionar
  if (isMissingLocale) {
    const locale = getLocale(request);
    const redirectUrl = new URL(
      `/${locale}${pathname === '/' ? '' : pathname}`,
      request.url
    );

    // Preservar parâmetros de busca (query strings)
    request.nextUrl.searchParams.forEach((value, key) => {
      redirectUrl.searchParams.set(key, value);
    });
    
    // Redirecionamento temporário (307) para permitir que o SEO 
    // entenda que o conteúdo original vive nas rotas com locale.
    return NextResponse.redirect(redirectUrl, 307);
  }

  return NextResponse.next();
}

/**
 * Configuração do Matcher
 * Define onde o Proxy deve atuar. Excluímos explicitamente arquivos de imagem e estáticos.
 */
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|.*\\..*).*)'],
};
