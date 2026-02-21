// src/lib/seo/breadcrumbs.ts

import type { Locale, Dictionary } from "@/types/dictionary";

/**
 * Deriva as chaves válidas de seo.pages
 * Totalmente type-safe com TS 6 strict
 */
type SeoPages = NonNullable<Dictionary["seo"]>["pages"];
type SeoPageKey = keyof SeoPages;

export interface BreadcrumbItem {
  name: string;
  item: string;
}

/**
 * Gera breadcrumbs multilíngues baseados em:
 * - pathname atual
 * - locale ativo
 * - dicionário carregado
 * - baseUrl do site
 *
 * ✔ Compatível com Next.js 16 (App Router)
 * ✔ Compatível com TypeScript 6 strict
 * ✔ Seguro para JSON-LD
 * ✔ Funciona com rotas dinâmicas
 */
export function generateBreadcrumbs(
  pathname: string,
  locale: Locale,
  dict: Dictionary,
  baseUrl: string
): BreadcrumbItem[] {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  const segments = extractPathSegments(pathname, locale);

  const breadcrumbs: BreadcrumbItem[] = [];

  // 1️⃣ Home sempre primeiro
  breadcrumbs.push({
    name: resolveHomeLabel(dict),
    item: `${normalizedBaseUrl}/${locale}`,
  });

  // 2️⃣ Demais segmentos
  let cumulativePath = `/${locale}`;

  for (const segment of segments) {
    cumulativePath += `/${segment}`;

    breadcrumbs.push({
      name: resolveSegmentLabel(segment, dict),
      item: `${normalizedBaseUrl}${cumulativePath}`,
    });
  }

  return breadcrumbs;
}

/* ======================================================
   Helpers Privados (100% Type-Safe)
====================================================== */

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

function extractPathSegments(
  pathname: string,
  locale: Locale
): string[] {
  return pathname
    .split("/")
    .filter(Boolean)
    .filter((segment) => segment !== locale);
}

function resolveHomeLabel(dict: Dictionary): string {
  return dict.seo?.pages?.home?.title ?? "Home";
}

/**
 * Type guard seguro para SeoPageKey
 */
function isSeoPageKey(
  key: string,
  pages: SeoPages
): key is SeoPageKey {
  return key in pages;
}

function resolveSegmentLabel(
  segment: string,
  dict: Dictionary
): string {
  const decoded = decodeURIComponent(segment);

  const pages = dict.seo?.pages;

  if (pages && isSeoPageKey(decoded, pages)) {
    return pages[decoded].title;
  }

  const nav = dict.common?.nav;
  if (nav && decoded in nav) {
    return nav[decoded as keyof typeof nav];
  }

  return formatSlug(decoded);
}

function formatSlug(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
