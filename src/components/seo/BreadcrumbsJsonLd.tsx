'use client';

/**
 * BREADCRUMBS JSON-LD COMPONENT
 * -----------------------------------------------------------------------------
 * ✔ Stack: React 19, TS 6.0, Next.js 16, Node 24
 * ✔ SEO: Schema.org BreadcrumbList (JSON-LD)
 * ✔ I18n: Integrado com dicionários PT/EN/ES
 */

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { generateBreadcrumbs } from '@/lib/seo/breadcrumbs';
import type { Locale, Dictionary } from '@/types/dictionary';

interface BreadcrumbsJsonLdProps {
  readonly lang: Locale;
  readonly baseUrl: string;
  readonly dict: Dictionary;
}

/**
 * Injeta metadados estruturados para motores de busca (Google, Bing).
 * Este componente não renderiza nada visualmente, apenas injeta o script no DOM.
 */
export function BreadcrumbsJsonLd({ lang, baseUrl, dict }: BreadcrumbsJsonLdProps) {
  const pathname = usePathname();

  const jsonLd = useMemo(() => {
    if (!pathname) return null;

    // Gera a lista de migalhas de pão baseada na rota atual e dicionário
    const breadcrumbs = generateBreadcrumbs(pathname, lang, dict, baseUrl);

    // Estrutura oficial Schema.org
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': crumb.name,
        'item': crumb.item.startsWith('http') ? crumb.item : `${baseUrl}${crumb.item}`,
      })),
    };
  }, [pathname, lang, dict, baseUrl]);

  if (!jsonLd) return null;

  return (
    <script
      type="application/ld+json"
      id={`json-ld-breadcrumbs-${lang}`}
      // React 19: Otimizado para hidratação segura
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
