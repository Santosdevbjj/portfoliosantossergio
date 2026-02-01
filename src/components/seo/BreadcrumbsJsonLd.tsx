'use client';

import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';

import { generateBreadcrumbs } from '@/lib/seo/breadcrumbs';
import { getDictionarySync, type SupportedLocale } from '@/dictionaries';

interface BreadcrumbsJsonLdProps {
  lang: SupportedLocale;
  baseUrl: string;
}

export function BreadcrumbsJsonLd({
  lang,
  baseUrl,
}: BreadcrumbsJsonLdProps) {
  const pathname = usePathname();

  /**
   * Normaliza a baseUrl para evitar "//" ou inconsistências
   */
  const normalizedBaseUrl = useMemo(
    () => baseUrl.replace(/\/+$/, ''),
    [baseUrl]
  );

  /**
   * Dicionário sincronizado com o idioma atual
   * (não deve ser dependência direta do useEffect)
   */
  const dict = useMemo(
    () => getDictionarySync(lang),
    [lang]
  );

  /**
   * Geração determinística dos breadcrumbs
   */
  const breadcrumbs = useMemo(() => {
    if (!pathname) return [];

    return generateBreadcrumbs(
      pathname,
      lang,
      dict,
      normalizedBaseUrl
    );
  }, [pathname, lang, dict, normalizedBaseUrl]);

  useEffect(() => {
    if (!breadcrumbs.length) return;

    try {
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
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(jsonLd);

      document.head.appendChild(script);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[BreadcrumbsJsonLd]', error);
      }
    }
  }, [breadcrumbs]);

  return null;
}
