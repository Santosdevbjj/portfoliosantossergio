'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { generateBreadcrumbs } from '@/lib/seo/breadcrumbs';
import type { Locale, Dictionary } from '@/types/dictionary';

interface BreadcrumbsJsonLdProps {
  lang: Locale;
  baseUrl: string;
  dict: Dictionary;
}

/**
 * Injeta Schema.org JSON-LD para SEO
 * ✔ Evita conteúdo duplicado com ID único
 * ✔ Atualiza automaticamente na mudança de rota
 */
export function BreadcrumbsJsonLd({ lang, baseUrl, dict }: BreadcrumbsJsonLdProps) {
  const pathname = usePathname();

  const jsonLd = useMemo(() => {
    if (!pathname) return null;

    const breadcrumbs = generateBreadcrumbs(pathname, lang, dict, baseUrl);

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': crumb.name,
        'item': crumb.item,
      })),
    };
  }, [pathname, lang, dict, baseUrl]);

  if (!jsonLd) return null;

  return (
    <script
      type="application/ld-json"
      id={`json-ld-breadcrumbs-${lang}`}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
