// src/app/[lang]/page.tsx
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import { getDictionary } from "@/dictionaries";
import type { Locale, Dictionary } from "@/types/dictionary";
import { getGitHubProjects } from "@/services/githubService";

import ProxyPage from "@/components/ProxyPage";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";

// ---------------------------------------------
// Tipos
// ---------------------------------------------
interface PageProps {
  params: Promise<{
    lang: Locale;
  }>;
}

// ---------------------------------------------
// Constantes
// ---------------------------------------------
const SUPPORTED_LOCALES: readonly Locale[] = [
  "pt-BR",
  "en-US",
  "es-ES",
  "es-AR",
  "es-MX",
] as const;

// ---------------------------------------------
// Static Params (SSG)
// ---------------------------------------------
export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

// ---------------------------------------------
// Viewport
// ---------------------------------------------
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

// ---------------------------------------------
// Metadata (SEO)
// ---------------------------------------------
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { lang } = await params;

  if (!SUPPORTED_LOCALES.includes(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://portfoliosantossergio.vercel.app";

  const homeSeo = dict.seo.pages?.home;
  const pageTitle = `${homeSeo?.title ?? "Portfolio"} | ${dict.meta.author}`;

  return {
    title: pageTitle,
    description: homeSeo?.description ?? dict.seo.description,
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

// ---------------------------------------------
// Page
// ---------------------------------------------
export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;

  // Validação de locale (404 real)
  if (!SUPPORTED_LOCALES.includes(lang)) {
    notFound();
  }

  const projects = await getGitHubProjects();

  return (
    <ProxyPage lang={lang}>
      {(dictionary: Dictionary) => (
        <main className="relative min-h-screen w-full overflow-x-hidden bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100">
          
          {/* Hero */}
          <HeroSection
            content={dictionary.hero}
            common={dictionary.common}
            metrics={dictionary.metrics}
            about={dictionary.about}
            lang={lang}
          />

          {/* About */}
          <AboutSection lang={lang} dict={dictionary} />

          {/* Projects */}
          <section
            id="projects"
            className="container mx-auto px-4 md:px-8 lg:px-16 py-12 md:py-24 max-w-7xl"
          >
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-12">
              {dictionary.projects.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <article
                    key={project.id}
                    className="group p-6 border rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10"
                  >
                    <span className="text-[10px] font-bold uppercase text-blue-600">
                      {dictionary.projects.categories[
                        project.technology.labelKey as keyof typeof dictionary.projects.categories
                      ] ?? project.technology.id}
                    </span>

                    <h3 className="text-xl font-bold mt-2">
                      {project.name}
                    </h3>

                    <p className="text-sm mt-3 text-slate-600 dark:text-slate-400 line-clamp-3">
                      {project.description}
                    </p>

                    <a
                      href={project.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-6 text-xs font-bold underline"
                    >
                      {dictionary.projects.viewProject}
                    </a>
                  </article>
                ))
              ) : (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                  <p className="text-slate-500">
                    {dictionary.states.emptyProjects.description}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-slate-200 py-12 text-center">
            <p className="text-sm text-slate-500">
              {dictionary.common.footer}
            </p>
          </footer>
        </main>
      )}
    </ProxyPage>
  );
}
