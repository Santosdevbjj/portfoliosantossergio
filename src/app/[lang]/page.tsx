// src/app/[lang]/page.tsx

import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import type { Locale, Dictionary } from "@/types/dictionary";
import type { ProjectDomain } from "@/domain/projects";

import { getGitHubProjects } from "@/services/githubService";
import { mapGitHubRepoToProject } from "@/mappers/projectMapper";
import { getServerDictionary } from "@/lib/getServerDictionary";

import { SUPPORTED_LOCALES, isValidLocale } from "@/dictionaries/locales";

import ProxyPage from "@/components/ProxyPage";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";

// --------------------------------------------------
// Types
// --------------------------------------------------
interface PageProps {
  params: {
    lang: Locale;
  };
}

// --------------------------------------------------
// SSG
// --------------------------------------------------
export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

// --------------------------------------------------
// Viewport (Next 16 padrão)
// --------------------------------------------------
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

// --------------------------------------------------
// Metadata (SEO por idioma)
// --------------------------------------------------

export async function generateMetadata(
  { params }: PageProps,
): Promise<Metadata> {
  const { lang } = params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const dict = await getServerDictionary(lang);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://portfoliosantossergio.vercel.app";

  const homeSeo = dict.seo?.pages?.home;

  if (!homeSeo) {
    return {
      title: dict.meta.author,
      description: dict.meta.description ?? "",
    };
  }

  return {
    title: `${homeSeo.title} | ${dict.meta.author}`,
    description: homeSeo.description,
    alternates: {
      canonical: `${siteUrl}/${lang}`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          locale,
          `${siteUrl}/${locale}`,
        ]),
      ),
    },
  };
}


// --------------------------------------------------
// Page
// --------------------------------------------------
export default async function HomePage({ params }: PageProps) {
  const { lang } = params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  // Fetch apenas do GitHub
  const repos = await getGitHubProjects("Santosdevbjj");

  const projects: ProjectDomain[] = repos.map(mapGitHubRepoToProject);

  return (
    <ProxyPage lang={lang}>
      {(dict: Dictionary) => (
        <main
          id="main-content"
          className="relative min-h-screen w-full overflow-x-hidden bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100"
        >
          {/* HERO */}
           <HeroSection dictionary={dict} />

          {/* ABOUT */}  
         <AboutSection dict={dict.about} lang={lang} />

          {/* PROJECTS */}
          <section
            id="projects"
            className="container mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-24 max-w-7xl"
          >
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-12">
              {dict.projects.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <article
                    key={project.id}
                    className="group p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20 transition hover:shadow-xl"
                  >
                    <span className="text-[11px] font-bold uppercase text-blue-600 tracking-wider">
                      {
                        dict.projects.categories[
                          project.technology.labelKey
                        ]
                      }
                    </span>

                    <h3 className="text-xl font-bold mt-3">
                      {project.name}
                    </h3>

                    <p className="text-sm mt-3 text-slate-600 dark:text-slate-400 line-clamp-3">
                      {project.description}
                    </p>

                    <a
                      href={project.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-6 text-xs font-bold underline hover:opacity-70 transition"
                    >
                      {dict.projects.viewProject}
                    </a>
                  </article>
                ))
              ) : (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl">
                  <p className="text-slate-500">
                    {dict.states.emptyProjects.description}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* FOOTER */}
          <footer className="border-t border-slate-200 dark:border-slate-800 py-12 text-center">
            <p className="text-sm text-slate-500">
              {dict.common.footer}
            </p>
          </footer>
        </main>
      )}
    </ProxyPage>
  );
}
