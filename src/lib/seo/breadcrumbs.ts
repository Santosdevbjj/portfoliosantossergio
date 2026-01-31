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

    // Tipamos as chaves para o TS parar de reclamar
    const navKey = segment as keyof typeof dict.nav;
    const pagesKey = segment as keyof NonNullable<typeof dict.seo.pages>;

    const label =
      dict.nav?.[navKey] ||
      (dict.seo.pages as any)?.[segment]?.title || // Fallback usando any para o index signature
      segment.charAt(0).toUpperCase() + segment.slice(1);

    breadcrumbs.push({
      name: label,
      item: currentPath,
    });
  });

  return breadcrumbs;
}
