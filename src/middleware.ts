// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

/**
 * FUNÇÃO AUXILIAR: DETECÇÃO DE LOCALE
 * Resolve o melhor idioma baseado nos headers de aceitação do navegador.
 */
function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore: i18n.locales é readonly, mas Negotiator exige string mutable array
  const locales: string[] = i18n.locales;
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  try {
    // Busca a melhor interseção entre o que o usuário quer e o que o site oferece
    return matchLocale(languages, locales, i18n.defaultLocale);
  } catch (_error) {
    // Fallback silencioso para o padrão em caso de erro na negociação
    return i18n.defaultLocale;
  }
}

/**
 * MIDDLEWARE DE INTERNACIONALIZAÇÃO
 * Gerencia o roteamento de idiomas e protege assets estáticos.
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. FILTRO DE EXCEÇÕES (Assets, API e Arquivos Públicos)
  // Verifica se a rota termina com uma extensão de arquivo (evita processar imagens/fontes)
  const isPublicFile = /\.(.*)$/.test(pathname);

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    isPublicFile
  ) {
    return NextResponse.next();
  }

  // 2. VERIFICAÇÃO DE LOCALE NA URL
  // Checa se o pathname já começa com algum dos idiomas suportados
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // 3. REDIRECIONAMENTO ESTRATÉGICO
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // Preserva query strings (ex: ?utm_source=linkedin) durante o redirecionamento
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}${request.nextUrl.search}`,
        request.url
      )
    );
  }

  return NextResponse.next();
}

/**
 * CONFIGURAÇÃO DO MATCHER (PERFORMANCE)
 * Instruímos o Next.js a ignorar rotas técnicas para ganhar milissegundos no First Contentful Paint.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|apple-touch-icon.png|icons/).*)',
  ],
};
