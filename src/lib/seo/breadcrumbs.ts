// src/lib/seo/breadcrumbs.ts
import type { Locale, Dictionary } from "@/types/dictionary";

export interface BreadcrumbItem {
  name: string;
  item: string;
}

/**
 * GERAÇÃO DE BREADCRUMBS MULTILÍNGUES (SEO OPTIMIZED)
 * -----------------------------------------------------------------------------
 * ✔ Next.js 16.2.0: Compatível com Turbopack e PPR.
 * ✔ TypeScript 6.0: Acesso Type-Safe a chaves dinâmicas do dicionário.
 * ✔ I18n: Suporte regional (PT-BR, EN-US, ES-ES, ES-AR, ES-MX).
 * ✔ Node 24: Manipulação eficiente de strings e memória.
 */
export function generateBreadcrumbs(
  pathname: string,
  locale: Locale,
  dict: Dictionary,
  baseUrl: string
): BreadcrumbItem[] {
  // Normalização da URL base para evitar barras duplas
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  
  // Extração dos segmentos ignorando o prefixo do idioma
  const segments = extractPathSegments(pathname, locale);
  const breadcrumbs: BreadcrumbItem[] = [];

  /**
   * 1️⃣ HOME (RAIZ DO IDIOMA)
   * Resolve o título da Home com fallbacks seguros para evitar 'undefined' no build.
   */
  const homeTitle = 
    dict.seo.pages?.['home']?.title ?? 
    dict.common?.nav?.about ?? 
    (locale.startsWith('es') ? 'Inicio' : 'Home');

  breadcrumbs.push({
    name: homeTitle,
    item: `${normalizedBaseUrl}/${locale}`,
  });

  /**
   * 2️⃣ PROCESSAMENTO DE SEGMENTOS ACUMULATIVOS
   */
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
 * Filtra o pathname para remover o locale e segmentos vazios.
 */
function extractPathSegments(pathname: string, locale: Locale): string[] {
  return pathname
    .split("/")
    .filter(Boolean)
    .filter((segment) => {
      // Remove o locale exato (ex: pt-BR) ou o prefixo (ex: pt)
      return segment !== locale && segment !== locale.split("-")[0];
    });
}

/**
 * RESOLUÇÃO DE LABEL (NOME AMIGÁVEL)
 * Prioridade: SEO Pages -> Common Nav -> Formatado (Slug to Title)
 */
function resolveLabel(segment: string, dict: Dictionary): string {
  const segmentLower = segment.toLowerCase();

  // 1. Verificação no SEO Pages (Chaves específicas de página)
  // TS 6.0: Verificamos a existência do objeto antes do acesso por índice
  const seoPage = dict.seo.pages?.[segmentLower];
  if (seoPage?.title) return seoPage.title;

  // 2. Verificação no Mapeamento de Navegação (common.nav)
  const nav = dict.common.nav;
  
  // Mapeamento direto de segmentos comuns para as chaves do dicionário
  const navMap: Record<string, string> = {
    'about': nav.about,
    'experience': nav.experience,
    'projects': nav.projects,
    'articles': nav.articles,
    'contact': nav.contact,
    // Traduções de slugs comuns para português/espanhol
    'sobre': nav.about,
    'experiencia': nav.experience,
    'proyectos': nav.projects,
    'artigos': nav.articles,
    'articulos': nav.articles,
    'contato': nav.contact,
    'contacto': nav.contact
  };

  if (navMap[segmentLower]) {
    return navMap[segmentLower];
  }

  // 3. Fallback: Formatação de Slug (ex: "ia-construcao" -> "Ia Construcao")
  // Node 24 utiliza regex otimizada para capitalização
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
