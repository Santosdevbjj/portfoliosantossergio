import { Inter } from 'next/font/google';
import '../globals.css';
import { Metadata } from 'next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher'; // Importação essencial

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

// 1. Geração de Metadados Dinâmicos e SEO Internacional
export async function generateMetadata(props: { 
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const params = await props.params;
  const lang = params.lang;
  
  const titles: Record<string, string> = {
    pt: "Sérgio Santos | Analista de Ciência de Dados",
    en: "Sérgio Santos | Data Science Analyst",
    es: "Sérgio Santos | Analista de Ciencia de Datos"
  };

  const descriptions: Record<string, string> = {
    pt: "Analista de Dados com 15+ anos em sistemas críticos bancários, especializado em Python, Azure Databricks e IA.",
    en: "Data Analyst with 15+ years in critical banking systems, specialized in Python, Azure Databricks, and AI.",
    es: "Analista de Datos con 15+ años en sistemas bancarios críticos, especializado em Python, Azure Databricks e IA."
  };

  const siteUrl = "https://portfoliosantossergio.vercel.app";

  return {
    title: titles[lang] || titles.pt,
    description: descriptions[lang] || descriptions.pt,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `/${lang}`,
      languages: {
        'pt': '/pt',
        'en': '/en',
        'es': '/es',
      },
    },
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/icon.png', type: 'image/png' },
      ],
      apple: '/icon.png',
    },
    manifest: '/manifest.json',
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      url: `${siteUrl}/${lang}`,
      siteName: "Sérgio Santos Portfolio",
      images: [{ url: `/og-image-${lang}.png`, width: 1200, height: 630 }],
      locale: lang === 'pt' ? 'pt_BR' : lang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang],
      description: descriptions[lang],
      images: [`/og-image-${lang}.png`],
    },
  };
}

// 2. Root Layout Principal
export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  const { lang } = params;
  const { children } = props;

  return (
    <html lang={lang} suppressHydrationWarning className="scroll-smooth">
      <head>
        {/* Apple Status Bar Color */}
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body 
        className={`${inter.className} bg-white dark:bg-[#0f172a] text-gray-900 dark:text-slate-200 antialiased overflow-x-hidden`}
      >
        {/* Seletor de Idiomas Global */}
        <LanguageSwitcher />

        <div className="min-h-screen flex flex-col relative w-full">
          <main className="flex-grow">
            {children}
          </main>
          
          {/* Opcional: Footer Global aqui */}
        </div>
      </body>
    </html>
  );
}
