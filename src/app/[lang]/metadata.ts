// src/app/[lang]/metadata.ts
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/dictionaries';
import { isValidLocale, SUPPORTED_LOCALES } from '@/dictionaries/locales';
import type { Locale } from '@/types/dictionary';

const SITE_URL = 'https://portfoliosantossergio.vercel.app';

interface MetadataProps {
  params: Promise<{
    lang: string; // Tipado como string inicialmente para validação
  }>;
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { lang: rawLang } = await params;

  // Validação rigorosa do locale
  if (!isValidLocale(rawLang)) {
    notFound();
  }

  const lang = rawLang as Locale;
  const dict = await getDictionary(lang);

  const pageTitle = dict.seo.pages?.home?.title ?? dict.seo.siteName;
  const pageDescription = dict.seo.pages?.home?.description ?? dict.seo.description;

  // Mapeamento de imagens OG (Baseado nos seus arquivos na pasta public/)
  const ogImageMap: Record<string, string> = {
    'pt-BR': '/og-image-pt.png',
    'en-US': '/og-image-en.png',
    'es-ES': '/og-image-es.png',
    'es-AR': '/og-image-es.png',
    'es-MX': '/og-image-es.png',
  };

  // Mapeamento de locale para meta tags (padrão ISO: ll_CC)
  const ogLocaleMap: Record<Locale, string> = {
    'pt-BR': 'pt_BR',
    'en-US': 'en_US',
    'es-ES': 'es_ES',
    'es-AR': 'es_AR',
    'es-MX': 'es_MX',
  };

  // Construção dos links alternativos (SEO Multilíngue)
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
          url: ogImageMap[lang] || ogImageMap['pt-BR'],
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
      images: [ogImageMap[lang] || ogImageMap['pt-BR']],
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
