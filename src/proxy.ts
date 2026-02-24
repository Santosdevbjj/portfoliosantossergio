// src/proxy.ts

import { NextRequest, NextResponse } from "next/server";
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  isValidLocale,
  normalizeLocale,
  type SupportedLocale,
} from "@/dictionaries/locales";

/**
 * Extrai o primeiro segmento da URL.
 * Ex: "/pt-BR/about" → "pt-BR"
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

  /**
   * Ignorar:
   * - Next internals
   * - API
   * - Arquivos públicos com extensão
   */
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  /**
   * Se já tiver locale válido → não faz nada
   */
  if (hasValidLocale(pathname)) {
    return NextResponse.next();
  }

  /**
   * Detecta idioma do navegador
   */
  const acceptLanguage = request.headers.get("accept-language");
  const firstLanguage =
    acceptLanguage?.split(",")[0]?.trim() ?? null;

  const detectedLocale: SupportedLocale =
    normalizeLocale(firstLanguage);

  /**
   * Se for root "/"
   */
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${detectedLocale}`;
    return NextResponse.redirect(url);
  }

  /**
   * Para qualquer outra rota:
   * /about → /pt-BR/about
   */
  const url = request.nextUrl.clone();
  url.pathname = `/${detectedLocale}${pathname}`;

  return NextResponse.redirect(url);
}

/**
 * Matcher oficial recomendado para Next.js 16
 * Evita interceptar:
 * - _next
 * - arquivos estáticos
 * - api
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api).*)",
  ],
};
