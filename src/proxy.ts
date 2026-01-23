// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

/**
 * Helper para detecção de idioma com prioridade:
 * 1. Cookie (Preferência manual do usuário)
 * 2. Accept-Language (Preferência do navegador)
 * 3. Default (Fallback configurado)
 */
function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  
  // Validação rigorosa contra valores de cookies inválidos
  if (cookieLocale && (i18n.locales as readonly string[]).includes(cookieLocale)) {
    return cookieLocale;
  }

  try {
    const acceptLanguage = request.headers.get('accept-language');
    if (!acceptLanguage) return i18n.defaultLocale;

    const headers: Record<string, string> = { 'accept-language': acceptLanguage };
    const languages = new Negotiator({ headers }).languages();

    // @ts-ignore - i18n.locales é readonly string[]
    return matchLocale(languages, i18n.locales, i18n.defaultLocale);
  } catch (err) {
    console.warn('[Proxy] Falha na detecção automática. Usando padrão:', i18n.defaultLocale);
    return i18n.defaultLocale;
  }
}

/**
 * CONVENÇÃO PROXY (Substituta do Middleware no Next.js 16)
 * Gerencia a fronteira de rede para internacionalização e segurança.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. FILTRO DE EXCLUSÃO: Ignorar arquivos estáticos e pastas de sistema
  // Evita que o Next.js execute lógica de Proxy para carregar uma imagem ou ícone.
  const isPublicAsset = pathname.match(/\.(.*)$/) || 
                        pathname.startsWith('/api') || 
                        pathname.startsWith('/_next') ||
                        pathname.startsWith('/assets');

  if (isPublicAsset) return NextResponse.next();

  // 2. VERIFICAÇÃO DE PREFIXO DE IDIOMA
  // Checa se a URL já começa com um idioma suportado (ex: /en, /pt, /es)
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // 3. REDIRECIONAMENTO SE O LOCALE ESTIVER AUSENTE
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    
    // Normalização: Remove barra extra se o pathname for apenas '/'
    const path = pathname === '/' ? '' : pathname;
    const redirectUrl = new URL(`/${locale}${path}`, request.url);

    // Sincroniza parâmetros de busca (ex: ?ref=linkedin)
    request.nextUrl.searchParams.forEach((value, key) => {
      redirectUrl.searchParams.set(key, value);
    });

    return NextResponse.redirect(redirectUrl, 307);
  }

  // 4. HARDENING DE SEGURANÇA (Padrão 2026)
  // Adiciona cabeçalhos de proteção antes de entregar a página para renderização
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

/**
 * CONFIGURAÇÃO DO MATCHER
 * Otimizado para ignorar o core do Next.js e arquivos de mídia comuns.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - assets (folder de assets estáticos)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)',
  ],
};
