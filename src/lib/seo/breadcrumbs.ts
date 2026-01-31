import type { Dictionary } from '@/types/dictionary';
import type { SupportedLocale } from '@/dictionaries';

export interface BreadcrumbItem {
  name: string;
  item: string;
}

export function generateBreadcrumbs(
  pathname: string,
  locale: SupportedLocale,
  dict: Dictionary,
  baseUrl: string
): BreadcrumbItem[] {
  const segments = pathname
    .split('/')
    .filter(Boolean)
    .filter((seg) => seg !== locale);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      name: dict.seo.siteName,
      item: `${baseUrl}/${locale}`,
    },
  ];

  let currentPath = `${baseUrl}/${locale}`;

  segments.forEach((segment) => {
    currentPath += `/${segment}`;

    // Tentamos buscar no nav, depois no seo.pages, e por fim usamos o próprio nome do segmento
    const label =
      (dict.nav as any)[segment] ||
      (dict.seo.pages as any)?.[segment]?.title ||
      segment.charAt(0).toUpperCase() + segment.slice(1);

    breadcrumbs.push({
      name: label,
      item: currentPath,
    });
  });

  return breadcrumbs;
}
