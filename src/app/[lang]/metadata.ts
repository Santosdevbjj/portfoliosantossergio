// src/app/[lang]/metadata.ts
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/dictionaries';
import { isValidLocale, SUPPORTED_LOCALES } from '@/dictionaries/locales';
import type { Locale } from '@/types/dictionary';

const SITE_URL = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://portfoliosantossergio.vercel.app';

interface MetadataProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { lang: rawLang } = await params;

  if (!isValidLocale(rawLang)) {
    notFound();
  }

  const lang = rawLang as Locale;
  const dict = await getDictionary(lang);
  const homePage = dict.seo.pages?.['home'];
  const pageTitle = homePage?.title ?? dict.seo.siteName;
  const pageDescription = homePage?.description ?? dict.seo.description;

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

  // GERAÇÃO DINÂMICA DE HREFLANG (Crucial para resolver o erro do Search Console)
  const hreflangMap = SUPPORTED_LOCALES.reduce((acc, loc) => {
    acc[loc.toLowerCase()] = `${SITE_URL}/${loc}`;
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
      // Resolve o erro de "Cópia": Cada página afirma ser a sua própria versão oficial
      canonical: `${SITE_URL}/${lang}`,
      languages: {
        ...hreflangMap,
        'x-default': `${SITE_URL}/pt-BR`, // Aponta para a principal se o idioma não for detectado
      },
    },
    openGraph: {
      type: 'website',
      locale: ogLocaleMap[lang],
      url: `${SITE_URL}/${lang}`,
      siteName: dict.seo.siteName,
      title: pageTitle,
      description: pageDescription,
      images: [{
        url: finalOgImage,
        width: 1200,
        height: 630,
        alt: pageTitle,
      }],
    },
    // ... manter twitter, icons e robots como já estavam no seu arquivo original
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
      },
    },
  };
}
