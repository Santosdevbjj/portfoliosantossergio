/**
 * PROXY (Server-side Edge Logic) - Next.js 16 - VERSÃO FINAL BLINDADA
 * Foco: Compatibilidade total com Node 24+, Turbopack e Dicionários PT/EN/ES.
 * Localização: Deve ser mantido em src/proxy.ts conforme documentação Next.js 16.
 */
import { NextRequest, NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import { i18n, type Locale } from '@/i18n-config';
import { LOCALE_COOKIE_NAME } from '@/lib/locale-cookie';

function detectLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value as Locale | undefined;
  
  // 1. Prioridade para o Cookie
  if (cookieLocale && (i18n.locales as readonly string[]).includes(cookieLocale)) {
    return cookieLocale;
  }

  // 2. Preferência do Navegador
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return i18n.defaultLocale;
  
  const languages = new Negotiator({ headers: { 'accept-language': acceptLanguage } }).languages();
  
  try {
    return matchLocale(languages, i18n.locales as unknown as string[], i18n.defaultLocale) as Locale;
  } catch {
    return i18n.defaultLocale;
  }
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. FILTRO DE SEGURANÇA E PERFORMANCE
  // Ignora arquivos estáticos, APIs e requisições RSC para evitar loops e 404.
  if (
    pathname.includes('.') || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    searchParams.has('_rsc') 
  ) {
    return NextResponse.next();
  }

  // 2. VERIFICAÇÃO DE LOCALIZAÇÃO EXISTENTE
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 3. REDIRECIONAMENTO INTELIGENTE (SOLUÇÃO ANTI-EXCEPTION)
  if (!pathnameHasLocale) {
    const locale = detectLocale(request);
    
    // Constrói a nova URL
    const url = new URL(
      `/${locale}${pathname === '/' ? '' : pathname}`,
      request.url
    );

    // LIMPEZA CRUCIAL: Remove parâmetros internos do Next.js (nxtPlang, nxtP) 
    // que causam erros de 'Client-side exception' durante a hidratação do React 19.
    searchParams.forEach((value, key) => {
      if (key !== 'nxtPlang' && key !== 'nxtP') {
        url.searchParams.set(key, value);
      }
    });

    const response = NextResponse.redirect(url, 307);
    
    // Salva o idioma no cookie para persistência (1 ano)
    response.cookies.set(LOCALE_COOKIE_NAME, locale, { 
      path: '/', 
      maxAge: 31536000,
      sameSite: 'lax' 
    });
    
    return response;
  }

  // 4. PREPARAÇÃO DO HEADER PARA O SERVIDOR
  const currentLocale = pathname.split('/')[1] as Locale;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-lang', currentLocale);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // 5. SEO & HREFLANG (Padrão de acessibilidade global)
  const baseUrl = 'https://portfoliosantossergio.vercel.app';
  response.headers.set('Link', [
    `<${baseUrl}/pt>; rel="alternate"; hreflang="pt-BR"`,
    `<${baseUrl}/en>; rel="alternate"; hreflang="en-US"`,
    `<${baseUrl}/es>; rel="alternate"; hreflang="es-ES"`,
    `<${baseUrl}/>; rel="alternate"; hreflang="x-default"`,
  ].join(', '));

  return response;
}

export const config = {
  // Matcher otimizado para não interceptar assets desnecessários
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|robots.txt|sitemap.xml).*)'],
};
