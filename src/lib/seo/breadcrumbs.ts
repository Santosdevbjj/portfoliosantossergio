// src/lib/seo/breadcrumbs.ts

import type { Dictionary, Locale } from '@/types/dictionary';

export interface BreadcrumbItem {
  name: string;
  item: string;
}

/**
 * Gera breadcrumbs semânticos e SEO-friendly.
 * Compatível com Next.js 16 + TypeScript 6
 */
export function generateBreadcrumbs(
  pathname: string,
  locale: Locale,
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
      name:
        dict.seo?.pages?.home?.title ||
        dict.common?.nav?.home ||
        'Home',
      item: `${normalizedBaseUrl}/${locale}`,
    },
  ];

  let currentPath = `${normalizedBaseUrl}/${locale}`;

  segments.forEach((segment) => {
    const decodedSegment = decodeURIComponent(segment);
    currentPath += `/${segment}`;

    const seoPages = dict.seo?.pages as Record<
      string,
      { title: string }
    > | undefined;

    const label =
      seoPages?.[decodedSegment]?.title ||
      (dict.common?.nav as Record<string, string> | undefined)?.[
        decodedSegment
      ] ||
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
