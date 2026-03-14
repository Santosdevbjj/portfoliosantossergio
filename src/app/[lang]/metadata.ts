// src/app/[lang]/metadata.ts
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/dictionaries';
import { isValidLocale, SUPPORTED_LOCALES } from '@/dictionaries/locales';
import type { Locale } from '@/types/dictionary';

// Definimos a URL base sem a barra final para evitar duplicação
const SITE_URL = 'https://portfoliosantossergio.vercel.app';

interface MetadataProps {
  params: Promise<{
    lang: string;
  }>;
}

/**
 * Gerador de Metadados robusto e tipado para Next.js 16
 * ✔ Correção de URL malformada (barra dupla)
 * ✔ URLs absolutas para Scrapers de Redes Sociais
 */
export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { lang: rawLang } = await params;

  if (!isValidLocale(rawLang)) {
    notFound();
  }

  const lang: Locale = rawLang;
  const dict = await getDictionary(lang);

  // Título e Descrição (Priorizando o conteúdo SEO do dicionário)
  const pageTitle = dict.seo.pages?.home?.title ?? dict.seo.siteName;
  const pageDescription = dict.seo.pages?.home?.description ?? dict.seo.description;

  /**
   * MAPA DE IMAGENS OG (Open Graph)
   * Nota: Removi a barra inicial dos valores para garantir a concatenação limpa
   */
  const ogImageMap: Record<Locale, string> = {
    'pt-BR': 'og-image-pt-BR.png',
    'en-US': 'og-image-en-US.png',
    'es-ES': 'og-image-es-ES.png',
    'es-AR': 'og-image-es-AR.png',
    'es-MX': 'og-image-es-MX.png',
  };

  const ogLocaleMap: Record<Locale, string> = {
    'pt-BR': 'pt_BR',
    'en-US': 'en_US',
    'es-ES': 'es_ES',
    'es-AR': 'es_AR',
    'es-MX': 'es_MX',
  };

  // Montagem da URL Absoluta Garantida (sem barra dupla)
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
          url: finalOgImage, // URL Limpa: https://portfoliosantossergio.vercel.app/og-image-pt-BR.png
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
      images: [finalOgImage],
    },
    icons: {
      icon: [
        { url: '/icons/favicon.ico', sizes: 'any' },
        { url: '/icons/icon.png', type: 'image/png', sizes: '32x32' },
        { url: '/icons/icon.svg', type: 'image/svg+xml' },
      ],
      apple: [
        { url: '/icons/apple-touch-icon.png', sizes: '180x180' },
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
