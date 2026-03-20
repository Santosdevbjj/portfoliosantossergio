'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import type { Locale, Dictionary } from '@/types/dictionary';

/**
 * BREADCRUMBS JSON-LD COMPONENT - PORTFÓLIO SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * ✔ Stack: React 19, TS 6.0, Next.js 16.2 (Turbopack), Node 24
 * ✔ Fix: Erro Crítico "Item sem nome" do Google Search Console
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
    
    // 2. Quebra do caminho em segmentos (removendo vazios e o prefixo do idioma)
    const segments = pathname.split('/').filter(Boolean);
    
    // Se o primeiro segmento for o idioma (ex: pt-BR), removemos para processar o restante
    if (segments[0] === lang) {
      segments.shift();
    }

    // 3. Inicialização da lista de Breadcrumbs com a Home (Item 1)
    // CORREÇÃO CRÍTICA: Definindo explicitamente o "name" para o Google
    const breadcrumbList = [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': dict.common.nav.home || (lang.startsWith('pt') ? 'Início' : 'Home'),
        'item': `${cleanBaseUrl}/${lang}`,
      },
    ];

    // 4. Lógica Dinâmica para Segmentos (Artigos, Projetos, etc.)
    let currentPath = `/${lang}`;
    
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Mapeamento de nomes baseado no dicionário
      let translatedName = segment;

      if (segment === 'artigos') translatedName = dict.common.nav.articles;
      if (segment === 'projects' || segment === 'projetos') translatedName = dict.common.nav.projects;
      if (segment === 'resume') translatedName = dict.resume.selectLanguage;
      
      // Se for um slug de artigo (ex: /artigos/meu-artigo), tentamos formatar o nome
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
