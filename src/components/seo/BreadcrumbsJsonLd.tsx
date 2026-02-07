'use client';

import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { generateBreadcrumbs } from '@/lib/seo/breadcrumbs';
import { getDictionary } from '@/dictionaries';
import type { Locale } from '@/types/dictionary';

interface BreadcrumbsJsonLdProps {
  lang: Locale;
  baseUrl: string;
}

/**
 * Injeta Schema.org JSON-LD para Breadcrumbs.
 * Crucial para que o Google exiba a estrutura de pastas nos resultados de busca.
 */
export function BreadcrumbsJsonLd({
  lang,
  baseUrl,
}: BreadcrumbsJsonLdProps) {
  const pathname = usePathname();

  const normalizedBaseUrl = useMemo(
    () => baseUrl.replace(/\/+$/, ''),
    [baseUrl]
  );

  // Obtém o dicionário (já validado pelo getDictionary)
  const dict = useMemo(() => getDictionary(lang), [lang]);

  const breadcrumbs = useMemo(() => {
    if (!pathname) return [];
    return generateBreadcrumbs(pathname, lang, dict, normalizedBaseUrl);
  }, [pathname, lang, dict, normalizedBaseUrl]);

  useEffect(() => {
    if (!breadcrumbs.length) return;

    const scriptId = `breadcrumbs-jsonld-${lang}`;
    
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

      // Gerenciamento do Script no DOM
      let script = document.getElementById(scriptId) as HTMLScriptElement;
      
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      
      script.textContent = JSON.stringify(jsonLd);

    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[BreadcrumbsJsonLd Error]:', error);
      }
    }

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) existingScript.remove();
    };
  }, [breadcrumbs, lang]);

  return null;
}
