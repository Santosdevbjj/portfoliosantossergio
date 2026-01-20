// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

/**
 * FUNÇÃO AUXILIAR: DETECÇÃO DE LOCALE
 * Resolve o melhor idioma baseado nos headers de aceitação do navegador.
 * Performance: Otimizado para Edge Runtime do Next.js.
 */
function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore: i18n.locales é readonly, Negotiator exige string[]
  const locales: string[] = i18n.locales;
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  try {
    // Busca a melhor correspondência entre preferência do usuário e idiomas disponíveis
    return matchLocale(languages, locales, i18n.defaultLocale);
  } catch {
    // Fallback silencioso para o padrão em caso de erro na negociação
    return i18n.defaultLocale;
  }
}

/**
 * MIDDLEWARE DE INTERNACIONALIZAÇÃO
 * Intercepta requisições para gerenciar o roteamento de idiomas.
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. FILTRO DE EXCEÇÕES (Assets, API e Arquivos Públicos)
  // Evita que o middleware atue sobre imagens, PDFs ou fontes.
  const isPublicFile = /\.(.*)$/.test(pathname);

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    isPublicFile
  ) {
    return NextResponse.next();
  }

  // 2. VERIFICAÇÃO DE LOCALE NA URL
  // Se o caminho não começar com um idioma suportado, precisamos redirecionar.
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // 3. REDIRECIONAMENTO ESTRATÉGICO
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // Constrói a URL mantendo query params para não perder dados de rastreamento (ex: LinkedIn)
    const redirectUrl = new URL(
      `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}${request.nextUrl.search}`,
      request.url
    );

    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

/**
 * CONFIGURAÇÃO DO MATCHER (ESTRATEGIA SÊNIOR)
 * Define as rotas onde o middleware deve ser ignorado para preservar a performance.
 */
export const config = {
  matcher: [
    /*
     * Ignora rotas que não são páginas para otimizar o tempo de resposta:
     * - api, _next/static, _next/image
     * - Arquivos de metadados na raiz
     * - Pasta /icons/ que você criou na pasta public
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|apple-touch-icon.png|icons/).*)',
  ],
};
