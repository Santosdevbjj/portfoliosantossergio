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

// --------------------------------------------------
// Types (Next 16 & TS 6.0 Strict)
// --------------------------------------------------
interface PageProps {
  params: Promise<{ lang: string }>;
}

// --------------------------------------------------
// Static Generation
// --------------------------------------------------
export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

// --------------------------------------------------
// Viewport & Dynamic Config
// --------------------------------------------------
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

export const dynamic = "force-static";
export const revalidate = 3600; 

// --------------------------------------------------
// Metadata (SEO Multilíngue)
// --------------------------------------------------
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const lang = params?.lang;

  if (!lang || !isValidLocale(lang)) return {};

  const dict = await getServerDictionary(lang as Locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfoliosantossergio.vercel.app";

  return {
    title: dict.seo.pages.home.title,
    description: dict.seo.pages.home.description,
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
}

// --------------------------------------------------
// Page Component
// --------------------------------------------------
export default async function HomePage(props: PageProps) {
  const resolvedParams = await props.params;
  const rawLang = resolvedParams?.lang;

  if (!rawLang || !isValidLocale(rawLang)) {
    notFound();
  }

  const lang = rawLang as Locale;

  let allProjects: ProcessedProject[] = [];
  let dict;

  try {
    const [dictionaryData, projectsData] = await Promise.all([
      getServerDictionary(lang),
      getGitHubProjects("Santosdevbjj")
    ]);
    
    dict = dictionaryData;
    allProjects = projectsData;
    
  } catch (error) {
    console.error("Erro ao carregar dados da página:", error);
    if (!dict) notFound();
  }

  // SEPARAÇÃO LÓGICA DAS CATEGORIAS
  // Projetos de Software (1 a 16)
  const softwareProjects = allProjects.filter(p => p.category !== "Artigos Técnicos");
  
  // Repositório de Artigos Técnicos (17)
  const technicalArticles = allProjects.filter(p => p.category === "Artigos Técnicos");

  return (
    <ProxyPage lang={lang}>
      <main className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-300">
        
        <HeroSection dictionary={dict} />

        <AboutSection dict={dict.about} />

        {/* --- SEÇÃO DE PROJETOS (1 a 16) --- */}
        <section className="container mx-auto px-4 md:px-8 lg:px-16 py-16 max-w-7xl" id="projects">
          <header className="mb-12">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
              {dict.projects.title}
            </h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {softwareProjects.length > 0 ? (
              softwareProjects.map((project) => (
                <article
                  key={project.id}
                  className="group flex flex-col justify-between p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 bg-slate-50/50 dark:bg-slate-900/50"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {project.name}
                      </h3>
                      <span className="text-[10px] px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-800 font-mono font-medium">
                        {project.category}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {project.problem}
                      </p>
                      {project.solution && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {project.solution}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-8">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold uppercase tracking-wider underline decoration-2 underline-offset-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {dict.projects.viewProject}
                    </a>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full text-center py-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                <p className="text-slate-500 font-medium">{dict.states.emptyProjects.description}</p>
              </div>
            )}
          </div>
        </section>

        {/* --- SEÇÃO 17: ARTIGOS TÉCNICOS --- */}
        <section className="container mx-auto px-4 md:px-8 lg:px-16 py-16 max-w-7xl border-t border-slate-200 dark:border-slate-800" id="articles">
          <header className="mb-12">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
              17) Repositório de Artigos Técnicos
            </h2>
          </header>

          <div className="grid grid-cols-1 gap-6">
            {technicalArticles.length > 0 ? (
              technicalArticles.map((article) => (
                <article
                  key={article.id}
                  className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {article.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 italic">
                        {article.problem}
                      </p>
                    </div>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                    >
                      LER ARTIGO COMPLETO
                    </a>
                  </div>
                </article>
              ))
            ) : (
              <div className="p-8 text-center bg-slate-100 dark:bg-slate-800/50 rounded-2xl">
                <p className="text-slate-500">Aguardando novas publicações técnicas...</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </ProxyPage>
  );
}
