'use client';

import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';

import { generateBreadcrumbs } from '@/lib/seo/breadcrumbs';
import type { Locale, Dictionary } from '@/types/dictionary';

interface BreadcrumbsJsonLdProps {
  lang: Locale;
  baseUrl: string;
  dict: Dictionary; // ✅ agora vem pronto do Server Component
}

export function BreadcrumbsJsonLd({
  lang,
  baseUrl,
  dict,
}: BreadcrumbsJsonLdProps) {
  const pathname = usePathname();

  const normalizedBaseUrl = useMemo(
    () => baseUrl.replace(/\/+$/, ''),
    [baseUrl]
  );

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

    const scriptId = `breadcrumbs-jsonld-${lang}`;

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

    let script = document.getElementById(
      scriptId
    ) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(jsonLd);

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    };
  }, [breadcrumbs, lang]);

  return null;
}
