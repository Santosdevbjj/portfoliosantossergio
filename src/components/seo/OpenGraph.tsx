'use client';

/**
 * OPEN GRAPH & SOCIAL METADATA COMPONENT - SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * ✔ Stack: Next.js 16.2.0, React 19 (Hoisting), TS 6.0, Node 24
 * ✔ SEO: OpenGraph (Facebook/LinkedIn) & Twitter Cards dinâmicos
 * ✔ I18n: Mapeamento inteligente para pt-BR, en-US, es-ES, es-AR, es-MX
 * ✔ Assets: Vinculação automática com /public/og/ e /public/icons/
 */

import { useMemo } from 'react';
import type { Locale } from '@/types/dictionary';

interface OpenGraphProps {
  readonly title: string;
  readonly description: string;
  readonly url: string;
  readonly locale: Locale;
  readonly type?: 'website' | 'article' | 'profile';
  readonly twitterHandle?: string;
  readonly overrideImage?: string; // Para casos específicos onde não queira a padrão do idioma
}

export default function OpenGraph({
  title,
  description,
  url,
  locale,
  type = 'website',
  twitterHandle = '@santossergioluiz',
  overrideImage,
}: OpenGraphProps) {
  
  /**
   * RESOLUÇÃO DINÂMICA DE ASSETS BASEADA NO IDIOMA:
   * Garante que o card do LinkedIn/WhatsApp exiba a imagem no idioma correto.
   */
  const assets = useMemo(() => {
    // Normaliza o locale para o padrão OpenGraph (ex: pt_BR)
    const ogLocale = locale.replace('-', '_');
    
    // Define a imagem baseada na estrutura de pastas informada
    const dynamicOgImage = overrideImage || `/og/og-image-${locale}.png`;

    return {
      ogLocale,
      ogImage: dynamicOgImage,
      favicon: '/icons/favicon.ico',
      appleTouch: '/icons/apple-touch-icon.png'
    };
  }, [locale, overrideImage]);

  return (
    <>
      {/* METADADOS PRIMÁRIOS */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* OPEN GRAPH (LinkedIn, Facebook, WhatsApp) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Sérgio Santos | Portfólio" />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={assets.ogLocale} />
      <meta property="og:image" content={assets.ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={`Preview do Portfólio de Sérgio Santos - ${locale}`} />

      {/* TWITTER CARDS */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={assets.ogImage} />

      {/* ICONS & FAVICONS (Injeção via React 19 Hoisting) */}
      <link rel="icon" href={assets.favicon} sizes="any" />
      <link rel="apple-touch-icon" href={assets.appleTouch} />
      <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
    </>
  );
}
