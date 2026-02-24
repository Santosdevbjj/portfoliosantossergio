import { NextRequest, NextResponse } from "next/server";
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  normalizeLocale,
} from "@/dictionaries/locales";

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

  if (pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.includes(".")) {
    return NextResponse.next();
  }

  if (hasLocale(pathname)) {
    return NextResponse.next();
  }

  const locale = normalizeLocale(
    pathname.split("/")[1],
  );

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|robots.txt|sitemap.xml).*)"],
};
