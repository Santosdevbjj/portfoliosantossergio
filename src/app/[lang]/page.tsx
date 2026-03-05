// src/app/[lang]/page.tsx
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

// Types
import type { Locale } from "@/types/dictionary";
import type { ProcessedProject } from "@/types/github";

// Services & Helpers
import { getGitHubProjects } from "@/services/githubService";
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

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

export const dynamic = "force-static";
export const revalidate = 60; 

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const resolvedParams = await props.params;
  const lang = resolvedParams?.lang;
  
  if (!lang || !isValidLocale(lang)) return {};

  const dict = await getServerDictionary(lang as Locale);
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
      },
    },
  };
}

export default async function HomePage(props: PageProps) {
  const { lang: rawLang } = await props.params;

  if (!rawLang || !isValidLocale(rawLang)) {
    notFound();
  }

  const lang = rawLang as Locale;
  let projects: ProcessedProject[] = [];
  let dict: any;

  try {
    const [dictionaryData, projectsData] = await Promise.all([
      getServerDictionary(lang),
      getGitHubProjects("Santosdevbjj")
    ]);
    
    dict = dictionaryData;
    // Remove repositórios de artigos da lista geral
    projects = projectsData.filter(p => !p.name.toLowerCase().includes("articles") && !p.name.toLowerCase().includes("artigos")); 
    
  } catch (error) {
    console.error("Erro ao carregar dados da Home:", error);
    if (!dict) notFound();
  }

  return (
    <ProxyPage lang={lang}>
      <main className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100">
        
        <HeroSection dictionary={dict} />
        
        <AboutSection dict={dict.about} />

        {/* Uso do seu componente especializado para os 3 projetos de destaque */}
        <FeaturedProjectsSection 
          dict={dict.projects} 
          projects={projects.slice(0, 3)} 
        />

        {/* Uso do seu componente especializado para Artigos */}
        <FeaturedArticleSection 
          lang={lang}
          dict={dict.articles}
        />

        {/* Banner de CTA Final (Pode virar um componente próprio depois) */}
        <section className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="p-12 rounded-[3rem] bg-slate-900 dark:bg-blue-600 text-white relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-3xl md:text-4xl font-black tracking-tighter italic uppercase mb-2">
                  {dict.contact.ctaTitle || "Vamos construir algo juntos?"}
                </h3>
                <p className="opacity-70 font-medium uppercase tracking-widest text-[10px]">
                  Especialista em Modernização de Dados e Governança
                </p>
              </div>
              <a 
                href="mailto:santossergiorealbjj@outlook.com" 
                className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-2xl"
              >
                {dict.contact.buttonText || "Entrar em Contato →"}
              </a>
            </div>
          </div>
        </section>
      </main>
    </ProxyPage>
  );
}
