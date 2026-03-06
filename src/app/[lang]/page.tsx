// src/app/[lang]/page.tsx
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

// Types
import type { Locale, Dictionary } from "@/types/dictionary";

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
 * Configurações de Performance - Next.js 16 + Node 24
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
 * Geração de Metadados - Alinhado com React 19 / Next.js 16
 */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const lang = params.lang;
  
  if (!lang || !isValidLocale(lang)) return {};

  try {
    const dict: Dictionary = await getServerDictionary(lang as Locale);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfoliosantossergio.vercel.app";

    return {
      title: dict.seo.pages.home.title,
      description: dict.seo.pages.home.description,
      verification: {
        google: "0eQpOZSmJw5rFx70_NBmJCSkcBbwTs-qAJzfts5s-R0",
      },
      alternates: {
        canonical: `${siteUrl}/${lang}`,
        languages: {
          "pt-BR": `${siteUrl}/pt-BR`,
          "en-US": `${siteUrl}/en-US`,
          "es-ES": `${siteUrl}/es-ES`,
          "es-AR": `${siteUrl}/es-AR`,
          "es-MX": `${siteUrl}/es-MX`,
        },
      },
    };
  } catch {
    return { title: "Sérgio Santos" };
  }
}

export default async function HomePage(props: PageProps) {
  // O await é obrigatório para params no Next.js 16
  const params = await props.params;
  const rawLang = params.lang;

  if (!rawLang || !isValidLocale(rawLang)) {
    notFound();
  }

  const lang = rawLang as Locale;

  /**
   * Carregamento do dicionário tipado com tratamento de erro rigoroso
   */
  const dict = await getServerDictionary(lang).catch((error) => {
    console.error("Critical: Error loading dictionary:", error);
    return null;
  });

  if (!dict) {
    notFound();
  }

  // Garantia extra contra o erro "is not iterable"
  const hasProjects = dict.projects?.featuredProjects && Array.isArray(dict.projects.featuredProjects);

  return (
    <ProxyPage lang={lang}>
      <main className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 selection:bg-blue-500/30">
        
        {/* Hero Section */}
        <HeroSection dictionary={dict} />
        
        {/* About Section */}
        <AboutSection dict={dict.about} />

        {/* Projetos de Destaque - Só renderiza se for iterável */}
        {hasProjects ? (
          <FeaturedProjectsSection 
            lang={lang}
            dict={dict} 
          />
        ) : (
          <div className="py-20 text-center opacity-50">
            {dict.states.emptyProjects.title}
          </div>
        )}

        {/* Artigos Técnicos */}
        <FeaturedArticleSection 
          articles={dict.articles} 
          common={dict.common}
        />

        {/* Banner de CTA Final */}
        <section className="container mx-auto px-4 md:px-8 lg:px-16 py-24 max-w-7xl">
          <div className="p-10 md:p-16 rounded-[2.5rem] bg-slate-950 dark:bg-blue-600 text-white relative overflow-hidden group transition-all duration-500 hover:shadow-2xl dark:hover:shadow-blue-500/20">
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              
              <div className="text-center lg:text-left space-y-4 max-w-2xl">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase leading-[0.9]">
                  {dict.contact.ctaTitle || "Vamos Conversar?"}
                </h2>
                <p className="opacity-70 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs">
                  {dict.meta.description}
                </p>
              </div>

              <a 
                href={`mailto:${dict.common.email}`} 
                className="inline-flex items-center justify-center bg-white text-slate-950 px-10 py-5 rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-100 transition-transform active:scale-95 shadow-xl"
              >
                {dict.contact.buttonText || "Entrar em Contato"}
              </a>
            </div>
            
            {/* Decoração Visual */}
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/5 rounded-full blur-[120px] group-hover:bg-white/10 transition-colors pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />
          </div>
        </section>
      </main>
    </ProxyPage>
  );
}
