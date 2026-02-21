// src/proxy.ts

import { NextRequest, NextResponse } from "next/server";
import type { Locale } from "@/types/dictionary";
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  normalizeLocale,
} from "@/dictionaries/locales";

/**
 * Middleware-style proxy for locale routing
 * ✔ TypeScript 6 strict compliant
 * ✔ Next.js 16 compliant
 * ✔ Edge runtime safe
 * ✔ Fully aligned with dictionaries
 */

/**
 * Verifica se o pathname deve ser ignorado
 * (arquivos estáticos, _next, api, assets etc.)
 */
function shouldIgnorePath(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/assets") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".")
  );
}

/**
 * Verifica se o path já contém locale válido
 */
function hasLocale(pathname: string): boolean {
  return SUPPORTED_LOCALES.some(
    (locale) =>
      pathname === `/${locale}` ||
      pathname.startsWith(`/${locale}/`),
  );
}

export default function proxy(
  request: NextRequest,
): NextResponse {
  const { pathname } = request.nextUrl;

  // Ignora arquivos estáticos e rotas internas
  if (shouldIgnorePath(pathname)) {
    return NextResponse.next();
  }

  // Se já tiver locale válido, segue fluxo normal
  if (hasLocale(pathname)) {
    return NextResponse.next();
  }

  // Detecta possível locale base (pt, en, es)
  const segments = pathname.split("/");
  const possibleLocale = segments[1];

  const normalizedLocale: Locale =
    normalizeLocale(possibleLocale);

  // Se o usuário acessou algo tipo /pt ou /en
  if (SUPPORTED_LOCALES.includes(normalizedLocale)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${normalizedLocale}${pathname.replace(
      `/${possibleLocale}`,
      "",
    )}`;
    return NextResponse.redirect(url);
  }

  // Caso padrão: redireciona para DEFAULT_LOCALE
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`;

  return NextResponse.redirect(url);
}
