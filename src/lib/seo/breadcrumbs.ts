// src/lib/seo/breadcrumbs.ts
import type { Locale, Dictionary } from "@/types/dictionary";

export interface BreadcrumbItem {
  name: string;
  item: string;
}

/**
 * Gera breadcrumbs multilíngues 100% Type-Safe
 * ✔ Compatível com TS 6.0 Strict e Next.js 16
 */
export function generateBreadcrumbs(
  pathname: string,
  locale: Locale,
  dict: Dictionary,
  baseUrl: string
): BreadcrumbItem[] {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  const segments = extractPathSegments(pathname, locale);
  const breadcrumbs: BreadcrumbItem[] = [];

  // 1️⃣ Home - Acesso seguro via Optional Chaining e Fallback para Nav About
  const homeTitle = dict.seo.pages?.home?.title ?? dict.common.nav.about ?? "Home";

  breadcrumbs.push({
    name: homeTitle,
    item: `${normalizedBaseUrl}/${locale}`,
  });

  // 2️⃣ Processamento de Segmentos
  let cumulativePath = `/${locale}`;

  for (const segment of segments) {
    const decodedSegment = decodeURIComponent(segment);
    cumulativePath += `/${segment}`;

    breadcrumbs.push({
      name: resolveLabel(decodedSegment, dict),
      item: `${normalizedBaseUrl}${cumulativePath}`,
    });
  }

  return breadcrumbs;
}

function extractPathSegments(pathname: string, locale: Locale): string[] {
  return pathname
    .split("/")
    .filter(Boolean)
    .filter((s) => s !== locale && s !== locale.split("-")[0]);
}

function resolveLabel(segment: string, dict: Dictionary): string {
  // 1. Tenta buscar em seo.pages
  const pages = dict.seo.pages;
  if (pages && segment in pages) {
    const page = pages[segment];
    if (page?.title) return page.title;
  }

  // 2. Tenta buscar em common.nav
  const nav = dict.common.nav;
  const navKey = segment as keyof typeof nav;
  if (nav[navKey]) {
    return nav[navKey];
  }

  // 3. Fallback: Formatação de Slug
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
