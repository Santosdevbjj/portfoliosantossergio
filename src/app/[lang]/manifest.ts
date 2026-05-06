// src/app/[lang]/manifest.ts
import type { MetadataRoute } from 'next';
import { getDictionary } from '@/dictionaries';
import { normalizeLocale } from '@/dictionaries/locales';
import type { Locale } from '@/types/dictionary';

interface ManifestProps {
  params: Promise<{ lang: string }>;
}

export default async function manifest({ params }: ManifestProps): Promise<MetadataRoute.Manifest> {
  const { lang: rawLang } = await params;
  const lang = normalizeLocale(rawLang) as Locale;
  const dict = await getDictionary(lang);

  const themeColor = '#020617'; // Slate-950

  return {
    id: `sergio-santos-pwa-${lang}`,
    lang: lang,
    name: dict.seo.siteName,
    short_name: "Sérgio Santos",
    description: dict.seo.description,
    start_url: `/${lang}`,
    scope: `/${lang}`,
    display: 'standalone',
    background_color: themeColor,
    theme_color: themeColor,
    icons: [
      {
        src: '/icons/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    screenshots: [
      {
        src: `/og/og-image-${lang}.png`,
        sizes: '1200x630',
        type: 'image/png',
        form_factor: 'wide',
      },
      {
        src: `/og/og-image-${lang}.png`,
        sizes: '1200x630',
        type: 'image/png',
        form_factor: 'narrow',
      }
    ],
  };
}
