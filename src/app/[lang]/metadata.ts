// src/app/[lang]/metadata.ts
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/dictionaries';
import { isValidLocale, SUPPORTED_LOCALES } from '@/dictionaries/locales';
import type { Locale } from '@/types/dictionary';

// URL Base limpa para evitar barras duplas
const SITE_URL = 'https://portfoliosantossergio.vercel.app';

interface MetadataProps {
  params: Promise<{
    lang: string;
  }>;
}

/**
 * Gerador de Metadados - Sérgio Santos Portfolio
 * ✔ Suporte a Next.js 16 (params as Promise)
 * ✔ Estrutura de pastas /og/ para evitar conflitos de cache
 * ✔ URLs absolutas para validação em LinkedIn e Facebook
 */
export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { lang: rawLang } = await params;

  if (!isValidLocale(rawLang)) {
    notFound();
  }

  const lang: Locale = rawLang;
  const dict = await getDictionary(lang);

  // Extração segura de Título e Descrição do Dicionário
  const pageTitle = dict.seo.pages?.home?.title ?? dict.seo.siteName;
  const pageDescription = dict.seo.pages?.home?.description ?? dict.seo.description;

  /**
   * MAPA DE IMAGENS OG (Open Graph)
   * Apontando para a nova pasta /public/og/
   */
  const ogImageMap: Record<Locale, string> = {
    'pt-BR': 'og/og-image-pt-BR.png',
    'en-US': 'og/og-image-en-US.png',
    'es-ES': 'og/og-image-es-ES.png',
    'es-AR': 'og/og-image-es-AR.png',
    'es-MX': 'og/og-image-es-MX.png',
  };

  const ogLocaleMap: Record<Locale, string> = {
    'pt-BR': 'pt_BR',
    'en-US': 'en_US',
    'es-ES': 'es_ES',
    'es-AR': 'es_AR',
    'es-MX': 'es_MX',
  };

  // URL Absoluta da Imagem (Ex: https://.../og/og-image-pt-BR.png)
  const finalOgImage = `${SITE_URL}/${ogImageMap[lang]}`;
  
  // Hreflang para SEO Internacional
  const languages = SUPPORTED_LOCALES.reduce((acc, loc) => {
    acc[loc] = `${SITE_URL}/${loc}`;
    return acc;
  }, {} as Record<string, string>);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: pageTitle,
      template: `%s | ${dict.seo.siteName}`,
    },
    description: pageDescription,
    keywords: dict.seo.keywords,
    alternates: {
      canonical: `${SITE_URL}/${lang}`,
      languages: {
        ...languages,
        'x-default': `${SITE_URL}/pt-BR`,
      },
    },
    openGraph: {
      type: 'website',
      locale: ogLocaleMap[lang],
      url: `${SITE_URL}/${lang}`,
      siteName: dict.seo.siteName,
      title: pageTitle,
      description: pageDescription,
      images: [
        {
          url: finalOgImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [finalOgImage], // Twitter agora usa a mesma imagem absoluta da pasta /og/
    },
    icons: {
      icon: [
        { url: '/icons/favicon.ico', sizes: 'any' },
        { url: '/icons/icon.png', type: 'image/png', sizes: '32x32' },
        { url: '/icons/icon.svg', type: 'image/svg+xml' },
      ],
      apple: [
        { url: '/icons/apple-touch-icon.png', sizes: '180x180' },
        { url: '/icons/apple-icon.png', sizes: '180x180' },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
