// src/app/[lang]/layout.tsx
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

import { locales, type SupportedLocale, normalizeLocale } from "@/dictionaries/locales";
import { getServerDictionary } from "@/lib/getServerDictionary";
import { ScrollSpyProvider } from "@/contexts/scroll-spy.client";
import { buildMetadata, siteConfig } from "@/lib/seo";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { BreadcrumbsJsonLd } from "@/components/seo/BreadcrumbsJsonLd";
import OpenGraph from "@/components/seo/OpenGraph";
import StructuredData from "@/components/StructuredData";

import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = normalizeLocale(lang) as SupportedLocale;

  if (!locales.includes(locale)) notFound();

  const dict = await getServerDictionary(locale);

  // Usa o buildMetadata centralizado para evitar discrepâncias
  return buildMetadata({
    title: dict.seo.title,
    description: dict.seo.description,
    path: `/${locale}`,
    lang: locale
  });
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

  if (!locales.includes(locale)) notFound();

  const dict = await getServerDictionary(locale);
  const baseUrl = siteConfig.url;
  
  /**
   * CORREÇÃO CRÍTICA:
   * A tag 'lang' deve refletir o locale completo (ex: pt-BR) para o validador.
   * Alguns validadores preferem apenas o prefixo (pt), mas para SEO regional, 
   * passamos o 'locale' completo para máxima precisão.
   */
  const htmlLang = locale; 

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
      </head>

      <body className="antialiased min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-50 selection:bg-blue-500/30 transition-colors duration-300">
        
        <div className="flex flex-col min-h-screen">
          <ScrollSpyProvider>
            {/* Skip to Content - WCAG 2.1 */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[210] bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-2xl transition-all"
            >
              {dict.common.skipToContent}
            </a>

            <Navbar lang={locale} common={dict.common} contact={dict.contact} />

            <main id="main-content" className="flex-grow flex flex-col focus:outline-none">
              <BreadcrumbsJsonLd lang={locale} dict={dict} baseUrl={baseUrl} />
              
              <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
                <Breadcrumbs lang={locale} dictionary={dict} baseUrl={baseUrl} />
              </div>

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

            <CookieBanner dict={dict} />
          </ScrollSpyProvider>
        </div>
      </body>
    </html>
  );
}
