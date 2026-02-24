// src/app/[lang]/page.tsx
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

// Types
import type { Locale } from "@/types/dictionary";
import type { ProjectDomain } from "@/domain/projects";

// Services & Helpers
import { getGitHubProjects } from "@/services/githubService";
import { mapGitHubRepoToProject } from "@/mappers/projectMapper";
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
// Static Generation (Crucial para evitar erro de Prerender)
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

// Força a geração estática e evita que APIs dinâmicas quebrem o build
export const dynamic = "force-static";
export const revalidate = 3600; // Revalida o cache a cada hora

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
  // 1. Resolução segura dos parâmetros
  const resolvedParams = await props.params;
  const rawLang = resolvedParams?.lang;

  // 2. Validação rigorosa para evitar o erro "undefined reading lang"
  if (!rawLang || !isValidLocale(rawLang)) {
    notFound();
  }

  const lang = rawLang as Locale;

  // 3. Busca de dados paralela
  // Adicionamos um try/catch interno ou fallback para garantir que o build não quebre se o GitHub falhar
  let projects: ProjectDomain[] = [];
  let dict;

  try {
    const [dictionaryData, repos] = await Promise.all([
      getServerDictionary(lang),
      getGitHubProjects("Santosdevbjj")
    ]);
    dict = dictionaryData;
    projects = repos.map(mapGitHubRepoToProject);
  } catch (error) {
    console.error("Erro ao carregar dados da página:", error);
    // Se o dicionário falhar, não temos como renderizar
    if (!dict) notFound();
  }

  return (
    <ProxyPage lang={lang}>
      <main className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-300">
        
        {/* Seção Hero - Responsividade intrínseca */}
        <HeroSection dictionary={dict} />

        {/* Seção Sobre */}
        <AboutSection dict={dict.about} />

        {/* Seção de Projetos - Grid Adaptativo 1 col (mobile) -> 2 cols (desktop) */}
        <section className="container mx-auto px-4 md:px-8 lg:px-16 py-16 max-w-7xl" id="projects">
          <header className="mb-12">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
              {dict.projects.title}
            </h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.length > 0 ? (
              projects.map((project) => (
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
                        {dict.projects.categories[project.technology.labelKey] || project.technology.labelKey}
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3">
                      {project.description || dict.states.emptyProjects.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-8">
                    <a
                      href={project.htmlUrl}
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
      </main>
    </ProxyPage>
  );
}
