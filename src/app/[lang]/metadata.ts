// src/app/[lang]/metadata.ts
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/dictionaries';
import { isValidLocale, SUPPORTED_LOCALES } from '@/dictionaries/locales';
import type { Locale } from '@/types/dictionary';

const SITE_URL = 'https://portfoliosantossergio.vercel.app';

interface MetadataProps {
  params: Promise<{
    lang: string;
  }>;
}

/**
 * Gerador de Metadados robusto e tipado para TS 6.0 e Next.js 16
 * Totalmente alinhado com a estrutura física de arquivos em /public
 */
export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  // No Next.js 16, params DEVE ser aguardado (Promise)
  const { lang: rawLang } = await params;

  // Validação rigorosa do locale
  if (!isValidLocale(rawLang)) {
    notFound();
  }

  const lang: Locale = rawLang;
  const dict = await getDictionary(lang);

  // Extração segura do dicionário (conforme src/types/dictionary.ts)
  const pageTitle = dict.seo.pages.home.title || dict.seo.siteName;
  const pageDescription = dict.seo.pages.home.description || dict.seo.description;

  /**
   * MAPA DE IMAGENS OG (Open Graph)
   * Corrigido para bater EXATAMENTE com os arquivos físicos listados em /public
   */
  const ogImageMap: Record<Locale, string> = {
    'pt-BR': '/og-image-pt-BR.png',
    'en-US': '/og-image-en-US.png',
    'es-ES': '/og-image-es-ES.png',
    'es-AR': '/og-image-es-AR.png',
    'es-MX': '/og-image-es-MX.png',
  };

  /**
   * MAPA DE LOCALES ISO
   * Necessário para correta interpretação por crawlers (ex: pt_BR)
   */
  const ogLocaleMap: Record<Locale, string> = {
    'pt-BR': 'pt_BR',
    'en-US': 'en_US',
    'es-ES': 'es_ES',
    'es-AR': 'es_AR',
    'es-MX': 'es_MX',
  };

  // Caminho absoluto da imagem para SEO máximo
  const finalOgImage = `${SITE_URL}${ogImageMap[lang]}`;

  // Geração dinâmica de tags alternadas (Hreflang) para SEO internacional
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
