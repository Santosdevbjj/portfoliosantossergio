// src/app/[lang]/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { ThemeProvider } from '@/components/ThemeProvider'; 
import { CookieBanner } from '@/components/CookieBanner'; 
import { i18n } from '@/i18n-config';

// Fonte otimizada: Inter é excelente para leitura de dados e dashboards
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

type LocaleContent = {
  pt: string;
  en: string;
  es: string;
};

/**
 * CONFIGURAÇÃO DE VIEWPORT
 * Garante que o site não tenha zoom indesejado no mobile e respeite o tema do sistema.
 */
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

/**
 * SEO MULTILINGUE DINÂMICO
 */
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = (resolvedParams.lang || i18n.defaultLocale) as keyof LocaleContent;
  
  const titles: LocaleContent = {
    pt: "Sérgio Santos | Especialista em Dados e Sistemas Críticos",
    en: "Sérgio Santos | Data & Critical Systems Specialist",
    es: "Sérgio Santos | Especialista en Datos y Sistemas Críticos"
  };

  const descriptions: LocaleContent = {
    pt: "Analista Sênior com 20+ anos em sistemas críticos (Bradesco). Especialista em Ciência de Dados, Azure e Eficiência Operacional.",
    en: "Senior Analyst with 20+ years in critical systems (Bradesco). Specialist in Data Science, Azure, and Operational Efficiency.",
    es: "Analista Sénior con 20+ años en sistemas críticos (Bradesco). Especialista en Ciencia de Datos, Azure y Eficiencia Operativa."
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portfoliosantossergio.vercel.app";
  const title = titles[lang] || titles.pt;
  const description = descriptions[lang] || descriptions.pt;

  return {
    title: {
      default: title,
      template: `%s | Sérgio Santos`
    },
    description: description,
    metadataBase: new URL(siteUrl),
    
    // Verificação de Propriedade do Google
    verification: {
      google: '0eQpOZSmJw5rFx70_NBmJCSkcBbwTs-qAJzfts5s-R0',
    },

    alternates: {
      canonical: `${siteUrl}/${lang}`,
      languages: {
        'pt-BR': `${siteUrl}/pt`,
        'en-US': `${siteUrl}/en`,
        'es-ES': `${siteUrl}/es`,
        'x-default': `${siteUrl}/en`, // Recomendado Inglês como fallback global
      },
    },

    openGraph: {
      title: title,
      description: description,
      url: `${siteUrl}/${lang}`,
      siteName: "Sérgio Santos Portfolio",
      locale: lang === 'pt' ? 'pt_BR' : lang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: title }],
    },

    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: ['/og-image.png'],
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

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { lang } = await params;

  return (
    <html 
      lang={lang} 
      suppressHydrationWarning 
      className="scroll-smooth"
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body 
        className={`${inter.variable} ${inter.className} bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col selection:bg-blue-500/30`}
      >
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
        >
          {/* Container Raiz Otimizado para Responsividade */}
          <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden">
            <main className="flex-grow w-full">
              {children}
            </main>
          </div>
          
          {/* Banner de Cookies traduzido via componente interno */}
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
