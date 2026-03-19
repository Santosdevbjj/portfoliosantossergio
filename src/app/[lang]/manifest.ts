// src/app/[lang]/manifest.ts
import type { MetadataRoute } from 'next';
import { getDictionary } from '@/dictionaries';
import { normalizeLocale } from '@/dictionaries/locales';
import type { Locale } from '@/types/dictionary';

interface ManifestProps {
  params: Promise<{ lang: string }>;
}

/**
 * Geração de Manifesto PWA - Next.js 16.2.0 (Turbopack)
 * -----------------------------------------------------------------------------
 * ✔ TypeScript 6.0 Safe: Acesso via Index Signature ['home']
 * ✔ React 19: Params como Promise (await params)
 * ✔ Multilingue: PT-BR, EN-US, ES-ES, ES-AR, ES-MX
 * ✔ Responsividade: Screenshots configurados para Mobile e Desktop
 */
export default async function manifest(
  { params }: ManifestProps
): Promise<MetadataRoute.Manifest> {
  
  // No Next.js 16.2, params deve ser aguardado
  const { lang: rawLang } = await params;
  
  // Normalização rigorosa do locale
  const lang = normalizeLocale(rawLang) as Locale;
  const dict = await getDictionary(lang);

  /**
   * FIX TYPE ERROR: 
   * Como dict.seo.pages vem de um JSON dinâmico (Index Signature), 
   * o TS 6.0 exige o acesso via ['home'].
   */
  const homePage = dict.seo.pages?.['home'];
  const homeTitle = homePage?.title || dict.seo.siteName;

  // Cor do tema Slate-950 (Tailwind 4.2 default dark)
  const themeColor = '#020617';

  return {
    id: `sergio-santos-pwa-${lang}`,
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
      'data-science'
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
        /**
         * CORREÇÃO DE CAMINHO: 
         * Aponta para public/og/og-image-[lang].png conforme sua estrutura
         */
        src: `/og/og-image-${lang}.png`,
        sizes: '1200x630',
        type: 'image/png',
        form_factor: 'wide',
        label: `${homeTitle} - Desktop`,
      },
      {
        // Screenshot mobile para PWA responsivo
        src: `/og/og-image-${lang}.png`,
        sizes: '1200x630',
        type: 'image/png',
        form_factor: 'narrow',
        label: `${homeTitle} - Mobile`,
      }
    ],
  };
}
