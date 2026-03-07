// src/app/[lang]/manifest.ts
import type { MetadataRoute } from 'next';
import { getDictionary } from '@/dictionaries';
import { normalizeLocale } from '@/dictionaries/locales';
import type { Locale } from '@/types/dictionary';

interface ManifestProps {
  params: Promise<{ lang: string }>;
}

/**
 * Gera o Manifesto do PWA dinâmico e localizado.
 * ✔ Compatível com Next.js 16 (params como Promise)
 * ✔ TypeScript 6.0 Safe (Resolução de tipos opcionais)
 * ✔ Suporte a 5 Locales (PT-BR, EN-US, ES-ES, ES-AR, ES-MX)
 */
export default async function manifest(
  { params }: ManifestProps
): Promise<MetadataRoute.Manifest> {
  
  const { lang: rawLang } = await params;
  
  // Normalização para garantir o uso de um dos locales suportados
  const lang = normalizeLocale(rawLang) as Locale;
  const dict = await getDictionary(lang);

  // Solução para o erro de Type: 'dict.seo.pages.home' is possibly 'undefined'
  // Forçamos o reconhecimento da página home ou usamos o título geral como fallback
  const homeTitle = dict.seo.pages?.home?.title || dict.seo.siteName;

  // Background e Theme alinhados com o design Slate-950 do portfólio
  const themeColor = '#020617';

  return {
    id: `portfolio-sergio-${lang}`,
    lang: lang,
    dir: 'ltr',
    name: dict.seo.siteName,
    short_name: "Sérgio Santos",
    description: dict.seo.description,
    start_url: `/${lang}/`,
    scope: `/${lang}/`,
    display: 'standalone',
    background_color: themeColor,
    theme_color: themeColor,
    orientation: 'portrait',
    categories: [
      'technology',
      'education',
      'portfolio',
      'software',
    ],
    icons: [
      {
        src: '/icons/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    screenshots: [
      {
        // Aponta para os arquivos físicos confirmados (ex: og-image-pt-BR.png)
        src: `/og-image-${lang}.png`,
        sizes: '1200x630',
        type: 'image/png',
        form_factor: 'wide',
        label: homeTitle,
      },
    ],
  };
}
