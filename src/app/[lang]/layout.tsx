import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";

// Configurações de Dicionário e SEO
import { locales, type SupportedLocale, normalizeLocale } from "@/dictionaries/locales";
import { getServerDictionary } from "@/lib/getServerDictionary";
import { ScrollSpyProvider } from "@/contexts/scroll-spy.client";
import { buildMetadata } from "@/lib/seo";

// Componentes de Layout e SEO
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { BreadcrumbsJsonLd } from "@/components/seo/BreadcrumbsJsonLd";
import OpenGraph from "@/components/seo/OpenGraph";
import JsonLd from "@/components/seo/JsonLd";

// Tailwind CSS 4.2 Engine
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * Next.js 16.2.0: Geração Estática de Parâmetros
 */
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/**
 * Geração de Metadados Dinâmicos (SSR/ISR)
 * React 19: Params agora é uma Promise
 */
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = normalizeLocale(lang) as SupportedLocale;

  if (!locales.includes(locale)) notFound();

  const dict = await getServerDictionary(locale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfoliosantossergio.vercel.app";

  // BuildMetadata centralizado para SEO consistente
  const metadata = buildMetadata({
    title: dict.seo.title,
    description: dict.seo.description,
    path: `/${locale}`,
  });

  return {
    ...metadata,
    verification: {
      // MANTIDO: Sua Tag de Verificação do Google
      google: "0eQpOZSmJw5rFx70_NBmJCSkcBbwTs-qAJzfts5s-R0",
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        "pt-BR": `${baseUrl}/pt-BR`,
        "en-US": `${baseUrl}/en-US`,
        "es-ES": `${baseUrl}/es-ES`,
        "es-AR": `${baseUrl}/es-AR`,
        "es-MX": `${baseUrl}/es-MX`,
      },
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
  viewportFit: "cover",
};

/**
 * ROOT LAYOUT MULTILINGUE
 * Implementa transição suave e integração total com Node 24 / React 19.
 */
export default async function LangLayout(props: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const locale = normalizeLocale(lang) as SupportedLocale;

  if (!locales.includes(locale)) notFound();

  const dict = await getServerDictionary(locale);
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfoliosantossergio.vercel.app";
  
  // Define a direção do texto e o idioma base (ex: "es" para es-AR)
  const baseLanguage = locale.split("-")[0];

  return (
    <html 
      lang={baseLanguage} 
      className={`${inter.variable} scroll-smooth`} 
      suppressHydrationWarning
    >
      <head>
        {/* Injeção do Componente OpenGraph Customizado */}
        <OpenGraph 
          title={dict.seo.title}
          description={dict.seo.description}
          url={`${baseUrl}/${locale}`}
          locale={locale}
        />
        
        {/* Sua Tag Global do Google Analytics vinculada ao GA_ID */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </head>

      {/* INTEGRAÇÃO: Suavização de Transição (Prevent Flash) e Tailwind 4.2 */}
      <body className="antialiased min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-50 transition-colors duration-300 ease-in-out">
        
        {/* Efeito de Fade Global para Mudança de Idioma */}
        <div className="animate-in fade-in duration-700 flex flex-col min-h-screen">
          
          <ScrollSpyProvider>
            {/* Acessibilidade: Skip Link */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[110] bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-2xl"
            >
              {dict.common.skipToContent}
            </a>

            {/* Navbar Multilingue */}
            <Navbar lang={locale} common={dict.common} contact={dict.contact} />

            <main id="main-content" className="flex-grow flex flex-col">
              {/* Metadados Estruturados: Breadcrumbs JSON-LD */}
              <BreadcrumbsJsonLd lang={locale} dict={dict} baseUrl={baseUrl} />
              
              <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
                <Breadcrumbs lang={locale} dictionary={dict} baseUrl={baseUrl} />
              </div>

              {/* Injeção do Conteúdo da Página */}
              <section className="flex-grow w-full">
                {props.children}
              </section>
            </main>

            {/* Rodapé Alinhado com Dicionários */}
            <Footer 
              lang={locale} 
              common={dict.common} 
              contact={dict.contact} 
              articles={dict.articles} 
            />
          </ScrollSpyProvider>

        </div>
      </body>
    </html>
  );
}
