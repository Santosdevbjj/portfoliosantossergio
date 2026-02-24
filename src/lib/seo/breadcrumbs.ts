// src/lib/seo/breadcrumbs.ts
import type { Locale, Dictionary } from "@/types/dictionary";

export interface BreadcrumbItem {
  name: string;
  item: string;
}

/**
 * Gera breadcrumbs multilíngues 100% Type-Safe
 * ✔ Compatível com TS 6 strict e Next.js 16
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

  // 1️⃣ Home (Sempre aponta para a raiz do idioma)
  breadcrumbs.push({
    name: dict.seo.pages.home.title,
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
    // Filtra tanto o locale completo (pt-BR) quanto o prefixo curto se houver (pt)
    .filter((s) => s !== locale && s !== locale.split("-")[0]);
}

function resolveLabel(segment: string, dict: Dictionary): string {
  // 1. Tenta buscar em seo.pages (mapeamento oficial de rotas)
  const pages = dict.seo.pages;
  if (segment in pages) {
    return pages[segment as keyof typeof pages].title;
  }

  // 2. Tenta buscar em common.nav
  const nav = dict.common.nav;
  if (segment in nav) {
    return nav[segment as keyof typeof nav];
  }

  // 3. Fallback: Formatação de Slug
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
