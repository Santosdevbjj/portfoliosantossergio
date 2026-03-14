import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";

import { normalizeLocale, locales } from "@/dictionaries/locales";
import { getServerDictionary } from "@/lib/getServerDictionary";
import { ScrollSpyProvider } from "@/contexts/scroll-spy.client";
import { buildMetadata } from "@/lib/seo";
import { personSchema, websiteSchema } from "@/lib/schema";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { BreadcrumbsJsonLd } from "@/components/seo/BreadcrumbsJsonLd";

import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = normalizeLocale(lang);

  if (!locales.includes(locale)) notFound();

  const dict = await getServerDictionary(locale);

  /** * CORREÇÃO TYPE ERROR: 
   * Ajustado para passar apenas propriedades aceitas pela interface em src/lib/seo.ts
   * A verificação do Google é injetada manualmente para garantir que o TS não barre o build
   */
  const metadata = buildMetadata({
    title: dict.seo.title,
    description: dict.seo.description,
    path: `/${locale}`,
  });

  return {
    ...metadata,
    verification: {
      google: "0eQpOZSmJw5rFx70_NBmJCSkcBbwTs-qAJzfts5s-R0", // SUA TAG PRESERVADA E PROTEGIDA
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

// COLOQUEI ABAIXO

export const metadata = {
  metadataBase: new URL('https://portfoliosantossergio.vercel.app'),
};



export default async function LangLayout(props: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const locale = normalizeLocale(lang);

  if (!locales.includes(locale)) notFound();

  const dict = await getServerDictionary(locale);
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfoliosantossergio.vercel.app";
  const baseLanguage = locale.split("-")[0];

  return (
    <html
      lang={baseLanguage}
      className={`${inter.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        {/* Scripts de Schema.org para SEO Estruturado */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased selection:bg-blue-500/30">
        <ScrollSpyProvider>
          {/* Acessibilidade: Skip Link para Teclado/Screen Readers */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[110] bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            {dict.common.skipToContent}
          </a>

          <Navbar lang={locale} common={dict.common} />

          <main id="main-content" className="flex-grow">
            <BreadcrumbsJsonLd lang={locale} dict={dict} baseUrl={baseUrl} />

            {/* Layout Responsivo alinhado com Tailwind 4.2 */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
              <Breadcrumbs lang={locale} dictionary={dict} baseUrl={baseUrl} />
            </div>

            {props.children}
          </main>

          <Footer
            lang={locale}
            common={dict.common}
            contact={dict.contact}
            articles={dict.articles}
          />
        </ScrollSpyProvider>

        {/* Google Analytics - Mantido Intacto */}
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
      </body>
    </html>
  );
}
