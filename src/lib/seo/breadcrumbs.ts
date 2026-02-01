import type { Dictionary } from '@/types/dictionary';
import type { SupportedLocale } from '@/dictionaries';

export interface BreadcrumbItem {
  name: string;
  item: string;
}

/**
 * Gera breadcrumbs semânticos e SEO-friendly
 * Compatível com JSON-LD (Schema.org)
 */
export function generateBreadcrumbs(
  pathname: string,
  locale: SupportedLocale,
  dict: Dictionary,
  baseUrl: string
): BreadcrumbItem[] {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');

  const segments = pathname
    .split('/')
    .filter(Boolean)
    .filter((seg) => seg !== locale);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      name: dict.seo.siteName,
      item: `${normalizedBaseUrl}/${locale}`,
    },
  ];

  let currentPath = `${normalizedBaseUrl}/${locale}`;

  segments.forEach((rawSegment) => {
    const segment = decodeURIComponent(rawSegment);
    currentPath += `/${segment}`;

    const label =
      (dict.nav as Record<string, string>)?.[segment] ||
      (dict.seo.pages as Record<string, { title?: string }>)?.[segment]
        ?.title ||
      segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

    breadcrumbs.push({
      name: label,
      item: currentPath,
    });
  });

  return breadcrumbs;
}
