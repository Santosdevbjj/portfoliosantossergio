import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

// Types
import type { Locale, Dictionary } from "@/types/dictionary";
import type { ProcessedProject } from "@/types/github";

// Services & Helpers
import { getServerDictionary } from "@/lib/getServerDictionary";
import { getGitHubProjects } from "@/services/githubService";
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
  const { lang: rawLang } = await props.params;

  if (!rawLang || !isValidLocale(rawLang)) {
    notFound();
  }

  const lang = rawLang as Locale;
  
  [span_1](start_span)[span_2](start_span)// 1. Busca de dados em paralelo[span_1](end_span)[span_2](end_span)
  const [dictData, githubProjects] = await Promise.all([
    getServerDictionary(lang).catch(() => null),
    getGitHubProjects("Santosdevbjj").catch(() => [] as ProcessedProject[])
  ]);

  if (!dictData) {
    notFound();
  }

  [span_3](start_span)[span_4](start_span)// 2. Filtro de projetos (remove artigos da grade principal)[span_3](end_span)[span_4](end_span)
  const filteredGitHubProjects = githubProjects.filter(
    p => !p.name.toLowerCase().includes("articles") && !p.name.toLowerCase().includes("artigos")
  );

  [span_5](start_span)// 3. Unificação dos dados para o componente de Destaques[span_5](end_span)
  const dict = {
    ...dictData,
    projects: {
      ...dictData.projects,
      featuredProjects: filteredGitHubProjects.length > 0 ? filteredGitHubProjects : dictData.projects?.featuredProjects
    }
  };

  return (
    <ProxyPage lang={lang}>
      <main className="flex flex-col min-h-screen bg-white dark:bg-[#020617]">
        
        {/* HERO */}
        <HeroSection dictionary={dict} />

        [span_6](start_span){/* ABOUT & CV TREATMENT - Adicionado botão de download para o CV[span_6](end_span) */}
        <section id="about-section" className="relative">
          <AboutSection dict={dict.about} />
          <div className="container mx-auto px-6 pb-12 -mt-8 flex justify-center md:justify-start max-w-7xl">
            <a 
              href="/curriculo.pdf" 
              download="Curriculo_Sergio_Santos.pdf"
              className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-lg active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d=" clerks 4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download CV (PDF)
            </a>
          </div>
        </section>

        [span_7](start_span){/* PROJETOS EM DESTAQUE - Usa os 3 primeiros projetos mapeados[span_7](end_span) */}
        <FeaturedProjectsSection lang={lang} dict={dict as any} />

        [span_8](start_span)[span_9](start_span){/* GRADE COMPLETA DE PROJETOS - Recuperada da versão antiga para mostrar todos[span_8](end_span)[span_9](end_span) */}
        <section className="container mx-auto px-6 py-16 max-w-7xl" id="all-projects">
          <header className="mb-12">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic dark:text-white">
              {dict.projects.title} (All Repos)
            </h2>
            <div className="h-1.5 w-20 bg-blue-600 mt-4" />
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGitHubProjects.map((project) => (
              <article
                key={project.id}
                className="group flex flex-col justify-between p-6 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all bg-slate-50/30 dark:bg-slate-900/30"
              >
                <div>
                  <h3 className="text-xl font-bold mb-3 dark:text-white">{project.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4">
                    {project.solution || project.problem}
                  </p>
                </div>
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-xs font-black text-blue-600 uppercase tracking-widest">
                  {dict.projects.viewProject} →
                </a>
              </article>
            ))}
          </div>
        </section>

        [span_10](start_span){/* ARTIGO VENCEDOR[span_10](end_span) */}
        <FeaturedArticleSection 
          articles={dict.articles} 
          common={dict.common} 
        />

        [span_11](start_span)[span_12](start_span){/* KNOWLEDGE BASE[span_11](end_span)[span_12](end_span) */}
        <section className="container mx-auto px-6 py-24 max-w-7xl border-t border-slate-100 dark:border-slate-900" id="knowledge-base">
          <header className="mb-12">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic dark:text-white">
               Journal & Artigos
            </h2>
          </header>

          <div className="grid grid-cols-1 gap-8">
            <article className="group flex flex-col justify-between p-10 rounded-[2.5rem] border-2 border-blue-600 bg-blue-50/5 dark:bg-blue-900/5 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-3xl font-black italic text-blue-600 mb-6">myArticles</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl mb-10">
                  [span_13](start_span)Artigos renderizados dinamicamente via MDX diretamente do GitHub.[span_13](end_span)
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href={`/${lang}/artigos`} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-black uppercase text-[10px] text-center">
                    Explorar Biblioteca →
                  </a>
                  <a href={`/${lang}/artigos/README`} className="border-2 border-slate-200 dark:border-slate-800 px-8 py-4 rounded-xl font-black uppercase text-[10px] dark:text-white text-center">
                    README
                  </a>
                </div>
              </div>
            </article>
          </div>
        </section>

        [span_14](start_span){/* FINAL CTA[span_14](end_span) */}
        <section className="py-28 px-6 text-center bg-slate-950">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
              {dict.contact?.ctaTitle || "Vamos Conversar?"}
            </h2>
            <a
              href={`mailto:${dict.common.email}`}
              className="inline-flex items-center justify-center bg-white text-slate-950 px-10 py-5 rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-100 shadow-xl"
            >
              {dict.contact?.buttonText || "Entrar em Contato"}
            </a>
          </div>
        </section>
      </main>
    </ProxyPage>
  );
}
