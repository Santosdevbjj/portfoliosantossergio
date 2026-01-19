// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';

/**
 * MIDDLEWARE DE INTERNACIONALIZAÇÃO - NEXT.JS 15 (STABLE)
 * Este arquivo gerencia o redirecionamento automático baseado no idioma do navegador
 * do recrutador ou usuário, garantindo uma experiência global fluida.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Verifica se o pathname já contém um locale suportado (Ex: /en/projects)
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // 2. Detecção Automática (Fallback Inteligente)
  // Analisa o header 'accept-language' enviado pelo navegador (ex: Chrome em Inglês)
  const acceptLanguage = request.headers.get('accept-language');
  let locale = i18n.defaultLocale;

  if (acceptLanguage) {
    // Extrai os códigos de idioma (ex: 'pt-BR' vira 'pt')
    const preferredLocales = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].split('-')[0].trim().toLowerCase());

    // Procura o primeiro idioma preferido que nosso portfólio suporta (pt, en ou es)
    const detectedLocale = preferredLocales.find((lang) =>
      i18n.locales.includes(lang as any)
    );

    if (detectedLocale) {
      locale = detectedLocale;
    }
  }

  // 3. Redirecionamento de Rota
  // Se o usuário acessar "meusite.com/", ele será enviado para "meusite.com/pt" (ou en/es)
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;

  // Usamos redirecionamento 307 (Temporário) para evitar problemas de SEO 
  // e facilitar a troca de idioma manual pelo usuário
  return NextResponse.redirect(url);
}

/**
 * CONFIGURAÇÃO DO MATCHER (Segurança e Performance)
 * Define exatamente quais rotas o middleware deve observar.
 */
export const config = {
  matcher: [
    /*
     * Ignora arquivos que não devem passar pelo sistema de tradução:
     * - api: Chamadas de servidor
     * - _next: Arquivos internos do Next.js
     * - Imagens e assets (png, svg, jpg, webp)
     * - Arquivos de sistema (robots, sitemap, manifest)
     */
    '/((?!api|_next/static|_next/image|images|assets|favicon.ico|apple-icon.png|robots.txt|sitemap.xml|manifest.json|.*\\..*$).*)',
  ],
};
