// src/app/[lang]/page.tsx
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

// Types
import type { Locale } from "@/types/dictionary";

// Services & Helpers
import { getServerDictionary } from "@/lib/getServerDictionary";
import { SUPPORTED_LOCALES, isValidLocale } from "@/dictionaries/locales";

// Components
import ProxyPage from "@/components/ProxyPage";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FeaturedProjectsSection from "@/components/featured/FeaturedProjectsSection";
import FeaturedArticleSection from "@/components/FeaturedArticleSection";

interface PageProps {
  params: Promise<{ lang: string }>;
}

/**
 * Configurações de Performance e Build para Next.js 16+
 * O Node 24 gerencia melhor o streaming de componentes estáticos
 */
export const dynamic = "force-static";
export const revalidate = 60; 

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

/**
 * Geração de Metadados - React 19 / Next.js 16 (Async Params)
 */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { lang } = await props.params;
  
  if (!lang || !isValidLocale(lang)) return {};

  try {
    const dict = await getServerDictionary(lang as Locale);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfoliosantossergio.vercel.app";

    return {
      title: dict.seo?.pages?.home?.title || "Sérgio Santos | Portfolio",
      description: dict.seo?.pages?.home?.description || "Engenheiro de Dados",
      verification: {
        google: "0eQpOZSmJw5rFx70_NBmJCSkcBbwTs-qAJzfts5s-R0",
      },
      alternates: {
        canonical: `${siteUrl}/${lang}`,
        languages: {
          "pt-BR": `${siteUrl}/pt-BR`,
          "en-US": `${siteUrl}/en-US`,
          "es-ES": `${siteUrl}/es-ES`,
        },
      },
    };
  } catch {
    return { title: "Sérgio Santos" };
  }
}

export default async function HomePage(props: PageProps) {
  // Obrigatório 'await' para params no Next.js 16
  const { lang: rawLang } = await props.params;

  if (!rawLang || !isValidLocale(rawLang)) {
    notFound();
  }

  const lang = rawLang as Locale;

  /**
   * Carregamento do dicionário com tratamento de erro robusto
   */
  const dict = await getServerDictionary(lang).catch((error) => {
    console.error("Erro ao carregar dicionário:", error);
    notFound();
  });

  // Helper para evitar erros de tipagem no ContactDictionary durante o build
  const contactDict = (dict.contact || {}) as any;

  return (
    <ProxyPage lang={lang}>
      <main className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 selection:bg-blue-500/30 selection:text-current">
        
        {/* Hero Section */}
        <HeroSection dictionary={dict} />
        
        {/* About Section */}
        <AboutSection dict={dict.about} />

        {/* Projetos de Destaque */}
        <FeaturedProjectsSection 
          lang={lang}
          dict={dict} 
        />

        {/* Artigos - Passagem de props validada */}
        <FeaturedArticleSection 
          articles={dict.articles} 
          common={dict.common}
        />

        {/* Banner de CTA Final - Tailwind 4.2 Optimized */}
        <section className="container mx-auto px-4 md:px-8 lg:px-16 py-24 max-w-7xl">
          <div className="p-10 md:p-16 rounded-[3rem] bg-slate-900 dark:bg-blue-600 text-white relative overflow-hidden group transition-all duration-700">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="text-center md:text-left space-y-2">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase leading-none">
                  {contactDict.ctaTitle || "Vamos construir algo juntos?"}
                </h2>
                <p className="opacity-80 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">
                  Especialista em Modernização de Dados e Governança
                </p>
              </div>
              <a 
                href={`mailto:${dict.common?.email || "santossergiorealbjj@outlook.com"}`} 
                className="bg-white text-slate-900 px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:scale-105 transition-all active:scale-95 shadow-2xl hover:bg-slate-100"
              >
                {contactDict.buttonText || "Entrar em Contato →"}
              </a>
            </div>
            
            {/* Decoração Visual (Glows de fundo) */}
            <div className="absolute -right-10 -top-10 w-80 h-80 bg-white/5 rounded-full blur-[100px] group-hover:bg-white/10 transition-all duration-700 pointer-events-none" />
            <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-blue-400/10 rounded-full blur-[80px] pointer-events-none" />
          </div>
        </section>
      </main>
    </ProxyPage>
  );
}
