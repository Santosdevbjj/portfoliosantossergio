// src/app/[lang]/metadata.ts
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  getDictionarySync,
  type SupportedLocale,
} from '@/dictionaries';

const SITE_URL = 'https://portfoliosantossergio.vercel.app';

interface MetadataProps {
  params: {
    lang: SupportedLocale;
  };
}

export function generateMetadata(
  { params }: MetadataProps
): Metadata {
  const supportedLocales: SupportedLocale[] = ['pt', 'en', 'es'];
  const lang = supportedLocales.includes(params.lang)
    ? params.lang
    : null;

  if (!lang) {
    notFound();
  }

  const dict = getDictionarySync(lang);

  const pageTitle =
    dict.seo.pages?.home?.title ?? dict.seo.siteName;

  const pageDescription =
    dict.seo.pages?.home?.description ?? dict.seo.description;

  const ogImageMap: Record<SupportedLocale, string> = {
    pt: '/og-image-pt.png',
    en: '/og-image-en.png',
    es: '/og-image-es.png',
  };

  const ogLocaleMap: Record<SupportedLocale, string> = {
    pt: 'pt_BR',
    en: 'en_US',
    es: 'es_ES',
  };

  return {
    metadataBase: new URL(SITE_URL),

    title: {
      default: pageTitle,
      template: `%s | ${dict.seo.siteName}`,
    },

    description: pageDescription,
    keywords: dict.seo.keywords,

    alternates: {
      canonical: `/${lang}`,
      languages: {
        pt: '/pt',
        en: '/en',
        es: '/es',
      },
    },

    openGraph: {
      type: 'website',
      locale: ogLocaleMap[lang],
      url: `${SITE_URL}/${lang}`,
      siteName: dict.seo.site.siteName,
      title: pageTitle,
      description: pageDescription,
      images: [
        {
          url: ogImageMap[lang],
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
      images: [ogImageMap[lang]],
    },

    icons: {
      icon: '/icons/favicon.ico',
      shortcut: '/icons/favicon.ico',
      apple: '/icons/apple-touch-icon.png',
    },

    themeColor: [
      { media: '(prefers-color-scheme: dark)', color: '#020617' },
      { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    ],

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
