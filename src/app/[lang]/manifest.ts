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
 * ✔ Compatível com TypeScript 6.0 (Strict null checks & Template Literals)
 */
export default async function manifest(
  { params }: ManifestProps
): Promise<MetadataRoute.Manifest> {
  
  const { lang: rawLang } = await params;
  
  // Normalização para garantir que usemos um dos 5 locales suportados
  const lang = normalizeLocale(rawLang) as Locale;
  const dict = await getDictionary(lang);

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
        // Corrigido: Agora aponta exatamente para os arquivos físicos informados (ex: og-image-pt-BR.png)
        src: `/og-image-${lang}.png`,
        sizes: '1200x630',
        type: 'image/png',
        form_factor: 'wide',
        label: dict.seo.pages.home.title,
      },
    ],
  };
}
