// src/app/[lang]/manifest.ts
import type { MetadataRoute } from 'next';
import { getDictionary } from '@/dictionaries';
// CORREÇÃO: Usando 'import type' para satisfazer o verbatimModuleSyntax
import type { Locale } from '@/types/dictionary';

const SITE_URL = 'https://portfoliosantossergio.vercel.app';

export default async function manifest(
  props: { params: Promise<{ lang: Locale }> }
): Promise<MetadataRoute.Manifest> {
  
  // Resolve os parâmetros (Next.js 16 padrão)
  const { lang: rawLang } = await props.params;
  
  // Lista de locales suportados conforme seu arquivo de tipos
  const supportedLocales: Locale[] = ['pt-BR', 'en-US', 'es-ES', 'es-AR', 'es-MX'];
  
  const lang = supportedLocales.includes(rawLang) 
    ? rawLang 
    : 'pt-BR'; // Fallback seguro

  const dict = await getDictionary(lang);

  return {
    id: `${SITE_URL}/${lang}`,
    lang,
    dir: 'ltr',
    name: dict.seo.siteName,
    short_name: dict.seo.siteName.split(' | ')[0],
    description: dict.seo.description,
    start_url: `/${lang}/`,
    scope: `/${lang}/`,
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#020617',
    categories: [
      'technology',
      'education',
      'portfolio',
      'software',
      'productivity',
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
        src: `/og-image-${lang.split('-')[0]}.png`, // Pega 'pt', 'en' ou 'es'
        sizes: '1200x630',
        type: 'image/png',
        form_factor: 'wide',
        label: dict.seo.siteName,
      },
    ],
  };
}
