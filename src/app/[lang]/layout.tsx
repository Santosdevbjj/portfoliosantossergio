import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import '../globals.css';
import { ThemeProvider } from '@/components/ThemeProvider'; 
import { CookieBanner } from '@/components/CookieBanner'; 
import { i18n, type Locale } from '@/i18n-config';

// Fontes otimizadas para performance e legibilidade em 2026
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
 * CONFIGURAÇÃO DE VIEWPORT
 * Garante que o site seja adaptável em qualquer dispositivo (Mobile, Tablet, Desktop).
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
 * GENERATE METADATA - SEO MULTILINGUE DINÂMICO
 * Alinhado com a documentação do Next.js 15: params é uma Promise.
 */
export async function generateMetadata(props: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await props.params;
  const currentLang = (lang || i18n.defaultLocale) as Locale;
  
  const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] || "https://portfoliosantossergio.vercel.app";

  const content = {
    pt: {
      title: "Sérgio Santos | Especialista em Dados e Sistemas Críticos",
      desc: "Analista Sênior com 20+ anos em sistemas críticos. Especialista em Ciência de Dados, Azure e Eficiência Operacional."
    },
    en: {
      title: "Sérgio Santos | Data & Critical Systems Specialist",
      desc: "Senior Analyst with 20+ years in critical systems. Specialist in Data Science, Azure, and Operational Efficiency."
    },
    es: {
      title: "Sérgio Santos | Especialista en Datos y Sistemas Críticos",
      desc: "Analista Sénior con 20+ años en sistemas críticos. Especialista en Ciencia de Datos, Azure y Eficiencia Operativa."
    }
  };

  const currentContent = content[currentLang] || content.pt;

  return {
    title: {
      default: currentContent.title,
      template: `%s | Sérgio Santos`
    },
    description: currentContent.desc,
    metadataBase: new URL(siteUrl),
    
    // TAG DE VERIFICAÇÃO DO GOOGLE (PRESERVADA)
    verification: {
      google: '0eQpOZSmJw5rFx70_NBmJCSkcBbwTs-qAJzfts5s-R0',
    },

    alternates: {
      canonical: `${siteUrl}/${currentLang}`,
      languages: {
        'pt': `${siteUrl}/pt`,
        'en': `${siteUrl}/en`,
        'es': `${siteUrl}/es`,
        'x-default': `${siteUrl}/pt`,
      },
    },

    openGraph: {
      title: currentContent.title,
      description: currentContent.desc,
      url: `${siteUrl}/${currentLang}`,
      siteName: "Sérgio Santos Portfolio",
      locale: currentLang === 'pt' ? 'pt_BR' : currentLang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
      images: [
        {
          url: `/og-image-${currentLang}.png`,
          width: 1200,
          height: 630,
          alt: currentContent.title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: currentContent.title,
      description: currentContent.desc,
      images: [`/og-image-${currentLang}.png`],
    },
  };
}

/**
 * ROOT LAYOUT - A estrutura mestre da aplicação
 */
export default async function RootLayout(props: LayoutProps<'/[lang]'>) {
  const { children } = props;
  const { lang } = await props.params;

  // Auditoria de Segurança Silenciosa no Servidor
  if (process.env.NODE_ENV === 'production') {
    console.info(`[System] Shield Active: Next.js 16.1.0 | Language: ${lang}`);
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
        className={`
          ${inter.variable} ${montserrat.variable} ${inter.className} 
          bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 
          antialiased min-h-screen flex flex-col 
          selection:bg-blue-600 selection:text-white
        `}
      >
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
        >
          {/* Wrapper Responsivo: overflow-x-hidden evita quebras em mobile */}
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
