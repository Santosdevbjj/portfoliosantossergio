import { NextRequest, NextResponse } from "next/server";
import {
  SUPPORTED_LOCALES,
  normalizeLocale,
} from "@/dictionaries/locales";

function hasLocale(pathname: string): boolean {
  return SUPPORTED_LOCALES.some(
    (locale) =>
      pathname === `/${locale}` ||
      pathname.startsWith(`/${locale}/`)
  );
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorar arquivos estáticos e rotas internas
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Se já tiver locale válido → segue
  if (hasLocale(pathname)) {
    return NextResponse.next();
  }

  // Detecta locale do navegador (Accept-Language)
  const acceptLanguage = request.headers.get("accept-language");
  const browserLocale = acceptLanguage?.split(",")[0] ?? null;

  const locale = normalizeLocale(browserLocale);

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|robots.txt|sitemap.xml).*)"],
};
