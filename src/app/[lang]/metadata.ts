// src/app/[lang]/metadata.ts
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/dictionaries';
import type { Locale } from '@/types/dictionary';

const SITE_URL = 'https://portfoliosantossergio.vercel.app';

interface MetadataProps {
  params: Promise<{
    lang: Locale;
  }>;
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  // 1. Resolvemos a Promise dos parâmetros (Obrigatório no Next.js 15/16)
  const resolvedParams = await params;
  const lang = resolvedParams.lang;

  // 2. Lista de locales suportados
  const supportedLocales: Locale[] = ['pt-BR', 'en-US', 'es-ES', 'es-AR', 'es-MX'];
  
  if (!supportedLocales.includes(lang)) {
    notFound();
  }

  // 3. CORREÇÃO: Adicionado 'await' para carregar o dicionário corretamente
  const dict = await getDictionary(lang);

  const pageTitle = dict.seo.pages?.home?.title ?? dict.seo.siteName;
  const pageDescription = dict.seo.pages?.home?.description ?? dict.seo.description;

  // Mapeamento de imagens OG (Consistente com seus arquivos públicos)
  const ogImageMap: Record<Locale, string> = {
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
        'pt-BR': '/pt-BR',
        'en-US': '/en-US',
        'es-ES': '/es-ES',
        'es-AR': '/es-AR',
        'es-MX': '/es-MX',
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
      icon: [
        { url: '/icons/favicon.ico' },
        { url: '/icons/icon.png', type: 'image/png' },
      ],
      apple: [
        { url: '/icons/apple-touch-icon.png' },
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
