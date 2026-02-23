// src/app/[lang]/manifest.ts
import type { MetadataRoute } from 'next';
import { getDictionary } from '@/dictionaries';
import { normalizeLocale } from '@/dictionaries/locales';
import type { Locale } from '@/types/dictionary';

interface ManifestProps {
  params: Promise<{ lang: string }>;
}

export default async function manifest(
  { params }: ManifestProps
): Promise<MetadataRoute.Manifest> {
  
  const { lang: rawLang } = await params;
  
  // Normalização segura para garantir que o manifesto nunca quebre
  const lang = normalizeLocale(rawLang) as Locale;
  const dict = await getDictionary(lang);

  // Extração do prefixo para imagem (pt, en, es)
  const langPrefix = lang.split('-')[0];

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
    background_color: '#020617',
    theme_color: '#020617',
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
        src: `/og-image-${langPrefix}.png`,
        sizes: '1200x630',
        type: 'image/png',
        form_factor: 'wide',
        label: dict.seo.pages.home.title,
      },
    ],
  };
}
