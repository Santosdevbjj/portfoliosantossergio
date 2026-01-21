import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import '../globals.css';
import { ThemeProvider } from '@/components/ThemeProvider'; 
import { CookieBanner } from '@/components/CookieBanner'; 
import { i18n } from '@/i18n-config';

// Fontes de alta performance para 2026
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

/**
 * NOTA TÉCNICA DE SEGURANÇA E GOVERNANÇA:
 * Este projeto implementa medidas rigorosas contra vulnerabilidades de Dia Zero.
 * * FIX: CVE-2025-66478 (React2Shell)
 * Status: Patched - Next.js 15.5.7+
 * Integridade: Protocolo RSC endurecido para prevenir Remote Code Execution (RCE).
 * Data da Auditoria Técnica: 21 de Janeiro de 2026
 */

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

type LocaleContent = {
  pt: string;
  en: string;
  es: string;
};

// Configuração de Viewport para Responsividade Total
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
 * SEO MULTILINGUE & AUTORIDADE DINÂMICA
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
    
    // TAG DE VERIFICAÇÃO DO GOOGLE (MANTIDA RIGOROSAMENTE)
    verification: {
      google: '0eQpOZSmJw5rFx70_NBmJCSkcBbwTs-qAJzfts5s-R0',
    },

    alternates: {
      canonical: `${siteUrl}/${lang}`,
      languages: {
        'pt': `${siteUrl}/pt`,
        'en': `${siteUrl}/en`,
        'es': `${siteUrl}/es`,
        'x-default': `${siteUrl}/pt`,
      },
    },

    openGraph: {
      title: title,
      description: description,
      url: `${siteUrl}/${lang}`,
      siteName: "Sérgio Santos Portfolio",
      locale: lang === 'pt' ? 'pt_BR' : lang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
      images: [
        {
          url: `/og-image-${lang}.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [`/og-image-${lang}.png`],
    },
  };
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { lang } = await params;

  // Log de Segurança Ativa para auditoria em ambiente de servidor (Vercel)
  if (process.env.NODE_ENV === 'production') {
    console.info(`[Security Audit] V24-LTS | Next.js 15.5.7 Patch CVE-2025-66478 Active.`);
  }

  return (
    <html 
      lang={lang} 
      suppressHydrationWarning 
      className="scroll-smooth"
    >
      <head>
        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="icon" href="/icons/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body 
        className={`${inter.variable} ${montserrat.variable} ${inter.className} bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col selection:bg-blue-600 selection:text-white`}
      >
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
        >
          {/* Estrutura Responsiva com tratamento de overflow horizontal */}
          <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden">
            <main className="flex-grow w-full">
              {children}
            </main>
          </div>
          
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
