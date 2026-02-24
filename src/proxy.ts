import { NextRequest, NextResponse } from "next/server";
import {
  SUPPORTED_LOCALES,
  normalizeLocale,
  type SupportedLocale,
} from "@/dictionaries/locales";

/**
 * Verifica se a URL já começa com um locale suportado.
 */
function hasLocale(pathname: string): boolean {
  return SUPPORTED_LOCALES.some(
    (locale) =>
      pathname === `/${locale}` ||
      pathname.startsWith(`/${locale}/`),
  );
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /**
   * Ignorar:
   * - Arquivos estáticos
   * - Rotas internas do Next
   * - API
   */
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  /**
   * Se já tem locale válido → não faz nada.
   */
  if (hasLocale(pathname)) {
    return NextResponse.next();
  }

  /**
   * Detecta idioma do navegador.
   */
  const acceptLanguage = request.headers.get("accept-language");

  const firstLanguage =
    acceptLanguage?.split(",")[0]?.trim() ?? null;

  const locale: SupportedLocale =
    normalizeLocale(firstLanguage);

  /**
   * Se for root "/" → redireciona para "/locale"
   */
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  /**
   * Para qualquer outra rota:
   * /about → /pt-BR/about
   */
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(url);
}

/**
 * Matcher alinhado com Next.js 16
 * Evita interceptar:
 * - static
 * - imagens
 * - arquivos públicos
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api).*)",
  ],
};
