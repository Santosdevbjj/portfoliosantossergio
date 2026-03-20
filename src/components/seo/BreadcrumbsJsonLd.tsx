'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { generateBreadcrumbs } from '@/lib/seo/breadcrumbs';
import type { Locale, Dictionary } from '@/types/dictionary';

/**
 * BREADCRUMBS JSON-LD COMPONENT - PORTFÓLIO SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * ✔ Stack: React 19, TS 6.0, Next.js 16.2, Node 24
 * ✔ SEO: Schema.org BreadcrumbList estruturado para Google Search
 * ✔ I18n: Suporte total a pt-BR, en-US, es-ES, es-AR, es-MX
 */

interface BreadcrumbsJsonLdProps {
  readonly lang: Locale;
  readonly baseUrl: string;
  readonly dict: Dictionary;
}

/**
 * Injeta metadados estruturados para motores de busca.
 * Este componente é invisível e não afeta a responsividade do layout.
 */
export function BreadcrumbsJsonLd({ lang, baseUrl, dict }: BreadcrumbsJsonLdProps) {
  const pathname = usePathname();

  /**
   * MEMOIZAÇÃO DO SCHEMA:
   * Evita cálculos de stringify e processamento de array em re-renders.
   */
  const jsonLdString = useMemo(() => {
    if (!pathname) return null;

    // Normalização da URL base
    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');

    try {
      // Gera a lista de migalhas usando a lógica centralizada (já revisada para TS 6.0)
      const breadcrumbs = generateBreadcrumbs(pathname, lang, dict, cleanBaseUrl);

      // Estrutura oficial Schema.org BreadcrumbList
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'name': crumb.name,
          'item': crumb.item.startsWith('http') ? crumb.item : `${cleanBaseUrl}${crumb.item}`,
        })),
      };

      return JSON.stringify(schema);
    } catch (error) {
      console.error('[SEO Error]: Falha ao gerar JSON-LD Breadcrumbs', error);
      return null;
    }
  }, [pathname, lang, dict, baseUrl]);

  if (!jsonLdString) return null;

  return (
    <script
      type="application/ld+json"
      id={`json-ld-breadcrumbs-${lang}`}
      key={`json-ld-breadcrumbs-${pathname}-${lang}`}
      // React 19: dangerouslySetInnerHTML é tratado com prioridade em metadados
      dangerouslySetInnerHTML={{ __html: jsonLdString }}
    />
  );
}
