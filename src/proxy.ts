import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * CONFIGURAÇÃO DE IDIOMAS
 * Alinhado com as tags 'alternate' encontradas no seu site:
 * pt-BR (padrão), en-US, es-ES, es-AR, es-MX
 */
const SUPPORTED_LOCALES = ["pt-BR", "en-US", "es-ES", "es-AR", "es-MX"];
const DEFAULT_LOCALE = "pt-BR";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. FILTRO DE SEGURANÇA (Evita Erro 500 e processamento desnecessário)
  // Ignora se for um arquivo estático (ex: .pdf, .png, .ico) ou pastas internas
  const isPublicFile = /\.(.*)$/.test(pathname);
  const isInternalPath = 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.startsWith('/_vercel') ||
    pathname.startsWith('/icons/') ||
    pathname.startsWith('/images/');

  if (isPublicFile || isInternalPath) {
    return NextResponse.next();
  }

  // 2. VALIDAÇÃO DE LOCALE EXISTENTE
  // Verifica se o pathname já começa com um dos idiomas suportados
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // 3. REDIRECIONAMENTO PARA O IDIOMA PADRÃO
  // Caso 3a: Se for a raiz exata "/", vai para "/pt-BR"
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}`, request.url));
  }

  // Caso 3b: Se for uma rota sem locale (ex: /sobre), injeta o locale padrão
  // Isso evita o erro de rota duplicada (/pt-BR/pt) verificado nos logs
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`;

  return NextResponse.redirect(url);
}

// 4. MATCHER OTIMIZADO
// Esta configuração instrui o Next.js a nem chamar este middleware para arquivos estáticos
export const config = {
  matcher: [
    /*
     * Ignora todos os caminhos que:
     * 1. Contenham um ponto (arquivos como favicon.ico, cv.pdf)
     * 2. Comecem com _next (arquivos internos do framework)
     * 3. Comecem com api (rotas de API)
     * 4. Comecem com _static ou _vercel
     */
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};
