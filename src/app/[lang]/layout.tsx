// src/app/[lang]/layout.tsx
import { Inter } from 'next/font/google';
import '../globals.css';
// CORREÇÃO: Importação como 'type' para conformidade com TS 5.7 e Next 15
import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider'; 
import { CookieBanner } from '@/components/CookieBanner'; 
import { i18n } from '@/i18n-config';

// Otimização de fonte: Inter é o padrão ouro para legibilidade de dados
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

/**
 * CONFIGURAÇÃO DE VIEWPORT (UX MOBILE)
 * Essencial para que o portfólio não "trema" ao carregar no celular.
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
 * Configuração de autoridade para o robô do Google e redes sociais.
 */
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || i18n.defaultLocale;
  
  const titles: Record<string, string> = {
    pt: "Sérgio Santos | Especialista em Dados e Eficiência",
    en: "Sérgio Santos | Data & Efficiency Specialist",
    es: "Sérgio Santos | Especialista en Datos y Eficiencia"
  };

  const descriptions: Record<string, string> = {
    pt: "Analista Sênior com 15+ anos em sistemas críticos (Bradesco). Especialista em Ciência de Dados, Azure e automação estratégica.",
    en: "Senior Analyst with 15+ years in critical systems (Bradesco). Specialist in Data Science, Azure, and strategic automation.",
    es: "Analista Sénior con 15+ años en sistemas críticos (Bradesco). Especialista en Ciencia de Datos, Azure y automatización estratégica."
  };

  // URL de produção vinda do ambiente ou fallback
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portfoliosantossergio.vercel.app";

  return {
    title: {
      default: titles[lang as keyof typeof titles] || titles.pt,
      template: `%s | Sérgio Santos`
    },
    description: descriptions[lang as keyof typeof descriptions] || descriptions.pt,
    metadataBase: new URL(siteUrl),
    
    /**
     * TAG DE VERIFICAÇÃO DO GOOGLE (Search Console)
     * Mantida com atenção total para indexação correta.
     */
    verification: {
      google: '0eQpOZSmJw5rFx70_NBmJCSkcBbwTs-qAJzfts5s-R0',
    },

    alternates: {
      canonical: `${siteUrl}/${lang}`,
      languages: {
        'pt-BR': `${siteUrl}/pt`,
        'en-US': `${siteUrl}/en`,
        'es-ES': `${siteUrl}/es`,
        'x-default': `${siteUrl}/pt`, // Define o português como padrão para o resto do mundo
      },
    },
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/icon.png', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-touch-icon.png' },
      ],
    },
    manifest: '/manifest.json',
    openGraph: {
      title: titles[lang as keyof typeof titles] || titles.pt,
      description: descriptions[lang as keyof typeof descriptions] || descriptions.pt,
      url: `${siteUrl}/${lang}`,
      siteName: "Sérgio Santos Portfolio",
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'Sérgio Santos - Portfolio Presentation',
        },
      ],
      locale: lang === 'pt' ? 'pt_BR' : lang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  // O params deve ser aguardado no Next.js 15
  const { lang } = await params;

  return (
    <html lang={lang} suppressHydrationWarning className="scroll-smooth">
      <head>
        {/* Meta tags específicas para experiência mobile premium no iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body 
        className={`${inter.variable} ${inter.className} bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          {/* Layout estrutural: Flex-col e flex-grow para manter o rodapé no fundo */}
          <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden">
            <main className="flex-grow">
              {children}
            </main>
          </div>

          {/* Banner de Cookies: Conformidade LGPD/GDPR para visitantes europeus e brasileiros */}
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
