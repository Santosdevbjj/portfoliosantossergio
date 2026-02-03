// src/proxy.ts
import { NextRequest, NextResponse } from "next/server";

const SUPPORTED_LOCALES = ["pt", "en", "es"] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /**
   * Ignorar rotas internas, assets, erros e arquivos
   */
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_error") ||
    pathname.startsWith("/_not-found") ||
    pathname.startsWith("/_global-error") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  /**
   * Raiz → locale padrão
   */
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/pt";
    return NextResponse.redirect(url);
  }

  /**
   * Extrai locale com segurança
   */
  const firstSegment = pathname.split("/")[1];

  if (!SUPPORTED_LOCALES.includes(firstSegment as SupportedLocale)) {
    const url = request.nextUrl.clone();
    url.pathname = `/pt${pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
