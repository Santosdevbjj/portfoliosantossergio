// src/lib/seo/breadcrumbs.ts
import type { Locale, Dictionary } from "@/types/dictionary";

export interface BreadcrumbItem {
  name: string;
  item: string;
}

/**
 * Gera breadcrumbs multilíngues 100% Type-Safe
 * -----------------------------------------------------------------------------
 * ✔ Stack: TS 6.0 Strict, Next.js 16 (App Router)
 * ✔ I18n: Suporte nativo a PT/EN/ES
 * ✔ Resiliência: Tratamento de valores nulos e fallbacks inteligentes
 */
export function generateBreadcrumbs(
  pathname: string,
  locale: Locale,
  dict: Dictionary,
  baseUrl: string
): BreadcrumbItem[] {
  // Garantir que a baseUrl não termine com barra e tratar protocolos
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  const segments = extractPathSegments(pathname, locale);

  const breadcrumbs: BreadcrumbItem[] = [];

  // 1️⃣ Home (Sempre aponta para a raiz do idioma)
  // RESOLUÇÃO DO ERRO VERCEL: Uso de Nullish Coalescing para garantir que 'home' exista
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

/**
 * Extrai segmentos úteis da URL ignorando o locale
 */
function extractPathSegments(pathname: string, locale: Locale): string[] {
  return pathname
    .split("/")
    .filter(Boolean)
    // Filtra locale completo e simplificado
    .filter((s) => s !== locale && s !== locale.split("-")[0]);
}

/**
 * Resolve o nome amigável do segmento usando o dicionário
 */
function resolveLabel(segment: string, dict: Dictionary): string {
  const pages = dict.seo.pages;
  const nav = dict.common.nav;

  // 1. Tenta buscar em seo.pages (mapeamento de SEO)
  if (pages && segment in pages) {
    const pageData = pages[segment];
    if (pageData?.title) return pageData.title;
  }

  // 2. Tenta buscar em common.nav (links de navegação)
  // Fazemos um type-cast seguro para checar se o segmento existe no nav
  const navKey = segment as keyof typeof nav;
  if (nav[navKey]) {
    return nav[navKey];
  }

  // 3. Fallback: Formatação de Slug para Texto (Ex: "data-science" -> "Data Science")
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
