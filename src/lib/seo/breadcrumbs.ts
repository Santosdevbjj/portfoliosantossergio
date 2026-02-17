import type { Dictionary, Locale } from '@/types/dictionary';

export interface BreadcrumbItem {
  name: string;
  item: string;
}

/**
 * Gera breadcrumbs semânticos e SEO-friendly.
 * Alinhado com a estrutura multi-regional (pt-BR, en-US, es-ES, es-AR, es-MX).
 */
export function generateBreadcrumbs(
  pathname: string
  locale: Locale,
  dict: Dictionary,
  baseUrl: string
): BreadcrumbItem[] {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
  
  // Remove o locale da URL para processar os segmentos de página
  const segments = pathname
    .split('/')
    .filter(Boolean)
    .filter((seg) => seg !== locale);

  // O "Home" agora usa breadcrumb_root conforme seu labels.json
  const breadcrumbs: BreadcrumbItem[] = [
    {
      name: dict.labels?.breadcrumb_root || dict.labels?.home || 'Home',
      item: `${normalizedBaseUrl}/${locale}`,
    },
  ];

  let currentPath = `${normalizedBaseUrl}/${locale}`;

  segments.forEach((segment) => {
    const decodedSegment = decodeURIComponent(segment);
    currentPath += `/${segment}`;

    // Lógica de busca de Label:
    // 1. Procura na seção SEO do dicionário (ex: seo.pages.projects.title)
    // 2. Procura em labels genéricos
    // 3. Fallback: Formata o slug (ex: "meus-projetos" -> "Meus Projetos")
    const label = 
      dict.seo?.pages?.[decodedSegment as keyof typeof dict.seo.pages]?.title ||
      (dict.labels as any)?.[decodedSegment] ||
      decodedSegment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

    breadcrumbs.push({
      name: label,
      item: currentPath,
    });
  });

  return breadcrumbs;
}
