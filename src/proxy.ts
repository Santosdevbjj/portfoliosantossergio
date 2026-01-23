import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

/**
 * DETECÇÃO DE IDIOMA (LOCALE) - SEGURA PARA PRODUÇÃO
 * Resolve o erro 'reading split' tratando cabeçalhos ausentes.
 */
function getLocale(request: NextRequest): string {
  try {
    const acceptLanguage = request.headers.get('accept-language');
    
    // Fallback imediato se o header não existir, evitando erro de processamento
    if (!acceptLanguage) {
      return i18n.defaultLocale;
    }

    const headers: Record<string, string> = { 'accept-language': acceptLanguage };
    const userLanguages = new Negotiator({ headers }).languages();

    // Valida compatibilidade com as línguas suportadas: pt, en, es
    return matchLocale(userLanguages, i18n.locales as unknown as string[], i18n.defaultLocale);
  } catch (err) {
    // Captura falhas inesperadas no parser e garante a continuidade da execução
    console.error('[Proxy] Erro ao detectar idioma:', err);
    return i18n.defaultLocale;
  }
}

/**
 * PROXY DE ROTEAMENTO (MIDDLEWARE)
 * Gerencia o direcionamento multilingue e protege rotas de sistema.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Lista de arquivos e caminhos de sistema que não devem sofrer redirecionamento
  const ignoredPaths = [
    '/_next',
    '/api',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/sw.js',
    '/assets',
  ];

  // Filtro de segurança: ignora arquivos estáticos e rotas de sistema
  if (
    ignoredPaths.some((path) => pathname.startsWith(path)) ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Verifica se a URL atual já possui um dos idiomas suportados (pt|en|es)
  const isMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (isMissingLocale) {
    const locale = getLocale(request);
    
    // Construção robusta da URL usando o objeto nativo do Next.js
    const redirectUrl = request.nextUrl.clone();
    
    // Ajusta o caminho injetando o idioma detectado na frente da rota
    redirectUrl.pathname = `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`;
    
    // Redirecionamento 307 (Temporário) - Melhor prática para SEO e troca de idiomas
    return NextResponse.redirect(redirectUrl, 307);
  }

  return NextResponse.next();
}

/**
 * CONFIGURAÇÃO DO MATCHER (NEXT.JS 16)
 * Define quais rotas serão processadas pelo proxy.
 */
export const config = {
  matcher: [
    // Processa todas as rotas de usuário, ignorando assets e arquivos internos
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|.*\\..*).*)',
  ],
};
