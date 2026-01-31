'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { generateBreadcrumbs } from '@/lib/seo/breadcrumbs';
import { getDictionarySync, type SupportedLocale } from '@/dictionaries';

interface BreadcrumbsJsonLdProps {
  lang: SupportedLocale;
  baseUrl: string;
}

export function BreadcrumbsJsonLd({ lang, baseUrl }: BreadcrumbsJsonLdProps) {
  const pathname = usePathname();
  const dict = getDictionarySync(lang);

  useEffect(() => {
    if (!pathname) return;

    const breadcrumbs = generateBreadcrumbs(
      pathname,
      lang,
      dict,
      baseUrl
    );

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.item,
      })),
    };

    const scriptId = 'breadcrumbs-jsonld';
    const existing = document.getElementById(scriptId);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
  }, [pathname, lang, dict, baseUrl]);

  return null;
}
