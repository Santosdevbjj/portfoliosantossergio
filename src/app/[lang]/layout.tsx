// src/app/[lang]/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { ThemeProvider } from '@/components/ThemeProvider'; 
import { CookieBanner } from '@/components/CookieBanner'; 
import { i18n } from '@/i18n-config';

// Otimização de fonte para leitura de dados e relatórios
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

// Tipagem estrita para garantir que o TS nunca veja 'undefined' no build
type LocaleContent = {
  pt: string;
  en: string;
  es: string;
};

/**
 * CONFIGURAÇÃO DE VIEWPORT (UX MOBILE)
 */
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

/**
 * SEO MULTILINGUE & GOOGLE VERIFICATION
 */
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const resolvedParams = await params;
  // Fallback e cast para garantir que 'lang' seja uma das chaves válidas
  const lang = (resolvedParams.lang || i18n.defaultLocale) as keyof LocaleContent;
  
  const titles: LocaleContent = {
    pt: "Sérgio Santos | Especialista em Dados e Eficiência",
    en: "Sérgio Santos | Data & Efficiency Specialist",
    es: "Sérgio Santos | Especialista en Datos y Eficiencia"
  };

  const descriptions: LocaleContent = {
    pt: "Analista Sênior com 15+ anos em sistemas críticos (Bradesco). Especialista em Ciência de Dados e Azure.",
    en: "Senior Analyst with 15+ years in critical systems (Bradesco). Specialist in Data Science and Azure.",
    es: "Analista Sénior con 15+ años en sistemas críticos (Bradesco). Especialista en Ciencia de Datos y Azure."
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portfoliosantossergio.vercel.app";

  // Resolução segura de valores (Garante que nunca retorne undefined)
  const title = titles[lang] || titles.pt;
  const description = descriptions[lang] || descriptions.pt;

  return {
    title: {
      default: title,
      template: `%s | Sérgio Santos`
    },
    description: description,
    metadataBase: new URL(siteUrl),
    
    // ATENÇÃO: TAG DO GOOGLE MANTIDA CONFORME SOLICITADO
    verification: {
      google: '0eQpOZSmJw5rFx70_NBmJCSkcBbwTs-qAJzfts5s-R0',
    },

    alternates: {
      canonical: `${siteUrl}/${lang}`,
      languages: {
        'pt-BR': `${siteUrl}/pt`,
        'en-US': `${siteUrl}/en`,
        'es-ES': `${siteUrl}/es`,
        'x-default': `${siteUrl}/pt`,
      },
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/icon.png',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.json',
    openGraph: {
      title: title,
      description: description,
      url: `${siteUrl}/${lang}`,
      siteName: "Sérgio Santos Portfolio",
      locale: lang === 'pt' ? 'pt_BR' : lang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
  };
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { lang } = await params;

  return (
    <html lang={lang} suppressHydrationWarning className="scroll-smooth">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body 
        className={`${inter.variable} ${inter.className} bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden">
            <main className="flex-grow">
              {children}
            </main>
          </div>
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
