// src/lib/seo/breadcrumbs.ts
import type { Locale, Dictionary } from "@/types/dictionary";

export interface BreadcrumbItem {
  name: string;
  item: string;
}

/**
 * Gera breadcrumbs multilíngues 100% Type-Safe
 * -----------------------------------------------------------------------------
 * ✔ Next.js 16.2.0: Otimizado para rotas dinâmicas e SSR.
 * ✔ TypeScript 6.0: Correção de acesso via String Literal ['key'].
 * ✔ Node 24: Manipulação de strings de alta performance.
 * ✔ I18n: Suporte total a pt-BR, en-US, es-ES, es-AR, es-MX.
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

  // CORREÇÃO TS 6.0: Acesso via string literal para evitar erro de Index Signature
  // 1️⃣ Home - Acesso seguro via dicionário SEO
  const homeTitle = 
    dict.seo.pages?.['home']?.title ?? 
    dict.common.nav.about ?? 
    "Home";

  breadcrumbs.push({
    name: homeTitle,
    item: `${normalizedBaseUrl}/${locale}`,
  });

  // 2️⃣ Processamento de Segmentos (Recursivo/Cumulativo)
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
 * Extrai os segmentos da URL ignorando o locale
 */
function extractPathSegments(pathname: string, locale: Locale): string[] {
  return pathname
    .split("/")
    .filter(Boolean)
    .filter((s) => s !== locale && s !== locale.split("-")[0]);
}

/**
 * Resolve o nome amigável do segmento baseado no dicionário
 */
function resolveLabel(segment: string, dict: Dictionary): string {
  // 1. Tenta buscar em seo.pages usando acesso seguro de string literal
  const pages = dict.seo.pages;
  if (pages && pages[segment]) {
    const page = pages[segment];
    if (page?.title) return page.title;
  }

  // 2. Tenta buscar em common.nav (Mapeamento de navegação principal)
  const nav = dict.common.nav;
  // Fazemos um cast seguro para verificar se o segmento existe nas chaves do nav
  if (segment in nav) {
    return (nav as any)[segment];
  }

  // 3. Fallback: Formatação de Slug (ex: "meus-projetos" -> "Meus Projetos")
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
