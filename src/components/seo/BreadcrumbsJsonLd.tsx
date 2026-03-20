'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import type { Locale, Dictionary } from '@/types/dictionary';

/**
 * BREADCRUMBS JSON-LD COMPONENT - PORTFÓLIO SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * ✔ Stack: React 19, TS 6.0, Next.js 16.2 (Turbopack), Node 24
 * ✔ Fix: Erro de tipo 'home' inexistente no CommonDictionary
 * ✔ I18n: Suporte total a pt-BR, en-US, es-ES, es-AR, es-MX
 */

interface BreadcrumbsJsonLdProps {
  readonly lang: Locale;
  readonly baseUrl: string;
  readonly dict: Dictionary;
}

export function BreadcrumbsJsonLd({ lang, baseUrl, dict }: BreadcrumbsJsonLdProps) {
  const pathname = usePathname();

  const jsonLdString = useMemo(() => {
    if (!pathname) return null;

    // 1. Limpeza da URL Base
    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
    
    // 2. Quebra do caminho em segmentos
    const segments = pathname.split('/').filter(Boolean);
    
    // Se o primeiro segmento for o idioma (ex: pt-BR), removemos para processar o restante
    if (segments[0] === lang) {
      segments.shift();
    }

    // 3. Inicialização com a Home (Item 1)
    // CORREÇÃO: Usando dict.seo.siteName ou fallback fixo para evitar erro de TS
    const breadcrumbList = [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': dict.seo.siteName || (lang.startsWith('pt') ? 'Início' : 'Home'),
        'item': `${cleanBaseUrl}/${lang}`,
      },
    ];

    // 4. Lógica Dinâmica para Segmentos
    let currentPath = `/${lang}`;
    
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      let translatedName = segment;

      // Mapeamento baseado nas chaves existentes no seu CommonDictionary.nav
      if (segment === 'artigos') translatedName = dict.common.nav.articles;
      if (segment === 'projects' || segment === 'projetos') translatedName = dict.common.nav.projects;
      if (segment === 'experience') translatedName = dict.common.nav.experience;
      if (segment === 'about') translatedName = dict.common.nav.about;
      if (segment === 'contact') translatedName = dict.common.nav.contact;
      if (segment === 'resume') translatedName = dict.resume.selectLanguage;
      
      // Formatação para slugs de artigos
      if (index > 0 && segments[index - 1] === 'artigos') {
        translatedName = segment
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());
      }

      breadcrumbList.push({
        '@type': 'ListItem',
        'position': index + 2,
        'name': translatedName,
        'item': `${cleanBaseUrl}${currentPath}`,
      });
    });

    try {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': breadcrumbList,
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
      dangerouslySetInnerHTML={{ __html: jsonLdString }}
    />
  );
}
