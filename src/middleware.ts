import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

/**
 * DETECÇÃO DE IDIOMA (LOCALE)
 * Analisa as preferências do navegador do usuário para decidir entre PT, EN ou ES.
 */
function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // Locales suportados pelo seu portfólio
  const locales: string[] = [...i18n.locales];
  
  // Obtém os idiomas preferidos do cabeçalho 'accept-language'
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  try {
    // Tenta encontrar o melhor match, senão retorna o padrão (pt)
    return matchLocale(languages, locales, i18n.defaultLocale);
  } catch (error) {
    return i18n.defaultLocale;
  }
}

/**
 * MIDDLEWARE DE ROTEAMENTO
 * Garante que cada requisição seja direcionada para o prefixo de idioma correto.
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. FILTRO DE EXCEÇÕES (Arquivos da pasta /public)
  // Ignora explicitamente arquivos de SEO, imagens e currículos para não causar 404
  const isPublicFile = [
    '/robots.txt',
    '/sitemap.xml',
    '/favicon.ico',
    '/manifest.json'
  ].includes(pathname) || 
  pathname.match(/\.(png|jpg|jpeg|gif|webp|avif|svg|pdf|ico)$/i);

  if (isPublicFile) {
    return NextResponse.next();
  }

  // 2. VERIFICAÇÃO DE PREFIXO DE IDIOMA
  // Checa se o pathname já começa com /pt, /en ou /es
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // 3. REDIRECIONAMENTO INTELIGENTE
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // Constrói a nova URL preservando slugs (ex: /projects -> /pt/projects)
    // e preservando Query Params (ex: ?source=linkedin)
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
 * CONFIGURAÇÃO DO MATCHER (Next.js 15 Otimizado)
 * Define quais caminhos o middleware deve observar.
 */
export const config = {
  matcher: [
    // Pula todas as rotas internas (_next) e estáticos (arquivos com ponto)
    // Mas captura a raiz e rotas de página
    '/((?!api|_next/static|_next/image|images|icons|assets|favicon.ico|sw.js|.*\\..*).*)',
    // Garante que a raiz '/' sempre passe pelo middleware
    '/',
  ],
};
