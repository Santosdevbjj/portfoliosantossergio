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
import ExperienceSection from "@/components/ExperienceSection";
import FeaturedProjectsSection from "@/components/featured/FeaturedProjectsSection";
import FeaturedArticleSection from "@/components/FeaturedArticleSection";
import ContactSection from "@/components/ContactSection";

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
  
  const [dictData, githubProjects] = await Promise.all([
    getServerDictionary(lang).catch(() => null),
    getGitHubProjects("Santosdevbjj").catch(() => [] as ProcessedProject[])
  ]);

  if (!dictData) {
    notFound();
  }

  // Filtra projetos que não são artigos
  const filteredGitHubProjects = githubProjects.filter(
    p => !p.name.toLowerCase().includes("articles") && !p.name.toLowerCase().includes("artigos")
  );

  // Mapeia o PDF correto baseado no idioma
  const cvPath = `/cv-sergio-santos-${lang}.pdf`;

  // Prepara o dicionário injetando os projetos do GitHub nos destaques se necessário
  const dict = {
    ...dictData,
    projects: {
      ...dictData.projects,
      // Se o dicionário não tiver destaques fixos, usamos os 3 primeiros do GitHub
      featuredProjects: dictData.projects?.featuredProjects?.length 
        ? dictData.projects.featuredProjects 
        : filteredGitHubProjects.slice(0, 3)
    }
  };

  return (
    <ProxyPage lang={lang}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] bg-blue-600 text-white p-4 rounded-lg">
        Pular para o conteúdo
      </a>

      <main id="main-content" className="flex flex-col min-h-screen bg-white dark:bg-[#020617]">
        
        <div className="pt-20 md:pt-0">
          <HeroSection dictionary={dict} />
        </div>

        {/* ABOUT SECTION COM CORREÇÃO DO CV DINÂMICO */}
        <section id="about-section" className="relative">
          <AboutSection dict={dict.about} />
          
          <div className="container mx-auto px-6 pb-12 -mt-8 flex flex-wrap gap-4 justify-center md:justify-start max-w-7xl">
            <a 
              href={cvPath} 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-lg active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {dict.about?.viewCV || "Visualizar CV"}
            </a>
          </div>
        </section>

        <ExperienceSection experience={dict.experience} />

        {/* PROJETOS EM DESTAQUE - Passando os dados processados */}
        <FeaturedProjectsSection lang={lang} dict={dict as any} />

        {/* GRADE COMPLETA DE PROJETOS (GITHUB) */}
        <section className="container mx-auto px-6 py-16 max-w-7xl" id="all-projects">
          <header className="mb-12">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic dark:text-white">
              {dict.projects.title} (GitHub)
            </h2>
            <div className="h-1.5 w-20 bg-blue-600 mt-4" />
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGitHubProjects.map((project) => (
              <article
                key={project.id}
                className="group flex flex-col justify-between p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all duration-300 bg-slate-50/30 dark:bg-slate-900/30 shadow-sm hover:shadow-xl"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold dark:text-white group-hover:text-blue-600 transition-colors">{project.name}</h3>
                    <span className="text-[9px] px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-slate-800 dark:text-blue-400 font-bold uppercase">
                      {project.category || 'Ciência de Dados'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-6 leading-relaxed">
                    {project.solution || project.problem || "Explorar código e análise técnica no repositório oficial."}
                  </p>
                </div>
                <a 
                  href={project.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-blue-600 hover:gap-2 transition-all"
                >
                  {dict.projects.viewProject || "Ver Repositório GitHub"} <span className="ml-1">→</span>
                </a>
              </article>
            ))}
          </div>
        </section>

        <FeaturedArticleSection 
          articles={dict.articles} 
          common={dict.common} 
        />

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
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mb-10 text-lg leading-relaxed">
                  Artigos técnicos e documentação de arquitetura renderizados dinamicamente via MDX diretamente do GitHub.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href={`/${lang}/artigos`} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-black uppercase text-[10px] text-center hover:bg-blue-700 transition-colors">
                    Explorar Biblioteca →
                  </a>
                  <a href={`/${lang}/artigos/README`} className="border-2 border-slate-200 dark:border-slate-800 px-8 py-4 rounded-xl font-black uppercase text-[10px] dark:text-white text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    Documentação (README)
                  </a>
                </div>
              </div>
            </article>
          </div>
        </section>

        <ContactSection 
          contact={dict.contact} 
          common={dict.common} 
          locale={lang} 
        />
      </main>
    </ProxyPage>
  );
}
