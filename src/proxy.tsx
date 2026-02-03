// src/proxy.tsx
import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_LOCALES = ['pt', 'en', 'es'] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Proxy (substitui o antigo middleware no Next 16+)
 * Executa em todas as requisições
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /**
   * Ignorar arquivos estáticos e rotas internas
   */
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next();
  }

  /**
   * Raiz → redireciona para /pt
   */
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/pt';
    return NextResponse.redirect(url);
  }

  /**
   * Verifica se a primeira parte da URL é um locale válido
   */
  const maybeLocale = pathname.split('/')[1] as Locale | undefined;

  if (!SUPPORTED_LOCALES.includes(maybeLocale as Locale)) {
    const url = request.nextUrl.clone();
    url.pathname = `/pt${pathname}`;
    return NextResponse.redirect(url);
  }

  /**
   * Tudo OK → segue o fluxo
   */
  return NextResponse.next();
}

/**
 * Matcher explícito
 * Evita execução desnecessária em assets internos
 */
export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
