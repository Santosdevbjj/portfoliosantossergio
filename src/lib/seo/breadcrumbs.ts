// src/lib/seo/breadcrumbs.ts

import type { Locale, Dictionary } from "@/types/dictionary";

export interface BreadcrumbItem {
  name: string;
  item: string;
}

/**
 * Gera breadcrumbs multilíngues com base:
 * - no pathname atual
 * - no locale ativo
 * - no dicionário carregado
 * - na baseUrl do site
 *
 * Compatível com:
 * - Next.js 16 (App Router)
 * - TypeScript 6 strict
 * - SEO JSON-LD
 * - Rotas dinâmicas
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
   Helpers Privados (Type-safe)
====================================================== */

/**
 * Remove barras extras do final
 */
function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

/**
 * Extrai segmentos válidos do pathname,
 * removendo locale e vazios.
 */
function extractPathSegments(
  pathname: string,
  locale: Locale
): string[] {
  return pathname
    .split("/")
    .filter(Boolean)
    .filter((segment) => segment !== locale);
}

/**
 * Resolve label da Home com fallback seguro.
 */
function resolveHomeLabel(dict: Dictionary): string {
  return (
    dict.seo?.pages?.home?.title ??
    "Home"
  );
}

/**
 * Resolve label do segmento:
 * 1. Tenta seo.pages
 * 2. Tenta common.nav
 * 3. Fallback para slug formatado
 */
function resolveSegmentLabel(
  segment: string,
  dict: Dictionary
): string {
  const decoded = decodeURIComponent(segment);

  const seoLabel = dict.seo?.pages?.[decoded]?.title;
  if (seoLabel) return seoLabel;

  const navLabel = dict.common?.nav?.[decoded];
  if (navLabel) return navLabel;

  return formatSlug(decoded);
}

/**
 * Formata slug em Title Case.
 * Ex: "data-engineering" → "Data Engineering"
 */
function formatSlug(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
