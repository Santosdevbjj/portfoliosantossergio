// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

/**
 * FUNÇÃO AUXILIAR: DETECÇÃO DE LOCALE
 * Utiliza algoritmos de negociação de conteúdo para escolher o melhor idioma.
 */
function getLocale(request: NextRequest): string | undefined {
  // 1. Extrai as preferências do header do navegador
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore: Locales são readonly, mas o Negotiator aceita strings
  const locales: string[] = i18n.locales;
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  try {
    // Tenta encontrar a melhor correspondência entre o que o site oferece e o que o usuário quer
    return matchLocale(languages, locales, i18n.defaultLocale);
  } catch (error) {
    return i18n.defaultLocale;
  }
}

/**
 * MIDDLEWARE DE INTERNACIONALIZAÇÃO
 * Intercepta requisições para garantir roteamento limpo e SEO consistente.
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. BYPASS PARA ASSETS E ARQUIVOS PÚBLICOS
  // Evita que o middleware processe imagens, ícones e arquivos técnicos
  const isPublicFile = pathname.match(
    /\.(.*)$/ // Captura qualquer coisa com extensão (png, jpg, svg, xml, etc)
  );

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    isPublicFile
  ) {
    return NextResponse.next();
  }

  // 2. VERIFICAÇÃO DE PRESENÇA DE LOCALE NA URL
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // 3. REDIRECIONAMENTO SE O LOCALE ESTIVER AUSENTE
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // Constrói a nova URL mantendo query params (ex: ?ref=linkedin)
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
 * Define onde o middleware deve ou não atuar.
 */
export const config = {
  matcher: [
    /*
     * Aplica o middleware em todas as rotas de página:
     * - Não aplica em rotas de API (_api)
     * - Não aplica em arquivos estáticos (_next/static)
     * - Não aplica em otimização de imagem (_next/image)
     * - Não aplica em arquivos na raiz (favicon.ico, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|apple-touch-icon.png).*)',
  ],
};
