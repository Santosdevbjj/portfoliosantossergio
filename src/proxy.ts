import { NextRequest, NextResponse } from "next/server";
import {
  isValidLocale,
  normalizeLocale,
  type SupportedLocale,
} from "@/dictionaries/locales";

function getFirstSegment(pathname: string): string | null {
  const segments = pathname.split("/");
  const first = segments[1];
  return first ?? null;
}

function hasValidLocale(pathname: string): boolean {
  const first = getFirstSegment(pathname);
  if (!first) return false;
  return isValidLocale(first);
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (hasValidLocale(pathname)) {
    return NextResponse.next();
  }

  const acceptLanguage = request.headers.get("accept-language");
  const firstLanguage =
    acceptLanguage?.split(",")[0]?.trim() ?? null;

  const detectedLocale: SupportedLocale =
    normalizeLocale(firstLanguage);

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${detectedLocale}`;
    return NextResponse.redirect(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${detectedLocale}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api).*)",
  ],
};
