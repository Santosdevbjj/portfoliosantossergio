// src/app/[lang]/metadata.ts
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/dictionaries';
import { isValidLocale, SUPPORTED_LOCALES } from '@/dictionaries/locales';
import type { Locale } from '@/types/dictionary';

// SITE_URL dinâmico via variável de ambiente ou fallback seguro
const SITE_URL = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://portfoliosantossergio.vercel.app';

interface MetadataProps {
  params: Promise<{
    lang: string;
  }>;
}

/**
 * Geração de Metadados Dinâmicos - Next.js 16.2.0 (Turbopack Ready)
 * -----------------------------------------------------------------------------
 * ✔ TypeScript 6.0 Safe: Acesso via Index Signature ['home']
 * ✔ React 19: Params como Promise
 * ✔ Multilingue: Suporte a 5 locales e imagens OG localizadas na pasta /og/
 */
export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { lang: rawLang } = await params;

  if (!isValidLocale(rawLang)) {
    notFound();
  }

  const lang = rawLang as Locale;
  const dict = await getDictionary(lang);

  /**
   * FIX TYPE ERROR: 
   * Como dict.seo.pages é um objeto dinâmico, o TS 6.0 exige o acesso via ['home'].
   */
  const homePage = dict.seo.pages?.['home'];
  const pageTitle = homePage?.title ?? dict.seo.siteName;
  const pageDescription = homePage?.description ?? dict.seo.description;

  // Mapa de imagens na pasta /og/ conforme sua estrutura física
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

  const finalOgImage = `${SITE_URL}/${ogImageMap[lang]}`;
  
  // Mapeamento de links alternativos para SEO multilingue
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
