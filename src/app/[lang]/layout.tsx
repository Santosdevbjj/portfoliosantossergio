// src/app/[lang]/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import '../globals.css';

import { ThemeProvider } from '@/components/ThemeProvider';
import { CookieBanner } from '@/components/CookieBanner';
import { i18n, type Locale } from '@/i18n-config';

// Fontes otimizadas
const inter = Inter({ 
  subsets: ['latin'], 
  display: 'swap', 
  variable: '--font-inter' 
});

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  display: 'swap', 
  variable: '--font-montserrat' 
});

// Viewport configurada para responsividade máxima e suporte a PWA
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
};

/** * METADATA DINÂMICO 
 * Next.js 16: params agora é uma Promise.
 */
export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await props.params;
  
  // Validação do idioma para garantir SEO e links alternativos corretos
  const currentLang = (['pt', 'en', 'es'].includes(rawLang) ? rawLang : i18n.defaultLocale) as Locale;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfoliosantossergio.vercel.app';

  return {
    title: { 
      default: 'Sérgio Santos | Especialista em Dados', 
      template: '%s | Sérgio Santos' 
    },
    description: 'Especialista em Dados e Engenharia de Software com 20+ anos de experiência.',
    metadataBase: new URL(siteUrl),
    verification: {
      // TAG GOOGLE PRESERVADA INTEGRALMENTE
      google: '0eQpOZSmJw5rFx70_NBmJCSkcBbwTs-qAJzfts5s-R0',
    },
    alternates: {
      canonical: `${siteUrl}/${currentLang}`,
      languages: { 
        pt: `${siteUrl}/pt`, 
        en: `${siteUrl}/en`, 
        es: `${siteUrl}/es`, 
        'x-default': `${siteUrl}/pt` 
      },
    },
    manifest: `/${currentLang}/manifest.webmanifest`,
  };
}

/** * ROOT LAYOUT 
 * Focado em acessibilidade, responsividade e suporte multilíngue.
 */
export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  // Aguarda o parâmetro da rota (Obrigatório no Next.js 16)
  const { lang: rawLang } = await props.params;
  
  // Normaliza o idioma para os componentes filhos
  const currentLang = (['pt', 'en', 'es'].includes(rawLang) ? rawLang : 'pt') as Locale;

  return (
    <html 
      lang={currentLang} 
      suppressHydrationWarning 
      className={`scroll-smooth ${montserrat.variable} ${inter.variable}`}
    >
      <body 
        className={`
          ${inter.className} 
          bg-slate-50 dark:bg-[#020617] 
          text-slate-900 dark:text-slate-100 
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
          {/* Wrapper responsivo: garante que o conteúdo não quebre o eixo X */}
          <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden">
            <main className="flex-grow w-full relative">
              {props.children}
            </main>
          </div>

          {/* CORREÇÃO DO ERRO TS: 
              Passando explicitamente a propriedade 'lang' exigida pelo componente.
          */}
          <CookieBanner lang={currentLang} />
          
        </ThemeProvider>
      </body>
    </html>
  );
}
