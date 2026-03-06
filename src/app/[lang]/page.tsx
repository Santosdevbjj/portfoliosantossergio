/**
 * HOME PAGE - PORTFÓLIO SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * ✔ Stack: Next.js 16, React 19, TS 6.0, Tailwind 4.2
 * ✔ Filtros de tecnologia sincronizados com CATEGORY_ORDER
 */

import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

// Types
import type { Locale, Dictionary } from "@/types/dictionary";
import type { ProjectDomain } from "@/domain/projects";

// Services & Helpers
import { getServerDictionary } from "@/lib/getServerDictionary";
import { getGitHubProjects } from "@/services/githubService";
import { SUPPORTED_LOCALES, isValidLocale } from "@/dictionaries/locales";
import { resolveProjectTechnology, resolveProjectFlags } from "@/domain/projects";

// Components
import ProxyPage from "@/components/ProxyPage";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import FeaturedArticleSection from "@/components/FeaturedArticleSection";
import ContactSection from "@/components/ContactSection";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { CareerHighlights } from "@/components/CareerHighlights";

interface PageProps {
  params: Promise<{ lang: string }>;
}

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

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { lang: rawLang } = await props.params;
  if (!rawLang || !isValidLocale(rawLang)) return {};

  try {
    const dict: Dictionary = await getServerDictionary(rawLang as Locale);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfoliosantossergio.vercel.app";

    return {
      title: dict?.seo?.pages?.home?.title ?? "Sérgio Santos",
      description: dict?.seo?.pages?.home?.description ?? "Portfolio",
      alternates: {
        canonical: `${siteUrl}/${rawLang}`,
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
  const { lang: rawLang } = await props.params;

  if (!rawLang || !isValidLocale(rawLang)) {
    notFound();
  }

  const lang = rawLang as Locale;
  
  const [dictData, githubProjects] = await Promise.all([
    getServerDictionary(lang).catch(() => null),
    getGitHubProjects("Santosdevbjj").catch(() => [])
  ]);

  if (!dictData) notFound();

  // Processamento rigoroso dos projetos do GitHub
  const domainProjects: readonly ProjectDomain[] = (githubProjects as any[])
    .filter(p => {
      const topics = Array.isArray(p.topics) ? p.topics.map((t: string) => t.toLowerCase()) : [];
      // Regra 1: Deve ter a tag 'portfolio'
      // Regra 2: Ignorar repositórios de artigos para não duplicar seções
      return topics.includes("portfolio") && 
             !p.name.toLowerCase().includes("articles") &&
             !p.name.toLowerCase().includes("artigos");
    })
    .map(p => {
      const topics: string[] = p.topics || [];
      const flags = resolveProjectFlags(topics);
      const tech = resolveProjectTechnology(topics);
      
      return {
        id: String(p.id),
        name: p.name,
        description: p.description || "",
        htmlUrl: p.html_url || "",
        homepage: p.homepage || null,
        topics: topics,
        technology: tech,
        isPortfolio: true, 
        isFeatured: flags.isFeatured,
        isFirst: flags.isFirst,
      };
    });

  const dict: Dictionary = {
    ...dictData,
    contact: {
      ...dictData.contact,
      cvLabel: dictData.contact.cvLabel || "Ver CV",
    }
  };

  return (
    <ProxyPage lang={lang}>
      <main id="main-content" className="flex flex-col min-h-screen bg-white dark:bg-[#020617]">
        
        <div className="pt-20 md:pt-0">
          <HeroSection dictionary={dict} />
        </div>

        <section id="about" className="relative overflow-hidden">
          <AboutSection dict={dict.about} />
          <div className="container mx-auto px-6 max-w-7xl">
            <CareerHighlights dict={dict} />
          </div>

          <div className="container mx-auto px-6 py-16 flex justify-center md:justify-start max-w-7xl">
            <a 
              href={`/cv-sergio-santos-${lang}.pdf`} 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl active:scale-95"
            >
              {dict.contact.cvLabel}
            </a>
          </div>
        </section>

        <ExperienceSection experience={dict.experience} />

        {/* Grid de Portfólio com injeção de dados processados */}
        <PortfolioGrid 
          projects={domainProjects} 
          lang={lang} 
          dict={dict} 
        />

        <FeaturedArticleSection 
          articles={dict.articles} 
          common={dict.common} 
        />

        <ContactSection 
          contact={dict.contact} 
          common={dict.common} 
          locale={lang} 
        />
      </main>
    </ProxyPage>
  );
}
