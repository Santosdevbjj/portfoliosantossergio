import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";

// Configurações de Dicionário e SEO
import { normalizeLocale, locales, type SupportedLocale } from "@/dictionaries/locales";
import { getServerDictionary } from "@/lib/getServerDictionary";
import { ScrollSpyProvider } from "@/contexts/scroll-spy.client";
import { buildMetadata } from "@/lib/seo";
import { personSchema, websiteSchema } from "@/lib/schema";

// Componentes de Layout
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { BreadcrumbsJsonLd } from "@/components/seo/BreadcrumbsJsonLd";

// Tailwind CSS 4.2 Engine
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * Next.js 16.2 Static Generation
 */
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/**
 * Geração de Metadados - React 19 Async Params
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

  const metadata = buildMetadata({
    title: dict.seo.title,
    description: dict.seo.description,
    path: `/${locale}`,
  });

  return {
    ...metadata,
    verification: {
      // Sua TAG de verificação mantida intacta
      google: "0eQpOZSmJw5rFx70_NBmJCSkcBbwTs-qAJzfts5s-R0",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
  viewportFit: "cover", // Otimização para dispositivos móveis
};

/**
 * Layout Principal Multilingue
 */
export default async function LangLayout(props: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  // No Next.js 16.2, params deve ser aguardado (await)
  const { lang } = await props.params;
  const locale = normalizeLocale(lang) as SupportedLocale;

  if (!locales.includes(locale)) notFound();

  const dict = await getServerDictionary(locale);

  // FIX: Acesso via index signature para conformidade com TypeScript 6.0 / Node 24
  const gaId = process.env["NEXT_PUBLIC_GA_ID"];
  const baseUrl = process.env["NEXT_PUBLIC_SITE_URL"] ?? "https://portfoliosantossergio.vercel.app";
  
  // Extrai o código base do idioma (pt, en, es)
  const baseLanguage = locale.split("-")[0] ?? "pt";

  return (
    <html 
      lang={baseLanguage} 
      className={`${inter.variable} scroll-smooth`} 
      suppressHydrationWarning
    >
      <head>
        {/* Esquemas JSON-LD para SEO Avançado */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-50 font-sans antialiased selection:bg-blue-500/30 transition-colors duration-300">
        <ScrollSpyProvider>
          {/* Acessibilidade: Skip Link para Teclado */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[110] bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-2xl"
          >
            {dict.common.skipToContent}
          </a>

          {/* Cabeçalho Responsivo */}
          <Navbar lang={locale} common={dict.common} contact={dict.contact} />

          <main id="main-content" className="flex-grow flex flex-col">
            {/* SEO: Breadcrumbs Dinâmicos */}
            <BreadcrumbsJsonLd lang={locale} dict={dict} baseUrl={baseUrl} />
            
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
              <Breadcrumbs lang={locale} dictionary={dict} baseUrl={baseUrl} />
            </div>

            {/* Conteúdo da Página */}
            <div className="flex-grow w-full">
              {props.children}
            </div>
          </main>

          {/* Rodapé Multilingue */}
          <Footer 
            lang={locale} 
            common={dict.common} 
            contact={dict.contact} 
            articles={dict.articles} 
          />
        </ScrollSpyProvider>

        {/* Google Analytics - Carregamento Otimizado (Strategy: afterInteractive) */}
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
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
