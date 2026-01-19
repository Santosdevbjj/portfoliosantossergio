// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';

/**
 * MIDDLEWARE DE INTERNACIONALIZAÇÃO - NEXT.JS 15
 * Gerencia o redirecionamento automático baseado na preferência do navegador.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Verifica se o pathname já contém um locale suportado
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // 2. Detecção Automática (Estratégia Sênior)
  const acceptLanguage = request.headers.get('accept-language');
  let locale = i18n.defaultLocale;

  if (acceptLanguage) {
    // Quebra a string "pt-BR,pt;q=0.9,en-US;q=0.8" e extrai ['pt', 'en']
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

  // 3. Redirecionamento Transparente
  // Redireciona de "/" para "/pt", "/en" ou "/es"
  const url = request.nextUrl.clone();
  const targetPath = pathname === '/' ? '' : pathname;
  url.pathname = `/${locale}${targetPath}`;

  // Usamos 307 (Temporary Redirect) para não "viciar" o cache do Google durante testes
  return NextResponse.redirect(url);
}

/**
 * CONFIGURAÇÃO DO MATCHER (Segurança e Performance)
 * Filtra quais caminhos o middleware DEVE IGNORAR.
 */
export const config = {
  matcher: [
    /*
     * Exclui caminhos que não devem ser traduzidos:
     * - api: Rotas de backend
     * - _next: Arquivos internos do framework
     * - manifest.json: Vital para instalação do PWA
     * - Arquivos estáticos na raiz (robots.txt, sitemap.xml, favicon.ico)
     * - Imagens e assets (png, jpg, svg, etc)
     */
    '/((?!api|_next/static|_next/image|images|assets|favicon.ico|robots.txt|sitemap.xml|manifest.json|.*\\..*$).*)',
  ],
};
