/**
 * PROXY (Server-side Edge Logic) - Next.js 16 - VERSÃO FINAL ANTI-404
 * Foco: Compatibilidade total com Turbopack e Dicionários PT/EN/ES.
 */
import { NextRequest, NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import { i18n, type Locale } from '@/i18n-config';
import { LOCALE_COOKIE_NAME } from '@/lib/locale-cookie';

function detectLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value as Locale | undefined;
  if (cookieLocale && (i18n.locales as readonly string[]).includes(cookieLocale)) {
    return cookieLocale;
  }
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

  // 1. FILTRO DE SEGURANÇA (O segredo para eliminar o 404 no Vercel)
  // Ignora arquivos com extensão, pastas do Next.js e, crucialmente, pedidos de dados RSC.
  if (
    pathname.includes('.') || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    searchParams.has('_rsc') // Detectado no log (6) como causa de conflito
  ) {
    return NextResponse.next();
  }

  // 2. VERIFICAÇÃO DE LOCALIZAÇÃO (PT, EN, ES)
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 3. REDIRECIONAMENTO DE RAIZ
  if (!pathnameHasLocale) {
    const locale = detectLocale(request);
    
    // Constrói a URL sem forçar barras extras (previne 307 infinito)
    const url = new URL(
      `/${locale}${pathname === '/' ? '' : pathname}`,
      request.url
    );

    // Preserva parâmetros originais (ex: nxtPlang do seu log)
    searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    const response = NextResponse.redirect(url, 307);
    response.cookies.set(LOCALE_COOKIE_NAME, locale, { path: '/', maxAge: 31536000 });
    return response;
  }

  // 4. PREPARAÇÃO DO HEADER PARA O DICIONÁRIO
  // Extrai o locale da URL e passa para o servidor via header
  const currentLocale = pathname.split('/')[1] as Locale;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-lang', currentLocale);

  // Retorna a resposta permitindo que o Next.js renderize a página
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Headers de SEO dinâmico alinhados ao seu baseUrl
  const baseUrl = 'https://portfoliosantossergio.vercel.app';
  response.headers.set('Link', [
    `<${baseUrl}/pt>; rel="alternate"; hreflang="pt-BR"`,
    `<${baseUrl}/en>; rel="alternate"; hreflang="en-US"`,
    `<${baseUrl}/es>; rel="alternate"; hreflang="es-ES"`,
    `<${baseUrl}/pt>; rel="alternate"; hreflang="x-default"`,
  ].join(', '));

  return response;
}

export const config = {
  // Matcher que exclui explicitamente o que não deve ser "mexido" pelo middleware
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|robots.txt|sitemap.xml).*)'],
};
