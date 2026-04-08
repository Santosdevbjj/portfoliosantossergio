// src/app/[lang]/layout.tsx

import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

// Configurações de Dicionário e Locales
import { locales, type SupportedLocale, normalizeLocale } from "@/dictionaries/locales";
import { getServerDictionary } from "@/lib/getServerDictionary";
import { ScrollSpyProvider } from "@/contexts/scroll-spy.client";
import { buildMetadata } from "@/lib/seo";

// Componentes de Layout e SEO
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { BreadcrumbsJsonLd } from "@/components/seo/BreadcrumbsJsonLd";
import OpenGraph from "@/components/seo/OpenGraph";
import StructuredData from "@/components/StructuredData";

// Tailwind CSS 4.2 Engine
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * Next.js 16.2.2: Geração Estática de Parâmetros para os Locales (PPR Ready)
 */
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/**
 * Geração de Metadados Dinâmicos (SEO Multilingue e Regional)
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
  const baseUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? "https://portfoliosantossergio.vercel.app";

  const metadata = buildMetadata({
    title: dict.seo.title,
    description: dict.seo.description,
    path: `/${locale}`,
  });

  return {
    ...metadata,
    metadataBase: new URL(baseUrl),
    verification: {
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
        "x-default": `${baseUrl}/pt-BR`,
      },
    },
    openGraph: {
      ...metadata.openGraph,
      locale: locale.replace("-", "_"),
      images: [
        {
          url: `/og/og-image-${locale}.png`,
          width: 1200,
          height: 630,
          alt: dict.seo.title,
        },
      ],
    },
    icons: {
      icon: [
        { url: "/icons/icon.svg", type: "image/svg+xml" },
        { url: "/icons/icon.png", type: "image/png" },
      ],
      shortcut: "/icons/favicon.ico",
      apple: [
        { url: "/icons/apple-touch-icon.png" },
        { url: "/icons/apple-icon.png" },
      ]
    }
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
  viewportFit: "cover",
};

export default async function LangLayout(props: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const locale = normalizeLocale(lang) as SupportedLocale;

  // Validação de segurança para o locale
  if (!locales.includes(locale)) notFound();

  const dict = await getServerDictionary(locale);
  const baseUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? "https://portfoliosantossergio.vercel.app";
  
  // Extrai o prefixo (pt, en, es) para a tag html
  const htmlLang = locale.split("-")[0];

  return (
    <html 
      lang={htmlLang} 
      className={`${inter.variable} scroll-smooth`} 
      suppressHydrationWarning
    >
      <head>
        <OpenGraph 
          title={dict.seo.title}
          description={dict.seo.description}
          url={`${baseUrl}/${locale}`}
          locale={locale}
        />
        <StructuredData lang={locale} />
        
        {/* NOTA: O Google Analytics foi removido daqui para conformidade LGPD/GDPR.
          A inicialização do 'gtag' e o carregamento do script agora ocorrem 
          dentro do componente CookieBanner.tsx somente após o consentimento.
        */}
      </head>

      <body className="antialiased min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-50 selection:bg-blue-500/30 transition-colors duration-300">
        
        <div className="flex flex-col min-h-screen">
          <ScrollSpyProvider>
            {/* Skip to Content - Acessibilidade (WCAG 2.1) */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[210] bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-2xl transition-all"
            >
              {dict.common.skipToContent}
            </a>

            <Navbar lang={locale} common={dict.common} contact={dict.contact} />

            <main id="main-content" className="flex-grow flex flex-col focus:outline-none">
              <BreadcrumbsJsonLd lang={locale} dict={dict} baseUrl={baseUrl} />
              
              {/* Container Responsivo para Breadcrumbs */}
              <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
                <Breadcrumbs lang={locale} dictionary={dict} baseUrl={baseUrl} />
              </div>

              {/* Seção Principal de Conteúdo */}
              <section className="flex-grow w-full overflow-x-hidden">
                {props.children}
              </section>
            </main>

            <Footer 
              lang={locale} 
              common={dict.common} 
              contact={dict.contact} 
              articles={dict.articles} 
            />

            {/* Banner de Cookies: Centralizador da Privacidade (GDPR/LGPD/CCPA).
              Este componente injeta o Google Analytics dinamicamente se permitido.
            */}
            <CookieBanner dict={dict} />
          </ScrollSpyProvider>
        </div>
      </body>
    </html>
  );
}
