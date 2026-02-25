// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * CONFIGURAÇÃO DE IDIOMAS OFICIAIS
 * Sincronizado com src/dictionaries/locales.ts
 */
const SUPPORTED_LOCALES = ["pt-BR", "en-US", "es-ES", "es-AR", "es-MX"];
const DEFAULT_LOCALE = "pt-BR";

/**
 * LÓGICA DE PROXY / MIDDLEWARE
 * Responsável por garantir que o usuário sempre caia em uma rota com idioma.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. PROTEÇÃO DE ARQUIVOS ESTÁTICOS E SISTEMA
  // Evita que o middleware tente processar PDFs, imagens ou arquivos do Next.js
  const isInternal = 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.startsWith('/_vercel');

  // Regex para detectar extensões de arquivos no diretório public/
  const hasExtension = /\.(.*)$/.test(pathname);

  if (isInternal || hasExtension) {
    return NextResponse.next();
  }

  // 2. VERIFICAÇÃO DE LOCALIZAÇÃO EXISTENTE
  // Verifica se a URL já possui o locale correto para evitar loops (ex: /pt-BR/pt)
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // 3. REDIRECIONAMENTO INTELIGENTE
  // Se for a raiz "/", vai para o idioma padrão
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}`, request.url));
  }

  // Se for uma página sem locale (ex: /contato), anexa o padrão
  // Usamos rewrite em vez de redirect para manter a URL limpa se preferir, 
  // mas o redirect é mais seguro para SEO neste caso.
  return NextResponse.redirect(
    new URL(`/${DEFAULT_LOCALE}${pathname}`, request.url)
  );
}

/**
 * MATCHER DE ALTA PERFORMANCE (Turbopack Ready)
 * Filtra as requisições antes mesmo de chamarem o código acima.
 */
export const config = {
  matcher: [
    /*
     * Ignora:
     * - api (rotas de backend)
     * - _next/static (arquivos compilados)
     * - _next/image (otimização de imagens)
     * - favicon.ico, sitemap.xml, robots.txt
     * - Todos os arquivos com extensão (pdf, png, svg)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)',
  ],
};
