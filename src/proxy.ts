// src/proxy.ts

import { NextRequest, NextResponse } from "next/server";
import {
  isValidLocale,
  normalizeLocale,
  type SupportedLocale,
} from "@/dictionaries/locales";

/**
 * Extrai o primeiro segmento da URL.
 */
function getFirstSegment(pathname: string): string | null {
  const segments = pathname.split("/");
  return segments.length > 1 ? segments[1] : null;
}

/**
 * Verifica se a rota já contém um locale válido.
 */
function hasValidLocale(pathname: string): boolean {
  const first = getFirstSegment(pathname);
  if (!first) return false;
  return isValidLocale(first);
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorar internals, api e arquivos estáticos
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Já tem locale válido
  if (hasValidLocale(pathname)) {
    return NextResponse.next();
  }

  // Detecta idioma do navegador
  const acceptLanguage = request.headers.get("accept-language");
  const firstLanguage =
    acceptLanguage?.split(",")[0]?.trim() ?? null;

  const detectedLocale: SupportedLocale =
    normalizeLocale(firstLanguage);

  // Root "/"
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${detectedLocale}`;
    return NextResponse.redirect(url);
  }

  // Outras rotas
  const url = request.nextUrl.clone();
  url.pathname = `/${detectedLocale}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api).*)",
  ],
};
