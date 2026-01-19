// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';

/**
 * MIDDLEWARE DE INTERNACIONALIZAÇÃO (i18n)
 * Gerencia o roteamento dinâmico para garantir que o usuário veja
 * o conteúdo no idioma correto desde o primeiro acesso.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. IGNORAR PÁGINAS PÚBLICAS E ASSETS ESPECÍFICOS
  // Garante que arquivos na pasta /public não sejam redirecionados
  if (
    pathname.startsWith('/api') ||
    pathname.includes('.') || // ignora arquivos como .png, .ico, .json
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next();
  }

  // 2. VERIFICAÇÃO DE LOCALE NA URL
  // Checa se a URL já começa com /pt, /en ou /es
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // 3. DETECÇÃO DE IDIOMA DO NAVEGADOR (ACCEPT-LANGUAGE)
  const acceptLanguage = request.headers.get('accept-language');
  let locale = i18n.defaultLocale;

  if (acceptLanguage) {
    // Converte 'pt-BR,pt;q=0.9,en-US;q=0.8' em ['pt', 'en']
    const preferredLocales = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].split('-')[0].trim().toLowerCase());

    const detectedLocale = preferredLocales.find((lang) =>
      i18n.locales.includes(lang as any)
    );

    if (detectedLocale) {
      locale = detectedLocale;
    }
  }

  // 4. REDIRECIONAMENTO ESTRATÉGICO
  // Redireciona de "/" para "/pt" (ou o idioma detectado)
  const url = request.nextUrl.clone();
  
  // Trata a raiz e subcaminhos corretamente
  const targetPath = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
  url.pathname = targetPath;

  // Redirecionamento 307 (Temporário) é melhor para desenvolvimento e SEO dinâmico
  return NextResponse.redirect(url);
}

/**
 * CONFIGURAÇÃO DO MATCHER
 * Filtro de alta performance para evitar execução desnecessária do middleware.
 */
export const config = {
  matcher: [
    /*
     * Aplica o middleware em todas as rotas, exceto:
     * - api (rotas de API)
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico, sitemap, robots, manifest (arquivos de SEO)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json).*)',
  ],
};
