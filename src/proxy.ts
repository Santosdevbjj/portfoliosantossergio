import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/dictionaries/locales";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. IGNORAR INTERNALIZAÇÃO DA VERCEL E NEXT
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('.') // Ignora qualquer ficheiro com extensão (pdf, png, etc)
  ) {
    return NextResponse.next();
  }

  // 2. CHECAR SE O LOCALE JÁ ESTÁ NA URL
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // 3. REDIRECIONAMENTO DE RAIZ OU SEM LOCALE
  // Usamos redirect (307) para garantir que o motor de renderização do Next.js 16 
  // receba o parâmetro [lang] corretamente
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`;
  
  return NextResponse.redirect(url);
}

export const config = {
  // Matcher atualizado para syntax Next.js 16
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)',
  ],
};
