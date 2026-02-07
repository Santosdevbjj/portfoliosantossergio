'use client';

import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { generateBreadcrumbs } from '@/lib/seo/breadcrumbs';
import { getDictionary } from '@/dictionaries'; // Usando a função exportada correta
import type { Locale } from '@/types/dictionary';

interface BreadcrumbsJsonLdProps {
  lang: Locale;
  baseUrl: string;
}

export function BreadcrumbsJsonLd({
  lang,
  baseUrl,
}: BreadcrumbsJsonLdProps) {
  const pathname = usePathname();

  const normalizedBaseUrl = useMemo(
    () => baseUrl.replace(/\/+$/, ''),
    [baseUrl]
  );

  // Obtém o dicionário de forma segura
  const dict = useMemo(() => getDictionary(lang), [lang]);

  const breadcrumbs = useMemo(() => {
    if (!pathname) return [];
    return generateBreadcrumbs(pathname, lang, dict, normalizedBaseUrl);
  }, [pathname, lang, dict, normalizedBaseUrl]);

  useEffect(() => {
    if (!breadcrumbs.length) return;

    const scriptId = 'breadcrumbs-jsonld';
    
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

      // Limpeza eficiente
      const existingScript = document.getElementById(scriptId);
      if (existingScript) existingScript.remove();

      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);

    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[BreadcrumbsJsonLd Error]:', error);
      }
    }

    // Cleanup ao desmontar o componente
    return () => {
      const script = document.getElementById(scriptId);
      if (script) script.remove();
    };
  }, [breadcrumbs]);

  return null;
}
