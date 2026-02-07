import type { Dictionary, Locale } from '@/types/dictionary';

export interface BreadcrumbItem {
  name: string;
  item: string;
}

/**
 * Gera breadcrumbs semânticos e SEO-friendly
 * Corrigido para alinhar com a estrutura do dicionário fornecida
 */
export function generateBreadcrumbs(
  pathname: string,
  locale: Locale,
  dict: Dictionary,
  baseUrl: string
): BreadcrumbItem[] {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
  
  // Remove o locale do início do path para processar os segmentos
  const segments = pathname
    .split('/')
    .filter(Boolean)
    .filter((seg) => seg !== locale);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      name: dict.labels?.home || 'Home',
      item: `${normalizedBaseUrl}/${locale}`,
    },
  ];

  let currentPath = `${normalizedBaseUrl}/${locale}`;

  segments.forEach((segment) => {
    const decodedSegment = decodeURIComponent(segment);
    currentPath += `/${segment}`;

    // Tenta buscar o nome traduzido na seção seo.pages do dicionário
    // Se não encontrar, tenta labels, se não, formata o slug
    const label = 
      dict.seo.pages?.[decodedSegment as keyof typeof dict.seo.pages]?.title ||
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
